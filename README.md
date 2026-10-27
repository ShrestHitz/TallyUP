# 🛡️ TallyUP — Decent Work Platform & Pocket Witness

[![UN SDG 8](https://img.shields.io/badge/UN%20SDG%208-Decent%20Work%20%26%20Safety-a3e635?style=for-the-badge&logo=target)](https://sdgs.un.org/goals/goal8)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tests Pass](https://img.shields.io/badge/Tests-21%2F21%20Pass%20(100%25)-a3e635?style=for-the-badge&logo=checkmarx)](https://github.com/ShrestHitz/TallyUP)
[![ISO 45001](https://img.shields.io/badge/Standard-ISO%2045001%20%2B%20BOCW-00d2d3?style=for-the-badge)](https://www.iso.org/iso-45001-occupational-health-and-safety.html)

> ### **EVERY HOUR COUNTS.**
> **COUNT IT. PROVE IT. GET PAID.**  
> *A tamper-evident workforce platform where every hour worked, every rupee earned, and every safety hazard reported becomes cryptographically provable in the worker's native tongue.*

---

## 🎯 1. Chosen Vertical
* **Vertical:** **UN Sustainable Development Goal 8 — Decent Work and Economic Growth** (Target 8.8: Safe working environments; Target 8.5: Equal pay and protection from wage theft).
* **Target Workforce:** India's 50M+ unorganized frontline workforce across **Metro Rail infrastructure, civil construction, mining, and institutional campuses**.
* **Statutory Framework:** Aligned with the **Building & Other Construction Workers (BOCW) Act 1996**, **Factories Act 1948**, and **ISO 45001** occupational health standards.

---

## 🧠 2. Approach & Core Logic

| Core Engine | Problem Solved | Technical Logic |
| :--- | :--- | :--- |
| **Pocket Witness** | Retroactive supervisor attendance tampering & deleted overtime | Every check-in/out generates an immutable SHA-256 block: `Hash = SHA256(WorkerID + Date + Time + Hours + Geo + PrevHash)`. Stored locally with visual QR receipt (`PW-XXXX-YYYY`). Altering a single record breaks the cryptographic chain with instant red audit flags. |
| **Wage Guardian** | Unverifiable deductions & opaque pay calculations | Deterministic rule engine recalculates statutory gross pay using the mandatory **2.0x BOCW overtime multiplier** and flags contractor underpayments. Includes **Web Speech API narration in 7 Indian languages** explaining exact discrepancies. |
| **Multimodal Hazard Triage** | Low worker literacy preventing written hazard logs | Frontline worker records a 5-second voice note and/or photo. Gemini 1.5 Flash (with resilient offline heuristics) triages into severity categories (`P1-Critical`, `P2-Moderate`, `P3-Low`), starts SLA timers, and awards an instant **₹250 safety vigilance bounty**. |
| **Safe Voice Whistleblower** | Fear of supervisor retaliation and identification | Submissions are completely de-identified. AI pipeline scrubs personal names, gate numbers, and exact timestamps into generic contextual descriptions before supervisor delivery. |

---

## ⚙️ 3. How the Solution Works

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TALLYUP DUAL ARCHITECTURE                       │
├──────────────────────────────────┬─────────────────────────────────────┤
│      WORKER INTERFACE (PWA)      │      SUPERVISOR COMMAND CENTER      │
│  • 3-Step Guided Onboarding      │  • Live Headcount & Fatigue Tracker │
│  • 7 Indian Languages + Audio    │  • 5-Stage Hazard Resolution Hub    │
│  • GPS Geotag Photo Check-In     │  • Instant ₹250 Reward Approval     │
│  • Pocket Witness Verified Board │  • Cryptographic Chain Audit Log    │
│  • Instant Daily UPI Payouts     │  • Sector Profile Switcher (Metro)  │
└──────────────────────────────────┴─────────────────────────────────────┘
```

1. **Onboarding Flow:**
   * **Screen 1 (Splash):** Mission overview with live telemetry (180+ incident-free days, ₹250 verified rewards).
   * **Screen 2 (Language Selector):** Native script selection across **7 Indian languages** (`English`, `हिन्दी`, `தமிழ்`, `മലയാളം`, `বাংলা`, `తెలుగు`, `ಕನ್ನಡ`).
   * **Screen 3 (Role Selector):** Dual interface selection (`Frontline Worker` vs. `Supervisor / Admin`).
2. **Worker Daily Shift:**
   * Worker checks in via **GPS Geotag Selfie**, verifying physical presence inside the 300m job-site geofence.
   * Shift timer tracks elapsed regular vs. overtime hours in real-time.
   * Clocking out generates a **Pocket Witness verification hash** and instant ledger block.
3. **Safety & Wage Protection:**
   * Worker taps **Wage Guardian** to hear an audio breakdown of legitimate pay vs. contractor payout in their mother tongue.
   * Reporting any site hazard immediately awards **₹250 cash vigilance bounty** directly to their UPI-ready wallet.
4. **Supervisor Command Console:**
   * Real-time headcount, cumulative fatigue warnings, and 5-action hazard resolution hub (`Acknowledge`, `Assign`, `Reject`, `Dispatch`, `Resolve`).

---

## 💡 4. Key Assumptions Made

1. **Low-Literacy First:** Blue-collar workers operate primarily via icons, color-coded status pills, and native audio speech synthesis rather than complex tabular HR forms.
2. **Urban GPS Drift Tolerance:** Metro infrastructure sites cause satellite signal bounce; a **300-meter site perimeter geofence** combined with camera photo proof prevents false attendance rejections.
3. **Statutory 2.0x Overtime:** Labor laws (BOCW Act / Factories Act) mandate double-rate pay beyond 8 daily hours. TallyUP calculates legitimate pay strictly on statutory standards.
4. **Offline Proof Verification:** Works even with intermittent deep-trench connectivity; attendance receipts are cryptographically verifiable on-device.
5. **Vigilance Reward Incentive:** Direct ₹250 cash bounties incentivize workers to report hazards *before* they turn into fatal Lost Time Injuries (LTI).

---

## 🧪 5. Automated Testing (100% Pass Rate)

TallyUP includes a native automated test harness running **21 comprehensive unit & integration specs** in under 600ms:

```bash
npm test
```

```
TAP version 13
ok 1 - computeBlockHash: generates consistent 64-char SHA-256 hex string
ok 2 - generateReceiptCode: creates formatted Pocket Witness code
ok 3 - verifyLedgerChain: validates clean sequential blockchain
ok 4 - verifyLedgerChain: detects retroactive tampering of overtime hours
ok 5 - LANGUAGE_OPTIONS: supports 7 diverse Indian languages
ok 6 - TRANSLATIONS: critical UI keys exist across all languages
ok 7 - TRANSLATIONS: authentic regional Unicode scripts verified
ok 8 - INCIDENT_CLASSIFICATIONS: all OSHA/ISO incident tiers defined
ok 9 - SAFETY_HAZARD_CATEGORIES: covers critical frontline risk vectors
ok 10 - computeMonthlySafetyStats: validates TRIR, AFR & reward math
ok 11 - SECTORS: construction & campus compliance standards verified
ok 12 - SECTORS.construction: enforces statutory BOCW 2.0x overtime
ok 13 - SECTORS.campus: enforces 1.5x overtime with facility zones
ok 14 - triageHazardReport: classifies electrical risk as P1_CRITICAL
ok 15 - triageHazardReport: classifies scaffolding vibration as P1_CRITICAL
ok 16 - triageHazardReport: classifies liquid slip hazards as P2_MODERATE
ok 17 - triageHazardReport: classifies PPE breaches as P3_LOW
ok 18 - scrubFeedbackIdentity: sanitizes names, gates & timestamps
ok 19 - calculateShiftHours: separates standard vs. overtime hours
ok 20 - auditWorkerPay: detects wage underpayment using BOCW multiplier
ok 21 - auditWorkerPay: generates voice explanations in 7 languages
# tests 21 | pass 21 | fail 0 | duration 581ms
```

---

## ⚡ 6. Quickstart & Tech Stack

```bash
# 1. Clone repository
git clone https://github.com/ShrestHitz/TallyUP.git
cd TallyUP

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
# Open http://localhost:3000

# 4. Run automated tests
npm test

# 5. Production build
npm run build
```

* **Core Stack:** Next.js 14 (App Router), React 18, TypeScript 5.7
* **AI & Voice:** Google Gemini 1.5 Flash (`@google/generative-ai`), Web Speech Recognition & Synthesis API
* **Security & Cryptography:** Web Crypto SubtleCrypto SHA-256, HTTP Security Headers (CSP, FrameGuard)
* **Styling:** Vanilla CSS Tokens (Carbon Black `#08090a` & Cyber Lime `#a3e635` / `#ccff00`)
* **Bundle:** Ultra-lightweight (140 kB First Load JS, 5.90 MB total repo size)
