import { MIGRANT_JOBS, MIGRANT_EMPLOYERS, SECTORS, DEST_COUNTRIES } from './migrantJobsData'

// ─── Countries ──────────────────────────────────────────────────────────────
// Derived from the dataset, plus extra GCC/SE-Asia countries for the calculator.
const EXTRA_COUNTRIES = [
  { code: 'BH', name: 'Bahrain',   flag: '🇧🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia',  flag: '🇲🇾' },
]
export const COUNTRIES = [...DEST_COUNTRIES, ...EXTRA_COUNTRIES]

// ─── Jobs ───────────────────────────────────────────────────────────────────
// Adapter that maps dataset records onto the field shape used by older pages
// (employer / city / salary / employerVerified / contract / etc).
function adaptJob(j) {
  return {
    ...j,
    employer: j.employerName,
    city: j.destinationCity,
    country: j.destinationCountry,
    skill: j.requiredSkills?.[0] || j.sector,
    salary: j.salaryLabel,
    salaryNum: j.salaryAvg,
    duration: j.contractDuration,
    travelArranged: j.travelProvided,
    employerVerified: j.verified,
    contract: {
      transparent: j.verified,
      workingHours: '8 hrs/day · 6 days/week',
      overtime: '1.5× after 8 hrs',
      accommodation: j.accommodationProvided ? 'Provided (shared)' : 'Self',
      food: j.mealsProvided ? 'Provided' : 'Self',
      visa: j.visaSupport ? 'Sponsored by employer' : 'Self-arranged',
      flightBack: j.travelProvided ? `After ${Math.max(1, Math.floor(j.contractMonths / 12))} year(s)` : 'Self-arranged',
    },
  }
}

export const JOBS = MIGRANT_JOBS.map(adaptJob)
export { SECTORS }
export const EMPLOYERS = MIGRANT_EMPLOYERS

// ─── Reviews (employer level) ──────────────────────────────────────────────
export const EMPLOYER_REVIEWS = [
  { name: 'Suresh M.', rating: 5, salary: 5, conditions: 5, accommodation: 4, safety: 5, comment: 'Salary always paid on time. Accommodation is decent.', date: '2 weeks ago', verified: true },
  { name: 'Vikash K.', rating: 4, salary: 5, conditions: 4, accommodation: 3, safety: 5, comment: 'Good company. Food allowance was small but everything else fair.', date: '1 month ago', verified: true },
  { name: 'Mohan P.',  rating: 5, salary: 5, conditions: 4, accommodation: 4, safety: 5, comment: 'Worked here 2 years. No exploitation. Recommend.',           date: '2 months ago', verified: true },
  { name: 'Arif S.',   rating: 3, salary: 4, conditions: 3, accommodation: 3, safety: 4, comment: 'OK overall. Long working hours during peak season.',            date: '3 months ago', verified: true },
]

// ─── Remittance ─────────────────────────────────────────────────────────────
export const REMITTANCE_PROVIDERS = [
  { id: 'sbi',   name: 'SBI',                 rate: 22.85, fee: 150, time: '1–2 days', logo: '🏦' },
  { id: 'wu',    name: 'Western Union',       rate: 22.78, fee: 200, time: '< 1 hr',   logo: '💸' },
  { id: 'wise',  name: 'Wise',                rate: 22.92, fee: 90,  time: '< 1 hr',   logo: '🟢' },
  { id: 'rmly',  name: 'Remitly',             rate: 22.88, fee: 0,   time: '< 30 min', logo: '🟣' },
  { id: 'icici', name: 'ICICI Money2India',   rate: 22.80, fee: 100, time: 'Same day', logo: '🏛️' },
]

// ─── Notifications ─────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 'n1', kind: 'job',     title: 'New job match: Industrial Electrician — Dubai', body: 'Salary ₹62,000. Verified employer. Apply now.', time: '10 min ago', urgent: false },
  { id: 'n2', kind: 'visa',    title: 'Visa appointment confirmed', body: 'Sat, 10 May · 11:00 AM at VFS Lucknow.', time: '1 h ago',   urgent: false },
  { id: 'n3', kind: 'payment', title: 'Loan EMI due in 3 days',     body: '₹4,500 due on 3 May. Pay now to avoid penalty.', time: 'Yesterday', urgent: true },
  { id: 'n4', kind: 'fraud',   title: '⚠️ Fraud alert in your area', body: 'Agent "Quick Visa Co." flagged. Avoid contact.',   time: '2 d ago',   urgent: true },
  { id: 'n5', kind: 'support', title: 'Grievance #PS-2031 updated', body: 'Embassy contacted your employer. Awaiting response.', time: '3 d ago', urgent: false },
]

