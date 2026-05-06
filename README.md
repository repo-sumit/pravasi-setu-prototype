# Pravasi Setu Prototype

`pravasi-setu-prototype` is a React/Vite client-side prototype for **Pravasi Setu**, a safe-migration companion for Indian workers seeking overseas jobs, pre-departure support, remittances, financial services, grievance redressal, emergency help, and return/reintegration support.

The product name is derived from `package.json` (`pravasi-setu-prototype`) and from the user-facing brand constants in `src/config/brandAssets.js` (`Pravasi Setu`).

## Overview

Pravasi Setu is a mobile-first, desktop-responsive single-page application that simulates the end-to-end journey of an Indian migrant worker:

- Choose a preferred language, log in with a mobile number, and complete simulated Aadhaar/DigiLocker/APAAR verification.
- Build a verified worker profile and skill passport from identity, education, skills, certificates, experience, documents, and resume data.
- Search dataset-backed overseas jobs, inspect employers and trust signals, and apply through Swift Apply or a manual application.
- Track job applications, migration readiness, remittances, loans, insurance policies, travel bookings, grievances, and support tickets.
- Use a rule-based Setu Assistant chatbot to deep-link into jobs, remittance, financial services, emergency support, resume builder, and migration workflows.

This repository is a **prototype only**. It has no production backend, real authentication, real KYC, real government integration, real remittance provider, live insurer, lender, airline, payment SDK, or database. Persistent state is stored in browser `localStorage` through `src/utils/storage.js`.

## Key Features

### Onboarding, Auth, and Identity

- Language picker on `SplashPage` with six language choices (`en`, `hi`, `ml`, `ta`, `bn`, `or` in the splash UI).
- Mobile login in `LoginPage` using Indian-phone validation from `src/utils/validation.js`.
- OTP simulation in `OTPPage`; any six digits continue to KYC.
- KYC hub in `KYCPage` with simulated Aadhaar eKYC, DigiLocker, and APAAR flows.
- Aadhaar eKYC validates 12-digit Aadhaar format, rejects known dummy values, requires captcha match (`7K9pX2`), requires consent, and then accepts any six-digit OTP.
- DigiLocker simulates OTP login, document selection, consent, fetching, and success.
- APAAR simulates a 12-digit academic ID plus DOB verification.
- Session state persists through `pravasi_session`, and the last non-auth route persists through `pravasi_app_state`.

### Profile and Skill Passport

- `ProfileSetupPage` provides a five-step profile wizard: Basic, Education, Skills, Preferences, Review.
- Validates full name, Indian mobile number, date of birth, minimum age 18, and location.
- `ProfilePage` summarizes identity, personal details, documents, skills, services, language/settings, and sign-out.
- `SkillPassportPage` shows verified skills, certificates, experience, QR-code-style passport ID, partner strip, and readiness score derived from resume completeness.
- Certificate detail and verification flow lives in `CertificateVerificationPage`, including issuer details, certificate numbers, expiry, DigiLocker linkage, pending timeline, and mock blockchain proof.

### Resume Builder and PDF Export

- `ResumeBuilderPage` is a full editable resume workspace backed by the `resume` context slice and `pravasi_resume_data`.
- Sections include personal info, professional summary, skills, certifications, experience, education, languages, documents, and references.
- Templates: `clean`, `passport`, and `overseas`.
- Mobile UI uses Edit / Preview / Download tabs; desktop uses an editor plus sticky A4 preview.
- PDF export uses browser `window.print()` with a print-only `#resume-print-root`; no PDF library is installed.
- The A4 renderer paginates content using heuristic millimeter budgets and keeps atomic resume items from splitting mid-item.
- Completeness scoring is reused by Skill Passport and Swift Apply readiness.

### Job Discovery, Employers, and Applications

