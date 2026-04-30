import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const AppContext = createContext(null)

const DEFAULT_PROFILE = {
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  age: 28,
  gender: 'Male',
  location: 'Lucknow, Uttar Pradesh',
  education: '10th Pass',
  aadhaarVerified: true,
  apaarVerified: true,
  digilockerLinked: true,
  pccVerified: false,
  skills: [
    { name: 'Electrician', level: 'Skilled', verified: true, years: 5 },
    { name: 'Welding', level: 'Semi-skilled', verified: true, years: 2 },
    { name: 'Plumbing', level: 'Beginner', verified: false, years: 1 },
  ],
  certifications: [
    { name: 'ITI Electrician — NCVT', issuer: 'Govt. ITI Lucknow', year: 2018, verified: true },
    { name: 'Skill India — Electrician Level 4', issuer: 'NSDC', year: 2020, verified: true },
    { name: 'Welding Safety Course', issuer: 'CIPET', year: 2022, verified: false },
  ],
  experience: [
    { role: 'Electrician', company: 'L&T Construction', duration: '2019 – 2023', country: 'India' },
    { role: 'Maintenance Helper', company: 'Tata Projects', duration: '2018 – 2019', country: 'India' },
  ],
}

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('splash')
  const [stack, setStack] = useState(['splash'])
  const [lang, setLang] = useState('en')
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [toast, setToast] = useState({ message: '', type: '', visible: false })
  const [params, setParams] = useState({})
  const toastTimer = useRef(null)

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

  const showToast = useCallback((message, type = '') => {
    setToast({ message, type, visible: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => {
      setToast(t => ({ ...t, visible: false }))
    }, 2400)
  }, [])

  return (
    <AppContext.Provider value={{
      screen, navigate, goBack, goHome, params,
      lang, setLang,
      profile, setProfile,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
