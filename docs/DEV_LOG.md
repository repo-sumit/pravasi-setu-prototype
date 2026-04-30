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