- `JobsPage` renders 100 job records generated into `src/data/migrantJobsData.js`.
- Filters include country, role/skill, sector, verified-only, salary bucket, contract duration, and free-text search.
- Jobs include salary ranges, local currency estimates, contract duration, benefits, employer verification, flagging, trust score, reviews, service fee, skills, language, education, and application deadline.
- `JobDetailPage` shows job detail, trust score, benefits, contract transparency, reviews, travel arrangement, cost-calculator CTA, and reporting CTA.
- `EmployerProfilePage` shows employer trust score, worker reviews, compliance flags, open jobs, and report action.
- `JobApplyChoicePage` offers:
  - Swift Apply: shares verified profile, Skill Passport, certificates, and resume after explicit consent.
  - Manual entry: validates name, phone, passport, education, work experience, skills, and consent.
- `ApplicationTrackerPage` tracks application status through submitted, shortlisted/reviewed, interview, offer, and visa/travel steps.
- `RateEmployerPage` collects verified-worker review criteria for salary fairness, work conditions, accommodation, and safety.

### Remittance and Transfer Tracking

- `RemittancePage` implements a multi-step remittance flow: Quote, Method, Recipient, KYC, Pay, Review, Confirmation.
- Supports UPI, bank account, and cash pickup payout methods.
- Provider comparison includes Wise, Western Union, Remitly, MoneyGram, WorldRemit, SBI, ICICI Money2India, and NPCI UPI Foreign Inward, all clearly marked as mock/prototype/integration-ready partners.
- Dynamic recipient validation includes UPI format, IFSC format, account confirmation, and pickup-city checks.
- Trust copy warns about fraud, refund policy, recipient detail accuracy, and prototype-only RBI/MTSS/RDA/NPCI assumptions.
- `TransferTrackerPage` supports list and detail views with status chips, transfer detail breakdown, timeline, exception banners, receipt/share/notify/call/send-again/dispute actions, and full transfer status enum.

### Financial and Mobility Services

- `LoansPage` implements need builder, document readiness, lender comparison, EMI affordability, consent, submission, and loan tracker.
- Loan math is in `src/utils/financeCalculations.js`: EMI, total payable, total interest, affordability, and INR formatting.
- `InsurancePage` implements marketplace categories, plans, detail, payment, policy tracker, claims, complaint routing, and support tabs.
- `TravelPage` implements flight search, deterministic mock flight options, passenger validation, payment, confirmation, ticket detail, PNR, and T-3/T-1 reminders.
- `ProfilePage` exposes "My Services" deep links for loans, insurance, travel, transfers, beneficiaries, and applications.

### Pre-Departure, Post-Arrival, Employment, and Return

- `PreDeparturePage` groups checklist items into Documents, Health, Financial, Travel, Preparation, and Legal categories. Progress is persisted.
- Pre-departure service tiles deep-link to loans, insurance/PBBY, remittance/forex, travel, chat/language, and certificate/PCC; visa, vaccines, and contract review are toast-only stubs.
- `PostArrivalPage` simulates first-30-day support: housing, SIM, transport, city guide, language/country guide, emergency numbers, embassy, NGO, community, and legal-aid links.
- `EmploymentPage` simulates current salary, gross/deductions/EMI, contract/attendance/EMI actions, payslips, downloads, and earnings trend.
- `ReturnPage` simulates visa closure, return ticket, legal closure, Indian jobs, skill recognition, and skill mapping to NSDC equivalents.

### Grievance, Ticketing, and Emergency

- `GrievancePage` lets users raise salary, employer, safety, or legal complaints.
- Grievance creation validates category plus either a 20-character description or a voice note.
- New tickets are routed to MEA/MADAD, Indian Embassy, NGO/legal partners, and Pravasi Setu legal team.
- `TicketDetailPage` shows ticket status, description, routed authorities, assigned officer, timeline, chat/call actions, and emergency escalation.
- `EmergencyAssistancePage` includes SOS with location toast, scenario routing, embassy/MEA/local hotlines, multilingual chat CTA, voice recording toast, and live-location sharing toast.

### Setu Assistant Chatbot

