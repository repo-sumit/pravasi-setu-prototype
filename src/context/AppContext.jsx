import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { APPLICATIONS, TRANSFERS, GRIEVANCES, CERTIFICATES, PRE_DEPARTURE_CHECKLIST } from '../data/mockData'
import {
  loadSession, saveSession, clearSession,
  loadProfile, saveProfile,
  loadAppState, saveAppState,
  loadLanguage, saveLanguage,
  loadSlice, saveSlice,
  STORAGE_KEYS,
} from '../utils/storage'

// Prototype-only local persistence. Replace with secure backend / session
// storage in production.

const AppContext = createContext(null)

const DEFAULT_PROFILE = {
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  age: 28,
  dob: '1997-07-14',
  gender: 'Male',
  location: 'Lucknow, Uttar Pradesh',
  education: '10th Pass',
  aadhaarVerified: true,
  apaarVerified: true,
  digilockerLinked: true,
  pccVerified: false,
  skills: [
    { name: 'Electrician', level: 'Skilled',       verified: true,  years: 5 },
    { name: 'Welding',     level: 'Semi-skilled',  verified: true,  years: 2 },
    { name: 'Plumbing',    level: 'Beginner',      verified: false, years: 1 },
  ],
  certifications: CERTIFICATES,
  experience: [
    { role: 'Electrician',         company: 'L&T Construction', duration: '2019 – 2023', country: 'India' },
    { role: 'Maintenance Helper',  company: 'Tata Projects',    duration: '2018 – 2019', country: 'India' },
  ],
}

const DEFAULT_SESSION = {
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  kycStatus: 'pending',
  createdAt: null,
}

// Routes that should never be restored on refresh — if the persisted
// lastRoute is one of these, fall back to home for an authenticated user.
const TRANSIENT_ROUTES = new Set(['splash', 'login', 'otp', 'kyc'])

function pickInitialScreen(session, persistedAppState) {
  if (!session?.isAuthenticated) {
    // No session — start at splash (language pick) unless one was already chosen.
    if (loadLanguage()) return 'login'
    return 'splash'
  }
  const last = persistedAppState?.lastRoute
  if (last && !TRANSIENT_ROUTES.has(last)) return last
  return 'home'
}

export function AppProvider({ children }) {
  // Hydrate from localStorage on first render.
  const persistedSession  = loadSession()  || DEFAULT_SESSION
  const persistedProfile  = loadProfile()  || DEFAULT_PROFILE
  const persistedAppState = loadAppState() || {}
  const persistedLang     = loadLanguage() || 'en'

  const [session,      setSession]      = useState(persistedSession)
  const [profile,      setProfile]      = useState(persistedProfile)
  const [lang,         setLang]         = useState(persistedLang)
  const [applications, setApplications] = useState(() => loadSlice(STORAGE_KEYS.applications, null) || APPLICATIONS)
  const [transfers,    setTransfers]    = useState(() => loadSlice(STORAGE_KEYS.transfers,    null) || TRANSFERS)
  const [tickets,      setTickets]      = useState(() => loadSlice(STORAGE_KEYS.tickets,      null) || GRIEVANCES)
  const [certificates, setCertificates] = useState(() => loadSlice(STORAGE_KEYS.certificates, null) || CERTIFICATES)
  const [checklist,    setChecklist]    = useState(() => loadSlice(STORAGE_KEYS.checklist,    null) || PRE_DEPARTURE_CHECKLIST)

  const initialScreen = pickInitialScreen(persistedSession, persistedAppState)
  const [screen, setScreen] = useState(initialScreen)
  const [stack,  setStack]  = useState([initialScreen])
  const [params, setParams] = useState(persistedAppState?.lastParams || {})
  const [toast,  setToast]  = useState({ message: '', type: '', visible: false })
  const toastTimer = useRef(null)

  // ── Persist on change ───────────────────────────────────────────────────
  useEffect(() => { saveSession(session)   }, [session])
  useEffect(() => { saveProfile(profile)   }, [profile])
  useEffect(() => { saveLanguage(lang)     }, [lang])
  useEffect(() => { saveSlice(STORAGE_KEYS.applications, applications) }, [applications])
  useEffect(() => { saveSlice(STORAGE_KEYS.transfers,    transfers)    }, [transfers])
  useEffect(() => { saveSlice(STORAGE_KEYS.tickets,      tickets)      }, [tickets])
  useEffect(() => { saveSlice(STORAGE_KEYS.certificates, certificates) }, [certificates])
  useEffect(() => { saveSlice(STORAGE_KEYS.checklist,    checklist)    }, [checklist])
  useEffect(() => { saveAppState({ lastRoute: screen, lastParams: params }) }, [screen, params])

  // ── Navigation ──────────────────────────────────────────────────────────
  const navigate = useCallback((id, p = {}) => {
    setParams(p)
    setStack(s => [...s, id])
    setScreen(id)
  }, [])

  const goBack = useCallback(() => {
    setStack(s => {
      if (s.length <= 1) return s
      const next = s.slice(0, -1)
      setScreen(next[next.length - 1])
      return next
    })
  }, [])

  const goHome = useCallback(() => {
    setStack(['home'])
    setScreen('home')
  }, [])

  // ── Toast ───────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = '') => {
    setToast({ message, type, visible: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => {
      setToast(t => ({ ...t, visible: false }))
    }, 2400)
  }, [])

  // ── Auth ────────────────────────────────────────────────────────────────
  const signIn = useCallback((opts = {}) => {
    setSession(s => ({
      ...s,
      isAuthenticated: true,
      hasCompletedOnboarding: opts.hasCompletedOnboarding ?? s.hasCompletedOnboarding,
      kycStatus: opts.kycStatus ?? s.kycStatus,
      createdAt: s.createdAt || Date.now(),
    }))
  }, [])

  const completeKYC = useCallback(() => {
    setSession(s => ({
      ...s,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      kycStatus: 'verified',
      createdAt: s.createdAt || Date.now(),
    }))
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setSession(DEFAULT_SESSION)
    setProfile(DEFAULT_PROFILE)
    setApplications(APPLICATIONS)
    setTransfers(TRANSFERS)
    setTickets(GRIEVANCES)
    setCertificates(CERTIFICATES)
    setChecklist(PRE_DEPARTURE_CHECKLIST)
    setStack(['login'])
    setScreen('login')
    setParams({})
  }, [])

  // ── Slice mutators (used by pages) ──────────────────────────────────────
  const addApplication = useCallback((app) => setApplications(a => [app, ...a]), [])
  const addTransfer    = useCallback((t)   => setTransfers(arr => [t, ...arr]), [])
  const addTicket      = useCallback((t)   => setTickets(arr => [t, ...arr]), [])

  return (
    <AppContext.Provider value={{
      // navigation
      screen, navigate, goBack, goHome, params,
      // localisation
      lang, setLang,
      // user
      profile, setProfile,
      // toast
      toast, showToast,
      // session / auth
      session,
      isAuthenticated: session.isAuthenticated,
      signIn, completeKYC, signOut,
      // persisted slices
      applications, addApplication,
      transfers,    addTransfer,
      tickets,      addTicket,
      certificates, setCertificates,
      checklist,    setChecklist,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
