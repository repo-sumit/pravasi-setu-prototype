# Pravasi Setu — Dev Log

## 2026-04-30 — Design system migration + remittance flow upgrade

### Design system
- Replaced teal/green primary with SwiftChat blue (`#386AF6`) by repointing
  Tailwind primitive tokens. Every existing `bg-primary` / `text-primary`
  reskinned automatically.
- Added [src/styles/tokens.css](../src/styles/tokens.css) — semantic CSS
  variables for background / text / border / interactive / status / chat.
- Added [src/styles/theme.css](../src/styles/theme.css) — Mukta + Noto Sans
  font imports, typography utility classes (Title/Large, Title/Medium, etc.).
- Updated `tailwind.config.js` to expose the SwiftChat radius scale
  (`xs`/`sm`/`md`/`lg`/`xl`/`2xl`/`pill`/`full`), card / modal / focus shadows,
  Mukta font family, and a richer status palette.
- Added shared components: `Button`, `Input`, `Card`, `StatusChip`, `Stepper`,
  `Timeline`, `AlertBanner`, `PartnerStrip`.

### Branding
- `public/favicon.png` is now the ConveGenius square logo.
- `public/nsdc.png` added; partner strips appear on Splash, KYC, Skill
  Passport, Certificate Verification, and the Remittance summary panel.
- `Logo.jsx` mark recoloured to SwiftChat blue gradient.

### Remittance flow (Western Union / Wise / Remitly-style)
- Rebuilt [src/pages/RemittancePage.jsx](../src/pages/RemittancePage.jsx) as a
  6-step stepper plus confirmation:
  Quote → Method → Recipient → KYC → Pay → Review → Done.
- Sticky summary panel on tablet/desktop showing recipient gets / fee / FX rate
  / method, plus a trust-and-safety card.
- Added `RECIPIENTS`, `PAYOUT_METHODS`, `FUNDING_METHODS`, `SOURCE_COUNTRIES`,
  `TRANSFER_PURPOSES`, `RATE_ALERTS`, `TRANSFER_SUPPORT_TICKETS`,
  `TRANSFER_STATUSES` to `src/data/mockData.js`.
- Expanded `REMITTANCE_PROVIDERS` to 8 (Wise, Western Union, Remitly,
  MoneyGram, WorldRemit, SBI, ICICI, NPCI UPI Foreign Inward) with prototype-
  safe labels (`Prototype partner`, `Mock regulated partner`,
  `Integration-ready`).
- Updated existing transfers to the full status enum and added an exception
  example (`TR-9755`, cash pickup expired → refund initiated).
- Rebuilt [TransferTrackerPage](../src/pages/TransferTrackerPage.jsx) with
  status chip mapping, Timeline component (success / current / exception),
  and quick actions: receipt / share / notify / call provider / send-again /
  raise dispute.
- ChatPage intents extended for: send to UPI, send to bank, cash pickup,
  cheapest way, track delayed transfer, download receipt, notify receiver,
  set rate alert.

### Docs added
- [DESIGN_SYSTEM_IMPLEMENTATION.md](DESIGN_SYSTEM_IMPLEMENTATION.md)
- [REMITTANCE_FLOW.md](REMITTANCE_FLOW.md)
- [PROTOTYPE_GAP_ANALYSIS.md](PROTOTYPE_GAP_ANALYSIS.md)
- [REQUIREMENT_TRACEABILITY_MATRIX.md](REQUIREMENT_TRACEABILITY_MATRIX.md)

---

## 2026-04-30 (later) — UI responsiveness + validation audit

### Layout helpers
- Added [src/components/PageShell.jsx](../src/components/PageShell.jsx) with
  `size="form" | "content" | "wide"` (560 / 768 / 1280px caps).
- Added [src/components/FormShell.jsx](../src/components/FormShell.jsx) — 640px
  cap for sub-flows / modal-style screens.
- Made [KYCPage `FlowShell`](../src/pages/KYCPage.jsx) cap inner content at
  640px so Aadhaar eKYC / DigiLocker / APAAR forms stop sprawling on desktop.

### Page-level fixes
- **PreDeparturePage** — replaced `aspect-square` `ServiceTile` with compact
  cards (`min-h-[88-96px]`, `line-clamp-2` label). Grid now
  `grid-cols-3 md:grid-cols-4 lg:grid-cols-4`. Header content capped to
  `max-w-screen-lg`. Progress bar uses white-on-blue.
- **RemittancePage** — blue stepper band content capped to
  `max-w-screen-xl`.
- **EmergencyAssistancePage** — hero content, scenario grid
  (`md:3 lg:4`), hotline cards (`lg:2-col`) and inner sections all wrapped
  in `max-w-screen-xl`.
- **HomePage** — orange/yellow "Safe Migration" gradient replaced with
  `from-primary to-primary-dark` blue gradient + white pill CTA. Quick
  Services grid restyled: fixed-height cards (`h-[120px] sm:h-[136px]`),
  centered icon + label using `flex-col items-center justify-center`,
  `line-clamp-2`, hover lift, responsive `grid-cols-3 sm:grid-cols-4 lg:grid-cols-6`.
- **ProfilePage** — every section wrapped in a unified `Section` card
  (`rounded-3xl shadow-card`, `divide-y` row separators, larger 9px icon
  bubbles). Avatar block raised to `rounded-2xl` with shadow-modal. Footer
  copy cleaned up.