- `ChatPage` contains a local rule-based intent engine with keyword matching.
- It supports jobs, employer safety, certificates, profile setup, resume builder, Swift Apply, migration costs, loans, insurance, travel, remittance, transfer tracking, salary/payslips, grievances, return support, medical help, language basics, housing, SIM, and emergency prompts.
- Responses can include text, suggested prompts, job cards, and action buttons that navigate to app routes.

## Tech Stack

| Area | Technology | Evidence |
|---|---|---|
| Frontend | React 18.3.1, React DOM 18.3.1 | `package.json`, `package-lock.json` |
| Build tool | Vite 5 (`vite`, `@vitejs/plugin-react`) | `vite.config.js`, `package.json`; lock resolves Vite 5.4.21 |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer | `tailwind.config.js`, `postcss.config.js`, `src/index.css` |
| Icons | `lucide-react` 0.453.0 | `package.json`; used across pages/components |
| State | React context and hooks | `src/context/AppContext.jsx` |
| Persistence | Browser `localStorage` | `src/utils/storage.js` |
| Data | Static JS mock/generated data | `src/data/mockData.js`, `src/data/migrantJobsData.js` |
| Dataset generation | Python script using `openpyxl` | `scripts/build_migrant_jobs.py`; source `.xlsx` is not in current repo |
| Fonts/assets | Google Fonts, hosted brand images | `index.html`, `src/styles/theme.css`, `src/config/brandAssets.js` |
| Testing | Not found in the current repository | no test scripts/files detected |
| Backend/API | Not found in the current repository | no server/API routes/controllers found |
| Database | Not found in the current repository | no schema/migrations/DB config found |
| CI/CD | Not found in the current repository | no GitHub Actions/Docker/cloud config found |

## Architecture

This is a client-only SPA. The top-level flow is:

```text
index.html
  -> src/main.jsx
    -> setFavicon(...)
    -> ReactDOM.createRoot(...)
      -> AppProvider
        -> AppRoutes
          -> one route component selected by context.screen
          -> Toast overlay
```

Routing is not URL-based. `src/App.jsx` maps string route IDs to page components, and `AppContext.navigate(routeId, params)` changes the active screen. Route params are held in context and persisted as `lastParams`.

### Important Folders

```text
.
|-- docs/                     Existing implementation notes and flow docs.
|-- scripts/                  Dataset conversion script for migrant jobs.
|-- src/
|   |-- App.jsx               Route registry and app shell.
|   |-- main.jsx              React entry point and favicon setup.
|   |-- context/              Global app state, navigation, auth simulation, persistence.
|   |-- components/           Shared UI primitives and layout helpers.
|   |-- config/               Hosted brand asset URLs and brand names.
|   |-- data/                 Static/generated mock data used by all flows.
|   |-- i18n/translations/    Resume translation skeleton JSON files; runtime i18n not wired.
|   |-- pages/                Feature screens and workflows.
|   |-- styles/               CSS token/theme utilities.
|   |-- utils/                Validation, storage, favicon, finance helpers.
|-- dist/                     Vite production build output.
|-- public/                   Empty in the current repository.
|-- package.json              Scripts and dependencies.
|-- tailwind.config.js        Design tokens and Tailwind theme.
|-- vite.config.js            Vite React plugin config.
```

### Route Registry

