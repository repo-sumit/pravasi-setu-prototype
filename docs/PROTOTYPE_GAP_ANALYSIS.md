# Pravasi Setu Prototype — Gap Analysis

Tracks what is implemented in the React/Vite prototype vs. the BRD and the
remittance research brief. **Everything is mock/prototype-safe** — no real
financial, banking, or government integrations are claimed.

## BRD coverage

| BRD module                          | State        | Where                                                                      |
|------------------------------------ |--------------|----------------------------------------------------------------------------|
| Onboarding + profile creation       | ✓ Done       | SplashPage, LoginPage, OTPPage, KYCPage, **ProfileSetupPage** (5 steps)    |
| Skill passport                      | ✓ Done       | SkillPassportPage with NSDC partner strip                                  |
| Certificate verification            | ✓ Done       | CertificateVerificationPage with verifier authority + on-chain hash UI     |
| Job discovery (dataset-backed)      | ✓ Done       | JobsPage — 100 records derived from `migrant_jobs_dataset.xlsx`           |
| Employer profile + ratings          | ✓ Done       | EmployerProfilePage with compliance flags                                  |
| Application tracking                | ✓ Done       | ApplicationTrackerPage list + detail w/ 5-step pipeline                    |
| Migration cost calculator           | ✓ Done       | CalculatorPage with master/detail layout on desktop                        |
| Pre-departure checklist             | ✓ Done       | PreDeparturePage + service partner tiles                                   |
| Post-arrival support                | ✓ Done       | PostArrivalPage                                                            |
| **Remittance flow** (Western Union-style) | ✓ Done | RemittancePage — Quote → Method → Recipient → KYC → Funding → Review → Confirm |
| Transfer tracking                   | ✓ Done       | TransferTrackerPage with full status enum + exception banner               |
| Grievance system                    | ✓ Done       | GrievancePage + TicketDetailPage with embassy/MEA/legal routing            |
| Emergency assistance                | ✓ Done       | EmergencyAssistancePage with SOS, hotlines, scenario buttons               |
| Return & reintegration              | ✓ Done       | ReturnPage with NSDC-mapping cards                                          |
| Multilingual chatbot                | ✓ Done       | ChatPage with 40+ intents covering BRD + remittance prompts                |
| Trust badges / partner logos        | ✓ Done       | PartnerStrip on Splash / KYC / Passport / Certificate / Remittance         |

## Remittance research-doc coverage

| Spec area              | State        | Notes                                                                  |
|------------------------|--------------|------------------------------------------------------------------------|
| Quote-first flow       | ✓ Done       | Step 1 leads with rate/fee/recipient-gets summary                      |
| Provider compare       | ✓ Done       | 8 providers (WU, Wise, Remitly, MoneyGram, WorldRemit, SBI, ICICI, NPCI UPI) |
| Delivery methods       | ✓ Done       | UPI, Bank account, Cash pickup with ETA + fee% + description           |
| Recipient forms        | ✓ Done       | Dynamic form per method; saved recipients chips; purpose dropdown      |
| KYC simulation         | ✓ Done       | "Already verified" view with sender details + high-value notice        |
| Funding methods        | ✓ Done       | Debit, credit, bank transfer, Apple/Google Pay, agent                  |
| Review screen          | ✓ Done       | Full breakdown + fraud warning + refund policy banner                  |
| Confirmation           | ✓ Done       | Transfer ID, track, share, notify, save recipient, send-again, rate alert |
| Status enum            | ✓ Done       | All 16 states from §12.3 mapped to chip tone                          |
| Exception states       | ✓ Done       | Cash-pickup expired, refund-initiated banner; failed/cancelled chips    |
| Trust copy             | ✓ Done       | Recipient warning, fraud warning, KYC prompt, refund-policy banner     |
| Chat-first initiation  | ✓ Done       | Chatbot intents for send / track / cheapest / UPI / bank / cash / alert |

## Out of scope (prototype-safe)

- No real RBI / FEMA / MTSS / RDA registrations.
- No real banking, NPCI, exchange-house, or KYC partner APIs.
- Provider rates and fees are illustrative — labelled accordingly.
- Cards/Apple Pay/Google Pay UIs are visual stubs only — no payment SDK.
