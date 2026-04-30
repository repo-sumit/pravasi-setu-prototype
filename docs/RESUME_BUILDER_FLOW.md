# Resume Builder & Skill Passport — Implementation Notes

This sprint promoted the Skill Passport from a static card list into an
**editable resume workspace** with a downloadable A4 PDF.

## Files

| Concern                                      | File                                                                                |
|----------------------------------------------|-------------------------------------------------------------------------------------|
| Editable workspace + live preview + PDF      | [src/pages/ResumeBuilderPage.jsx](../src/pages/ResumeBuilderPage.jsx)               |
| Skill Passport read-only view + entry points | [src/pages/SkillPassportPage.jsx](../src/pages/SkillPassportPage.jsx)               |
| Persistent state slice                       | [src/context/AppContext.jsx](../src/context/AppContext.jsx) (`resume`, `setResume`) |
| localStorage key                             | `pravasi_resume_data` ([storage.js](../src/utils/storage.js))                       |
| i18n key skeletons (en/hi/ml/ta/bn/or)       | [src/i18n/translations/](../src/i18n/translations/)                                 |

## Data model

```ts
type Resume = {
  template: 'clean' | 'passport' | 'overseas'
  visibility: 'private' | 'shareable'
  lastUpdated: number      // ms epoch — drives "Saved" indicator
  personal: {
    name, phone, email, location,
    preferredCountry, preferredRole,
    passportAvailable, kycVerified,
    passportId, skillPassportId,
  }
  summary: string
  skills:         { id, name, level, years, verified }[]
  certifications: { id, name, issuer, year, expiry, certNumber, verified }[]
  experience:     { id, title, company, country, duration, current,
                    responsibilities, tools }[]
  education:      { id, qualification, institution, year, field }[]
  languages:      { id, name, speaking, reading, writing }[]
  documents:      { id, label, status }[]    // available / pending / expired / not_uploaded
  references:     { id, name, relation, phone, company, consent }[]
}
```

The slice is hydrated lazily from localStorage; if no record exists it is
**seeded from the existing `profile`** so the resume isn't empty for first-
time users.

## Editor → Preview architecture

- **Mobile** uses a 3-tab top bar: Edit / Preview / Download.
- **Desktop** uses a 5-column grid: 3-col editor on the left, 2-col sticky
  A4 preview on the right (`lg:sticky lg:top-4`).
- Every section is a `SectionCard` with its own Add / Edit / Remove
  affordances; updates flow through `setResume(r => …)` and persist
  immediately via the existing `useEffect` save-on-change in AppContext.
- The "Saved" indicator flashes for 1.4 s after each `lastUpdated` change.

## Templates

| Id | Name | Behaviour |
|----|------|-----------|
| `clean`    | Clean Worker        | Black header band, no badges, ATS-friendly. |
| `passport` | Skill Passport      | Blue header, verified badges, Skill Passport ID. |
| `overseas` | Overseas Application | Adds destination-readiness badge + Document readiness section. |

## PDF generation

No PDF library is added — the prototype stays at zero new dependencies.

The page renders a **second hidden `#resume-print-root`** below the screen
preview. A `<style>` block scopes `@media print` to:
- size `A4` with `12mm` margins
- hide everything except `#resume-print-root` and its descendants
- strip box shadows so the PDF reads clean

`onPrint` swaps `document.title` to `Pravasi_Setu_Resume_<name>` so the
browser's "Save as PDF" dialog suggests that filename, then restores the
title on `window.focus`.

This satisfies the "browser print-to-PDF fallback" the spec explicitly
allows. Production should swap to a server-side PDF render (Puppeteer / a
PDF generation service) for predictable typography and pagination.

## Validation

- Personal: `isValidName`, `isValidIndianPhone`, optional but valid email,
  location ≥ 3 chars.
- Summary: 40-character minimum surfaced inline, max 500 with counter.
- Skills: name required, years 0–50, level enum.
- Experience: title + employer required.
- Education: qualification required, year valid.
- Certifications: name + issuer required, year sane (1950 – next year).
- Languages: name required, level enums.
- Documents: status from `available / pending / expired / not_uploaded`.
- References: name optional but flagged with consent checkbox.

## Profile completeness / readiness

`completenessScore(resume)` (in ResumeBuilderPage) and
`completenessFromResume(resume)` (in SkillPassportPage) both score on
the same 11 checks: name, phone, location, summary length, skills,
verified skill, certifications, experience, education, languages,
≥ 3 available documents.

The score appears on:
- Resume Builder (top of editor) with a coloured progress bar.
- Skill Passport (header band) as a 4th stat + readiness bar.
- JobApplyChoice → Swift Apply card (with a "Complete Resume"
  checklist when readiness < 60 %).

## Routing entry points

- `Profile → Documents & Skills → Resume Builder` opens the page.
- `Profile → My Services` already shows `My Applications` etc.
- `Skill Passport` header now has Edit / Share / Download icons; the
  bottom CTA row offers `Edit Passport` (outline) and `Open Resume
  Builder` (primary).
- `JobApplyChoice → Swift Apply` shows a checklist + "Complete resume" CTA.
- Chatbot: 9 new intents (`create my resume`, `download my resume`,
  `add education / experience / certificate`, `show my skill passport`,
  `share my profile`, `apply with my resume`, `resume builder`).

## i18n note

A minimal `src/i18n/translations/{en,hi,ml,ta,bn,or}.json` skeleton was
added with the keys requested by the spec (`resume.builder.*`,
`resume.sections.*`, `resume.actions.*`, `resume.validation.*`,
`resume.status.*`). The runtime translator/provider is **not** wired yet —
new strings remain literal English in JSX, matching the rest of the app.
Wiring `useTranslation` and switching all literals to `t(key)` is a
separate sprint.

## Known limitations

- PDF fidelity depends on the user's browser print engine — Chrome/Edge
  give the best result.
- No server-side resume hosting yet, so the "Share" button copies a stub
  link only.
- File uploads are mocked (status toggle on Documents); real uploads need
  a backend.
- The completeness score is heuristic, not predictive.