| Route ID | Component | Purpose |
|---|---|---|
| `splash` | `SplashPage` | Language selection |
| `login` | `LoginPage` | Phone login and Aadhaar/DigiLocker entry |
| `otp` | `OTPPage` | OTP simulation |
| `kyc` | `KYCPage` | Aadhaar/DigiLocker/APAAR verification simulation |
| `home` | `HomePage` | Dashboard and quick services |
| `profile` | `ProfilePage` | Profile, identity, documents, services, settings |
| `profileSetup` | `ProfileSetupPage` | Profile creation wizard |
| `passport` | `SkillPassportPage` | Skill Passport and readiness |
| `resumeBuilder` | `ResumeBuilderPage` | Editable resume and PDF export |
| `certificate` | `CertificateVerificationPage` | Certificate verification detail |
| `jobs` | `JobsPage` | Job discovery and filters |
| `jobDetail` | `JobDetailPage` | Job detail and apply entry |
| `jobApplyChoice` | `JobApplyChoicePage` | Swift Apply vs manual application |
| `employerProfile` | `EmployerProfilePage` | Employer trust/compliance detail |
| `applicationTracker` | `ApplicationTrackerPage` | Application list/detail |
| `rateEmployer` | `RateEmployerPage` | Worker employer review form |
| `calculator` | `CalculatorPage` | Migration cost calculator |
| `predeparture` | `PreDeparturePage` | Checklist and pre-departure services |
| `postarrival` | `PostArrivalPage` | Arrival support |
| `remittance` | `RemittancePage` | Send money flow |
| `transferTracker` | `TransferTrackerPage` | Transfer list/detail |
| `loans` | `LoansPage` | Loan wizard/list/detail |
| `insurance` | `InsurancePage` | Insurance marketplace/list/detail |
| `travel` | `TravelPage` | Travel booking/list/detail |
| `employment` | `EmploymentPage` | Salary, payslips, employment info |
| `return` | `ReturnPage` | Return and reintegration |
| `grievance` | `GrievancePage` | Grievance list/create |
| `ticketDetail` | `TicketDetailPage` | Grievance ticket detail |
| `emergency` | `EmergencyAssistancePage` | SOS and hotlines |
| `chat` | `ChatPage` | Setu Assistant |
| `updates` | `UpdatesPage` | Notifications and alerts |

### Shared Components

| Component | Role |
|---|---|
| `StatusBar` | Simulated mobile status bar |
| `TopBar` | Header with back/close/actions |
| `BottomNav` | Main navigation tabs |
| `Button`, `Input`, `Card` | Token-aligned primitives |
| `Stepper` | Multi-step workflow progress |
| `Timeline` | Application/transfer/ticket/policy timelines |
| `StatusChip` | Tone-based status pill |
| `AlertBanner` | Info/warning/error/success callouts |
| `AuthShell`, `FormShell`, `PageShell` | Responsive layout constraints |
| `Toast` | Global toast overlay |
| `PartnerStrip`, `BrandImage`, `Logo`, `LogoLockup` | Branding and fallback image handling |
| `VerifiedBadge`, `FlaggedBadge` | Trust indicators |

## Business Logic / Application Logic

### Session and Navigation

- `AppContext` hydrates `session`, `profile`, route state, language, applications, transfers, tickets, certificates, checklist, loan applications, insurance policies, travel bookings, manual applications, beneficiaries, and resume from `localStorage`.
- `pickInitialScreen()` sends unauthenticated users to `splash` unless a language exists, then `login`.
- Authenticated users restore `lastRoute` unless it is transient (`splash`, `login`, `otp`, `kyc`), then fallback to `home`.
- `navigate(id, params)` pushes onto an in-memory stack and persists last route/params.
- `goBack()` pops the stack; if only one item exists, it uses `BACK_FALLBACKS` for deep-link recovery.
- `signOut()` clears all user-generated slices and returns to `login`, preserving language.

### Validation Rules

Reusable validation helpers are in `src/utils/validation.js`:

- Indian mobile: accepts optional `+91` formatting, checks 10 digits starting 6-9.
- Aadhaar: exactly 12 digits, rejects dummy sequences like all zeros and `123456789012`.
- OTP: exact length, default six digits.
- Captcha: case-insensitive match.
- DOB: valid date, not future, minimum age 18.
- Age: 18-70; working-age helper 18-60.
- Name: letters, spaces, dots, apostrophes, hyphens; minimum two characters.
- Location: minimum three characters.
- IFSC: `AAAA0XXXXXX`.
- UPI: `name@bank`-style regex.
- Bank account: 9-18 digits in the utility; note that `RemittancePage` has a local account check of at least six characters plus confirmation match.
- Grievance description: minimum 20 characters by default.
- `validateForm()` accepts field validators and returns `{ isValid, errors }`.