// ─── Grievance tickets (with timeline) ─────────────────────────────────────
export const GRIEVANCES = [
  {
    id: 'PS-2031',
    title: 'Salary delay — 2 months pending',
    category: 'Financial',
    status: 'In Progress',
    date: '15 Apr 2026',
    priority: 'High',
    description: 'Employer has not paid March or April salary. Total pending ₹1,24,000. HR is unresponsive.',
    routedTo: ['MEA / MADAD', 'Indian Embassy — Dubai', 'Pravasi Setu Legal'],
    assignedOfficer: 'R. Iyer · MEA Grievance Cell',
    timeline: [
      { step: 'Filed',         date: '15 Apr 2026', note: 'Ticket raised via app',                                done: true },
      { step: 'Under review',  date: '16 Apr 2026', note: 'Auto-routed to MADAD + Embassy Dubai',                  done: true },
      { step: 'Action taken',  date: '22 Apr 2026', note: 'Embassy contacted employer, demanded reply in 7 days', done: false, current: true },
      { step: 'Resolved',      date: 'Pending',     note: 'Awaiting employer response',                            done: false },
    ],
  },
  {
    id: 'PS-1987',
    title: 'Accommodation unsafe — water leakage',
    category: 'Safety',
    status: 'Resolved',
    date: '02 Mar 2026',
    priority: 'Medium',
    description: 'Severe water leakage in shared accommodation, electrical hazard reported with photos.',
    routedTo: ['Indian Embassy — Dubai', 'Migrants Forum Asia'],
    assignedOfficer: 'P. Mehta · MFA Field Officer',
    timeline: [
      { step: 'Filed',         date: '02 Mar 2026', note: 'Ticket raised via app',                       done: true },
      { step: 'Under review',  date: '03 Mar 2026', note: 'Embassy notified',                            done: true },
      { step: 'Action taken',  date: '08 Mar 2026', note: 'Field officer inspection completed',         done: true },
      { step: 'Resolved',      date: '21 Mar 2026', note: 'Repairs done, alternate housing arranged',   done: true },
    ],
  },
]

// ─── Suggested chatbot prompts ─────────────────────────────────────────────
export const SUGGESTED_PROMPTS = [
  'Find jobs in Dubai',
  'Salary for nurses in Qatar',
  'Is my employer safe?',
  'Verified jobs only',
  'Documents for Saudi Arabia',
  'Migration cost',
  'Send money home',
  'Track my transfer',
  'Talk to support',
  'Urgent help',
]

// ─── Pre-departure checklist ───────────────────────────────────────────────
export const PRE_DEPARTURE_CHECKLIST = [
  { id: 'passport', title: 'Valid Passport (min 6 months)', done: true,  category: 'Documents' },
  { id: 'visa',     title: 'Work Visa',                      done: true,  category: 'Documents' },
  { id: 'pcc',      title: 'Police Clearance Certificate (PCC)', done: false, category: 'Documents' },
  { id: 'medical',  title: 'GAMCA Medical Test',             done: true,  category: 'Health' },
  { id: 'vacc',     title: 'Vaccinations (Yellow Fever, Polio)', done: false, category: 'Health' },
  { id: 'insurance',title: 'Health & Travel Insurance (PBBY)', done: true, category: 'Financial' },
  { id: 'loan',     title: 'Migration Loan Approval',        done: false, category: 'Financial' },
  { id: 'remit',    title: 'Open Remittance Account',        done: true,  category: 'Financial' },
  { id: 'flight',   title: 'Flight Booking',                 done: false, category: 'Travel' },
  { id: 'lang',     title: 'Basic Arabic phrases',           done: false, category: 'Preparation' },
  { id: 'culture',  title: 'Cultural orientation video',     done: true,  category: 'Preparation' },
  { id: 'contract', title: 'Contract reviewed (translated)', done: true,  category: 'Legal' },
  { id: 'embassy',  title: 'Save embassy emergency contact', done: false, category: 'Legal' },
]