- **GrievancePage** — header CTA row capped to `max-w-screen-md`; create
  flow body wrapped in the same container.

### Validation
- Added [src/utils/validation.js](../src/utils/validation.js):
  `isRequired`, `isValidIndianPhone`, `isValidAadhaar`, `maskAadhaar`,
  `isValidOTP`, `isValidCaptcha`, `isValidAge`, `isValidDOB`, `getAgeFromDOB`,
  `isAdult`, `isReasonableWorkingAge`, `isValidName`, `isValidLocation`,
  `isValidSalary`, `isValidIFSC`, `isValidUPI`, `isValidBankAccount`,
  `isValidDescription`, `validateForm`.
- **LoginPage** — phone input uses `isValidIndianPhone`; inline error +
  red border + disabled CTA + tap-disabled-CTA reveals errors.
- **KYCPage Aadhaar sub-flow** — Aadhaar dummy-value rejection
  (`000000000000` etc.), captcha case-insensitive match,
  consent-required block, OTP 6-digit. Errors render inline; submit
  disabled until valid.
- **ProfileSetupPage** — Step 0 now requires DOB (auto-calculates age,
  age field becomes read-only). Validators: name (letters/2+),
  phone (Indian 10-digit), DOB (≥18), location (3+). Inline errors only
  after blur or after pressing Next.
- **GrievancePage** — category required + 20-character description (or
  voice note). Submit disabled until satisfied; emergency button stays
  one-tap.

### Acceptance
- `npm run build` succeeds.
- No green/teal as brand color anywhere; semantic green retained for
  verified / completed / success states only.
- Auth pages capped at 560px, KYC sub-flows at 640px.

---

## 2026-04-30 (final pass) — Session persistence + wide-screen audit

### Persistence layer
- New [src/utils/storage.js](../src/utils/storage.js) with namespaced keys:
  `pravasi_session / _profile / _app_state / _language / _applications /
  _transfers / _tickets / _certificates / _checklist`. All reads use
  `safeJsonParse`; all writes are wrapped in try/catch (quota safe). Marked
  with a "prototype-only local persistence — replace with secure backend in
  production" disclaimer.
- [AppContext.jsx](../src/context/AppContext.jsx) now hydrates every slice
  lazily from storage with `useState(() => loadX() ?? default)` and
  persists each one through a `useEffect`. Added `session` slice with
  `isAuthenticated`, `hasCompletedOnboarding`, `kycStatus`, `createdAt`.
- New context actions: `signIn(opts)`, `completeKYC()`, `signOut()`.
  `signOut` clears the session + every user-generated slice and routes to
  `login` (language is preserved across sessions).
- Initial screen picker: if authenticated and `lastRoute` is not a transient
  auth route (`splash/login/otp/kyc`), restore it; otherwise go to `home`.
  No session → `login` if a language is already chosen, else `splash`.

### Auth wiring
- LoginPage: phone-valid Send OTP → `signIn({ kycStatus: 'pending' })` then
  navigate to OTP. "Login with Aadhaar / DigiLocker" button also signs in
  before routing to KYC.
- OTPPage: filling all 6 digits → `signIn({ kycStatus: 'pending' })` →
  navigate to KYC.
- KYCPage: "Continue to App" → `completeKYC()` (`kycStatus: 'verified'`) →
  home. "Skip for now" → `signIn({ hasCompletedOnboarding: true })`.
- ProfilePage: Sign Out wired to `signOut()`.

### Routes that persist now
After refresh on any non-auth screen, the user lands back on the same
screen (params included). Examples verified: `transferTracker?transferId=`,
`applicationTracker?applicationId=`, `ticketDetail?ticketId=`,
`certificate?certId=`, `employerProfile?employerId=`.

### Wide-screen audit (final pass)
- **SkillPassport** rewrites: hero card capped at `max-w-screen-lg`,
  body promoted to a 2-column md grid (Skills + Certifications),
  Work Experience uses 2-col on `sm`, "Generate Resume PDF" CTA capped to
  `min-w-[280px]` instead of stretching, every card is now
  `rounded-2xl shadow-card border border-bdr-light`.
- **ReturnPage** orange hero replaced with `from-primary to-primary-dark`
  blue gradient + RotateCcw chip. Steps render as a 2-column grid on
  desktop with `rounded-2xl`, hover-lift, and chevron-aligned rows. Skill
  reuse mapping moved into its own polished card with a "View Skill
  Passport" link.
- **EmploymentPage** salary header uses blue gradient + capped content.
  Page body uses `max-w-screen-xl mx-auto`. Quick action tiles use
  `rounded-2xl`. Salary slips + Earnings trend now sit side-by-side on
  `lg+` (master/detail).
- **PreDeparturePage** restructured into three labelled sections
  ("Services before departure" / "Departure checklist" /
  "Legal Toolkit + Language"). Service tiles wrap an emoji in a coloured
  bubble inside a `rounded-2xl` card with hover lift; the grid is now 3-up
  on mobile and 4-5-up on tablet/desktop. Checklist groups use a 2-column
  grid on `md+`. Legal + Language sit side-by-side; Language card upgraded
  to a primary CTA.

### Acceptance
- `npm run build` ✓
- Refresh on any non-auth route restores it; auth state survives reload.
- Sign Out wipes user data, returns to Login.
- No content card stretches edge-to-edge on desktop.
- No orange/teal as brand color; semantic green only for completed.