### Financial Calculations

`src/utils/financeCalculations.js` contains illustrative loan helpers only:

- `calculateEMI(principal, annualRatePercent, tenureMonths)` uses the standard reducing-balance EMI formula.
- `totalPayable()` and `totalInterest()` derive totals from EMI.
- `emiAffordability()` marks EMI as:
  - high risk if EMI is over 50% of expected monthly salary;
  - medium risk if EMI is over 35%;
  - low risk otherwise.
- All calculations are explicitly prototype-grade and not suitable for production lending disclosures.

### Workflow State Transitions

| Flow | State / transition behavior |
|---|---|
| Login | valid phone -> `signIn({ kycStatus: 'pending' })` -> `otp`; Aadhaar/DigiLocker login -> `kyc` |
| OTP | all six digits filled -> `signIn({ kycStatus: 'pending' })` -> `kyc` |
| KYC | any method verified -> Continue enabled -> `completeKYC()` -> `home`; skip signs in with onboarding complete |
| Profile setup | step-gated by validators; finish updates profile and opens `passport` |
| Job apply | Swift Apply requires consent; Manual requires valid fields and consent; both add an application and open tracker |
| Remittance | each step checks local validity; review submit creates a `TR-*` transfer and opens confirmation |
| Loans | selected needs + docs + provider + consent create an `LN-*` application and tracker |
| Insurance | chosen category/plan + payment method + consent creates a `POL-*` policy |
| Travel | valid route/date + selected flight + valid passenger + payment creates a `BK-*` booking with PNR and reminders |
| Grievance | category + description/voice creates a `PS-*` ticket and routes to ticket detail |
| Resume | every edit calls `setResume()`, updates `lastUpdated`, and persists immediately |

## API Documentation

No HTTP API, backend route, controller, server action, GraphQL schema, REST client, `fetch()` call, or Axios usage was found in the current repository.

All application behavior is local to the browser. The closest API-like boundary is the `AppContext` value exposed by `src/context/AppContext.jsx`:

| Context API | Purpose |
|---|---|
| `navigate(id, params)` | Internal route transition |
| `goBack()`, `goHome()` | Navigation helpers |
| `setLang()` | Persist selected language |
| `setProfile()` | Update worker profile |
| `showToast(message, type)` | Global toast |
| `signIn(opts)`, `completeKYC()`, `signOut()` | Simulated auth/session operations |
| `addApplication()` | Add job application |
| `addTransfer()` | Add transfer |
| `addTicket()` | Add grievance ticket |
| `setCertificates()` | Update certificate list |
| `setChecklist()` | Update pre-departure checklist |
| `addLoanApplication()`, `updateLoanApplication()` | Loan state |
| `addInsurancePolicy()`, `updateInsurancePolicy()` | Insurance state |
| `addTravelBooking()`, `updateTravelBooking()` | Travel state |
| `addManualApplication()` | Manual application audit slice |
| `addBeneficiary()` | Saved beneficiary slice |
| `setResume()` | Resume state, with `lastUpdated` bump |

Assumption: if a backend is added later, these context methods are the natural seam for replacing mock/local mutations with API calls.

## Data Model / Database

No database, ORM, migration, schema, seed script, or database container was found. The app uses JS data modules plus `localStorage`.

### Static Data Modules

| File | Data |
|---|---|
| `src/data/migrantJobsData.js` | 100 generated jobs, 10 generated employers, sectors, destination countries |
| `src/data/mockData.js` | Adapted jobs, reviews, notifications, grievances, prompts, checklist, certificates, applications, recipients, remittance providers, transfers, service partners, languages, loans, insurance, travel, banks, cash agents |

`src/data/migrantJobsData.js` is generated from `migrant_jobs_dataset.xlsx` by `scripts/build_migrant_jobs.py`. The source spreadsheet is **not found in the current repository**, so the generation script cannot be rerun without adding that file.

### Main Entity Shapes