// ─── Certificates with verification status ─────────────────────────────────
export const CERTIFICATES = [
  {
    id: 'cert-iti',
    name: 'ITI Electrician — NCVT',
    issuer: 'Govt. ITI Lucknow',
    year: 2018,
    verified: true,
    verificationStatus: 'Verified',
    verifiedOn: '12 Jan 2026',
    verifierAuthority: 'NCVT (National Council for Vocational Training)',
    certNumber: 'NCVT/UP/2018/4521',
    blockchainHash: '0xa92f…7e21',
    skills: ['Electrician', 'Wiring'],
    expiry: 'Lifetime',
    digilockerLinked: true,
  },
  {
    id: 'cert-nsdc',
    name: 'Skill India — Electrician Level 4',
    issuer: 'NSDC',
    year: 2020,
    verified: true,
    verificationStatus: 'Verified',
    verifiedOn: '12 Jan 2026',
    verifierAuthority: 'NSDC / PMKVY',
    certNumber: 'NSDC/2020/0992345',
    blockchainHash: '0x32d1…a8c4',
    skills: ['Electrician'],
    expiry: '2027',
    digilockerLinked: true,
  },
  {
    id: 'cert-weld',
    name: 'Welding Safety Course',
    issuer: 'CIPET',
    year: 2022,
    verified: false,
    verificationStatus: 'Pending — Awaiting issuer confirmation',
    verifiedOn: null,
    verifierAuthority: 'CIPET',
    certNumber: 'CIPET/WLD/2022/8810',
    blockchainHash: null,
    skills: ['Welding'],
    expiry: '2027',
    digilockerLinked: false,
    timeline: [
      { step: 'Submitted',          date: '02 Apr 2026', done: true },
      { step: 'Sent to issuer',     date: '05 Apr 2026', done: true },
      { step: 'Awaiting response',  date: 'In progress', done: false, current: true },
      { step: 'Verified & on-chain',date: 'Pending',     done: false },
    ],
  },
]

// ─── Sample applications (Application Tracker) ─────────────────────────────
export const APPLICATIONS = [
  {
    id: 'APP-3081',
    jobId: JOBS[0]?.id,
    employerName: JOBS[0]?.employerName,
    role: JOBS[0]?.title,
    city: JOBS[0]?.destinationCity,
    appliedOn: '24 Apr 2026',
    status: 'Interview scheduled',
    nextStep: 'Online interview · 03 May, 11:00 AM',
    timeline: [
      { step: 'Application submitted',     date: '24 Apr 2026', done: true },
      { step: 'Profile shortlisted',        date: '26 Apr 2026', done: true },
      { step: 'Interview scheduled',        date: '28 Apr 2026', done: true, current: true },
      { step: 'Offer letter',               date: 'Pending',     done: false },
      { step: 'Visa & travel',              date: 'Pending',     done: false },
    ],
  },
  {
    id: 'APP-3055',
    jobId: JOBS[1]?.id,
    employerName: JOBS[1]?.employerName,
    role: JOBS[1]?.title,
    city: JOBS[1]?.destinationCity,
    appliedOn: '18 Apr 2026',
    status: 'Profile shortlisted',
    nextStep: 'Awaiting interview slot',
    timeline: [
      { step: 'Application submitted', date: '18 Apr 2026', done: true },
      { step: 'Profile shortlisted',    date: '23 Apr 2026', done: true, current: true },
      { step: 'Interview scheduled',    date: 'Pending',     done: false },
      { step: 'Offer letter',           date: 'Pending',     done: false },
      { step: 'Visa & travel',          date: 'Pending',     done: false },
    ],
  },
]

// ─── Remittance / transfer tracker ─────────────────────────────────────────
export const TRANSFERS = [
  {
    id: 'TR-9821',
    from: 'You (UAE)',
    to: 'Sunita (Wife) · SBI ****8821',
    amount: 12000,
    currency: 'INR',
    provider: 'Wise',
    fee: 90,
    rate: 22.92,
    initiatedOn: '24 Apr 2026 · 10:24 AM',
    eta: '24 Apr 2026 · 11:00 AM',
    status: 'In transit',
    timeline: [
      { step: 'Initiated',               date: '24 Apr 2026 · 10:24 AM', done: true },
      { step: 'Funds debited',           date: '24 Apr 2026 · 10:25 AM', done: true },
      { step: 'In transit (Wise rails)', date: '24 Apr 2026 · 10:30 AM', done: true, current: true },
      { step: 'Credited to beneficiary', date: 'Pending',                done: false },
    ],
  },
  {
    id: 'TR-9802',
    from: 'You (UAE)',
    to: 'Father · PNB ****4502',
    amount: 5000,
    currency: 'INR',
    provider: 'Remitly',
    fee: 0,
    rate: 22.88,
    initiatedOn: '10 Apr 2026',
    eta: '10 Apr 2026',
    status: 'Delivered',
    timeline: [
      { step: 'Initiated',               date: '10 Apr 2026 · 09:10 AM', done: true },
      { step: 'Funds debited',           date: '10 Apr 2026 · 09:11 AM', done: true },
      { step: 'In transit',              date: '10 Apr 2026 · 09:14 AM', done: true },
      { step: 'Credited to beneficiary', date: '10 Apr 2026 · 09:38 AM', done: true },
    ],
  },
]