| Entity | Key fields | Defined / used in |
|---|---|---|
| Profile | name, phone, age, DOB, gender, location, education, KYC flags, skills, certifications, experience | `AppContext.DEFAULT_PROFILE`, profile pages |
| Session | `isAuthenticated`, `hasCompletedOnboarding`, `kycStatus`, `createdAt` | `AppContext.DEFAULT_SESSION` |
| Resume | template, visibility, personal, summary, skills, certifications, experience, education, languages, documents, references | `AppContext.buildResumeFromProfile()`, `ResumeBuilderPage` |
| Job | id, role/title, sector, destination, employer, salary, contract, skills, benefits, verification/trust, fee | `migrantJobsData.js`, `mockData.adaptJob()` |
| Employer | id, name, sector, country, trust score, verified/flagged, compliance flags, open jobs | `migrantJobsData.js` |
| Application | id, jobId, employerName, role, city, method, status, nextStep, timeline | `mockData.js`, `JobApplyChoicePage` |
| Certificate | id, name, issuer, year, verified, authority, certificate number, hash, skills, expiry, timeline | `mockData.js` |
| Transfer | id, source amount/currency, FX, fee, recipient amount, provider, payout/funding method, purpose, status, timeline | `mockData.js`, `RemittancePage` |
| Loan | id, provider terms, requested amount, tenure, EMI, totals, needs, status, timeline | `LoansPage` |
| Policy | id, plan/provider, premium, coverage, policy number, status, timeline | `InsurancePage` |
| Travel booking | id, PNR, route, airline/provider, fare, passenger, status, timeline, alerts | `TravelPage` |
| Ticket | id, category, status, priority, description, routed authorities, officer, timeline | `mockData.js`, `GrievancePage` |

### localStorage Keys

`src/utils/storage.js` namespaces keys under `pravasi_*`:

| Key | Stored data |
|---|---|
| `pravasi_session` | Simulated auth/session |
| `pravasi_profile` | Worker profile |
| `pravasi_app_state` | Last route and params |
| `pravasi_language` | Selected language |
| `pravasi_applications` | Job applications |
| `pravasi_transfers` | Money transfers |
| `pravasi_tickets` | Grievance tickets |
| `pravasi_certificates` | Certificates |
| `pravasi_checklist` | Pre-departure checklist |
| `pravasi_loan_applications` | Loan applications |
| `pravasi_insurance_policies` | Insurance policies |
| `pravasi_travel_bookings` | Travel bookings |
| `pravasi_manual_applications` | Manual job applications |
| `pravasi_beneficiaries` | Saved beneficiaries |
| `pravasi_resume_data` | Resume builder data |

Storage helpers use safe JSON parsing and wrap writes/removals in `try/catch`.

## Environment Variables

No environment variables were found in code, config, scripts, `.env*`, Docker, or CI/CD files. No `.env.example` file exists.

| Variable | Purpose | Required | Default | Used in |
|---|---|---:|---|---|
| Not found in the current repository | Not applicable | No | Not applicable | Not applicable |

External resources are currently hardcoded:

- Google Fonts in `index.html` and `src/styles/theme.css`.
- Hosted brand image URLs in `src/config/brandAssets.js`.
- Affiliated payout bank website links in `src/data/mockData.js`.

## Installation

### Prerequisites

- Node.js 18+ is recommended for Vite 5. The current repository does not include `.nvmrc` or an engines field.
- npm, using the checked-in `package-lock.json`.
- Optional for dataset regeneration: Python 3 plus `openpyxl`, and `migrant_jobs_dataset.xlsx` at the repo root. The spreadsheet is not present in the current repo.

### Setup

```bash
npm install
```

No environment file is required.

### Optional Dataset Regeneration

```bash
python scripts/build_migrant_jobs.py
```

This expects `migrant_jobs_dataset.xlsx` in the repository root and writes `src/data/migrantJobsData.js`. Because the spreadsheet is not present, this command is currently not runnable without adding the dataset.

## Running the Project

### Development

```bash
npm run dev
```

Vite will print the local development URL, usually `http://localhost:5173/`.

### Production Build

```bash
npm run build
```

Verified on this repository. The build succeeds and outputs to `dist/`, with a Vite warning that the main JS chunk is larger than 500 kB after minification.

### Preview Production Build

```bash
npm run preview
```

### Available npm Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production static assets into `dist/` |
| `npm run preview` | Serve the built `dist/` output locally |

### Commands Not Found

| Command type | Status |
|---|---|
| Test | Not found in `package.json` |
| Lint | Not found in `package.json` |
| Format | Not found in `package.json` |
| Database migration | Not found in the current repository |
| Seed | Only dataset conversion script exists; no database seed |
| Docker | Not found in the current repository |

## Testing

No automated test framework, test files, or test script were found.

Current practical verification:

```bash
npm run build
```

Build result from this inspection:

- Vite transformed 1625 modules.
- `dist/index.html`, CSS, and JS assets were produced.
- Warning: `dist/assets/index-*.js` is larger than 500 kB after minification, suggesting route-level code splitting or manual chunks.

Recommended test additions are listed in Future Improvements.

## Deployment

No CI/CD workflow, Dockerfile, deployment script, hosting config, or cloud infrastructure file was found.

Because this is a Vite SPA, the inferred deployment model is static hosting:

1. Run `npm install`.
2. Run `npm run build`.
3. Deploy the generated `dist/` directory to a static host such as Vercel, Netlify, S3/CloudFront, Azure Static Web Apps, or any static web server.
4. Configure SPA fallback to `index.html` if URL-based routing is introduced later. The current app uses context-only routing, so direct deep URLs are not currently a feature.

Deployment constraints:

- `public/` is empty in the current repository, while `index.html` references `/favicon.png`. `src/main.jsx` calls `setFavicon(BRAND_ASSETS.favicon)` as a runtime fallback to a hosted image.
- Brand images depend on external `i.ibb.co` URLs.
- Google Fonts are loaded at runtime.
- All user state is browser-local. Deploying the static app does not create shared accounts, server sessions, or cross-device persistence.

## Security / Permissions

This codebase is not production-secure as-is.

- Authentication is simulated. `signIn()` only flips local React state and persists it to `localStorage`.
- KYC, Aadhaar, DigiLocker, APAAR, eMigrate, RBI/MTSS/RDA/NPCI, lender, insurer, airline, payment, embassy, and grievance integrations are all mocked.
- Sensitive profile-like data is stored unencrypted in `localStorage`.
- There is no server-side authorization, role model, access control, token validation, CSRF protection, rate limiting, audit logging, or secure session cookie.
- Consent UI exists for KYC, Swift Apply, manual applications, loan applications, and insurance KYC sharing, but consent is local UI state only.
- External links use `target="_blank"` with `rel="noopener noreferrer"` in the bank-payout chips.
- `BrandImage` falls back to text if hosted assets fail, avoiding broken image UI.

Production would require a real identity/session provider, server-side data ownership checks, encrypted storage, audit logs, regulated partner integrations, and backend validation for all sensitive workflows.

## Error Handling & Logging

Current error-handling patterns:

- `Toast` provides global user feedback for successful actions, simulated calls, downloads, sharing, support routing, and errors.
- `storage.js` safely parses JSON and catches localStorage quota/read/write/remove failures.
- `AppRoutes` falls back to `SplashPage` for unknown route IDs.
- `goBack()` uses explicit fallbacks for deep routes after refresh.
- `BrandImage` replaces failed images with text labels.
- Form validation is mostly inline and blocks disabled CTAs where appropriate.
- Resume PDF export logs page-count parity details and warnings to the console.

Not found in the current repository:

- Global React error boundary.
- Central logging service.
- Monitoring/analytics.
- Retry framework.
- Network error handling, because there are no API calls.

## Known Constraints