// ─── Service partners (loans, insurance, visa, travel, health, legal) ─────
export const SERVICE_PARTNERS = {
  loans: [
    { id: 'sbi-pravasi', name: 'SBI Pravasi Loan',     rate: '10.5% p.a.', maxAmount: '₹3,00,000', tenure: '24 months', features: ['No collateral up to ₹2L', 'Salary-linked EMI', 'Pre-approved'] },
    { id: 'union-loan',  name: 'Union Bank Foreign Job', rate: '11.0% p.a.', maxAmount: '₹2,50,000', tenure: '36 months', features: ['Govt. interest subsidy', 'EMI moratorium 3 mo'] },
    { id: 'muthoot',     name: 'Muthoot Migration Loan', rate: '14.0% p.a.', maxAmount: '₹1,50,000', tenure: '12 months', features: ['Same-day approval', 'Gold-backed option'] },
  ],
  insurance: [
    { id: 'pbby',  name: 'PBBY (Govt.)',     premium: '₹275 / 2 yrs', cover: '₹10 L', features: ['Mandatory ECR', 'Death/disability cover', 'Repatriation'] },
    { id: 'tata',  name: 'Tata AIG Migrant',  premium: '₹4,800 / yr', cover: '₹20 L', features: ['Hospital cashless', 'Personal accident'] },
    { id: 'icici', name: 'ICICI Lombard',     premium: '₹5,200 / yr', cover: '₹25 L', features: ['Trip & job cover', 'Family floater'] },
  ],
  visa: [
    { id: 'vfs',     name: 'VFS Global',        fee: '₹5,500', time: '7–10 days',  features: ['Doorstep collection', 'Status SMS'] },
    { id: 'bls',     name: 'BLS International', fee: '₹4,800', time: '10–14 days', features: ['Document scrutiny', 'Multi-country'] },
    { id: 'embassy', name: 'Direct Embassy',    fee: '₹3,500', time: '2–4 weeks',  features: ['Lowest fee', 'Self-service'] },
  ],
  travel: [
    { id: 'air-india', name: 'Air India',  fare: '₹18,400', time: '4 hr 10 min', features: ['Direct flight', '30 kg baggage'] },
    { id: 'flydubai',  name: 'flydubai',   fare: '₹16,950', time: '4 hr 25 min', features: ['Lowest fare', '20 kg baggage'] },
    { id: 'emirates',  name: 'Emirates',   fare: '₹22,300', time: '4 hr 5 min',  features: ['Premium service', '35 kg baggage'] },
  ],
  health: [
    { id: 'gamca',     name: 'GAMCA Medical Centre', fee: '₹4,500', time: 'Same day',  features: ['GCC-approved', 'Lab + X-ray'] },
    { id: 'metropolis',name: 'Metropolis Diagnostics', fee: '₹3,800', time: '24 hours', features: ['Home sample', 'Online report'] },
    { id: 'apollo',    name: 'Apollo Pre-Departure',  fee: '₹6,200', time: 'Same day',  features: ['Premium care', 'Vaccination'] },
  ],
  legal: [
    { id: 'mfa',      name: 'Migrants Forum Asia',          fee: 'Free',   features: ['NGO support', 'Multilingual', 'Field officers'] },
    { id: 'pravasi',  name: 'Pravasi Setu Legal Cell',      fee: 'Free',   features: ['Contract review', 'Grievance routing'] },
    { id: 'vakil',    name: 'Vakilsearch Migration Desk',   fee: '₹2,500', features: ['POA & affidavits', 'Family power-of-attorney'] },
  ],
}

// ─── Bottom-nav helpers / etc ──────────────────────────────────────────────
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
]