- Client-only prototype; no backend or database.
- `localStorage` persistence is explicitly marked prototype-only and unsuitable for real PII.
- No automated tests, linting, formatter, CI, Docker, or deployment config.
- `dist/` is checked into the repository; build output is usually generated, not source.
- `public/` is empty, although some docs refer to `public/favicon.png`, `public/nsdc.png`, and `public/convegenius.png`.
- `index.html` references `/favicon.png`; runtime code replaces it with a hosted favicon.
- Dataset source `migrant_jobs_dataset.xlsx` is missing, so `scripts/build_migrant_jobs.py` cannot currently regenerate job data.
- The Python `openpyxl` dependency is not captured in a `requirements.txt` or similar file.
- Direct Node ESM importing of `src/data/mockData.js` is awkward because it imports `./migrantJobsData` without an extension; Vite resolves this fine.
- i18n translation JSON files exist only for resume keys and are not wired into a runtime translation provider.
- UI strings are mostly literal English despite multilingual product positioning.
- Some language lists are inconsistent: splash offers `en`, `hi`, `ml`, `ta`, `bn`, `or`, while `SUPPORTED_LANGUAGES` includes `te` and `mr`.
- Remittance, loan, insurance, travel, KYC, certificate, grievance, and emergency flows are mock/simulated and should not be mistaken for regulated workflows.
- Bundle size warning after production build indicates route-level code splitting is needed.
- Resume PDF fidelity depends on browser print behavior.
- No URL router; refreshing restores state from `localStorage`, but deep browser URLs are not used.
- Some implementation docs are stale relative to current files; this README follows the current repository contents.

## Future Improvements

- Add real routing with React Router or equivalent, including URL-safe route params and SPA fallback deployment config.
- Replace localStorage persistence with backend APIs, authenticated sessions, encrypted storage, and audit logging.
- Add production-grade integrations only behind clear regulatory/compliance review: KYC, eMigrate, remittance partners, banks/NBFCs, insurers, airlines/aggregators, embassy/grievance channels.
- Add unit tests for `validation.js`, `financeCalculations.js`, storage helpers, resume pagination, and route fallback logic.
- Add workflow tests for onboarding, remittance, loans, insurance, travel, job apply, grievance, and resume export.
- Add ESLint, Prettier, and CI build/test checks.
- Code-split routes with `React.lazy()` / dynamic imports to reduce the main JS bundle.
- Add an error boundary and structured telemetry.
- Vendor or self-host fonts and brand assets for offline/reliable deployments.
- Add a `requirements.txt` or equivalent for the Python dataset script.
- Restore or document the missing `migrant_jobs_dataset.xlsx` source file.
- Wire the i18n JSON files into a translation provider and move literal UI strings into translation resources.
- Add accessibility checks for focus management, screen reader labels, color contrast, keyboard navigation, and modal semantics.
- Remove checked-in generated `dist/` if the deployment process builds artifacts independently.

## Contribution Guidelines

No contribution guide was found, so use these baseline expectations:

- Create focused branches for each feature or fix.
- Keep changes scoped to the relevant route, component, data, or utility.
- Do not edit `src/data/migrantJobsData.js` by hand unless the dataset pipeline is unavailable and the change is explicitly reviewed; it is generated output.
- Run `npm run build` before opening a PR.
- Add tests when introducing a test framework or when touching shared logic.
- Keep prototype disclaimers visible for regulated flows.
- Do not commit secrets, `.env` files, or real user data.
- Prefer existing design tokens/components over one-off styling.

## Important Source Files Used for This Documentation

- `package.json`, `package-lock.json`
- `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- `src/App.jsx`, `src/main.jsx`
- `src/context/AppContext.jsx`
- `src/utils/storage.js`, `src/utils/validation.js`, `src/utils/financeCalculations.js`, `src/utils/setFavicon.js`
- `src/data/mockData.js`, `src/data/migrantJobsData.js`
- `src/pages/*.jsx`
- `src/components/*.jsx`
- `src/config/brandAssets.js`
- `src/styles/tokens.css`, `src/styles/theme.css`, `src/index.css`
- `src/i18n/translations/*.json`
- `scripts/build_migrant_jobs.py`
- `docs/*.md`
