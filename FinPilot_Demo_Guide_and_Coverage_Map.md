# FinPilot AI — Prototype Demo Guide & Coverage Map

**Files:** `finpilot-prototype-v11.jsx` (consumer app) · `finpilot-admin-portal.jsx` (staff surface)
**Scope:** Wave 1 (Epics 1–5) fully functional + Epics 6–9 modules + Enterprise Addendum surfaces
**Demo persona:** Arjun Mehta — Working Professional, metro city, 2 dependents, ₹18.4L net worth

---

## Part 1 — Demo Walkthrough Script (~12–15 minutes)

The narrative thread to hold throughout: **"Every number is computed, never guessed. Every AI claim is cited. Every action needs consent."** Each stop below reinforces one of those three.

### Stop 1 · Onboarding (2 min)

Launch the app. Walk the full flow once; use "Skip to demo dashboard" in later runs.

1. **Welcome** — point out the three pillars on screen: deterministic math, grounded AI, data ownership. These aren't marketing lines; the demo proves each one.
2. **Sign-up** — enter any email, OTP is `1234`.
3. **Persona** — pick *Working Professional*. Say: "This choice restructures the dashboard, the AI's tone, and which insights get priority — persona is a product spine, not a label (PROF-007)."
4. **Consent** — this is the trust-critical screen. Point at three things: the scope selector honestly says what *won't* work with read-only access; consent visibly expires in 12 months; the checkbox forces active acknowledgment. "Consent here is a designed experience, not a legal speed bump (AUTH-015)."
5. **Account linking** — select 2–3 banks, run the sync. Mention the manual-entry fallback line: an unsupported bank is a first-class path, not a dead end.
6. **Health Score reveal** — let the ring animate. Say: "This is the activation moment the PRD defines — real value from real data, inside the first session (Product Goal 1)."

### Stop 2 · Home (1 min)

- The **single alert strip** — one highest-priority alert, never a stack (notification-fatigue mitigation by design).
- The hero card: net worth counting up, live sparkline, score ring.
- **Switch personas** from the header dropdown — show Retiree: fewer widgets, larger text (Senior Mode, SET-010/DASH-010). Switch back.
- Toggle **dark mode** (SET-011) — full token-pair theme, not a filter.

### Stop 3 · Money (2 min)

- **Transactions:** search + filter chips; find `RZP*KIRANA STORE` and tap the low-confidence "confirm?" chip — the toast says FinPilot will remember the merchant. "AI categorization is confident when it can be, honest when it can't (EXP-005)."
- **Budgets:** threshold chips at 80%/over; the AI rebalance card — emphasize *accept or decline*, never auto-applied.
- **Income:** the smoothed usable-income figure with its ⓘ popover. "One income number, used identically by budgets, DTI, and goals — modules never disagree."
- **Subscriptions:** Netflix price-hike flag (+30%) and Spotify unused-detection.
- **Tax:** toggle the 80C switch — both regimes recompute live, the winner badge flips. Point at the ⓘ: the full formula is exposed. Filing countdown + advance-tax quarterly schedule for freelance income.

### Stop 4 · Wealth (2 min)

- **Investments:** allocation donut, per-holding XIRR (Newton's method, mention it if technical audience), the **overlap warning** — two funds sharing 3 top holdings = paying two expense ratios for fake diversification.
- **Loan:** drag the **prepayment slider**. "This is a full amortization simulation re-running on every pixel of drag — not a lookup table." Interest saved + tenure reduction update live.
- **Insurance:** the coverage-gap bars with transparent benchmarks (15× income + liabilities). Then point at the **SPONSORED placeholder**: visually separated, labeled, and it never touches the neutral analysis above it (Global Business Rule 4).
- **Reports:** monthly summary, Year-in-Review teaser, and the advisor share flow — add an annotation, generate the 7-day expiring link, revoke it.

### Stop 5 · Goals (2 min)

- **Health Score:** six pillars with weights and ⓘ explanations; versioned formula v1.2 — "past scores are never silently recalculated."
- **Simulator:** drag savings rate up, toggle "close the insurance gap" — the simulated score recomputes through the *same* formula. Read the caption aloud: "a preview, never a promise."
- **Peers:** the benchmarking showpiece. Show the percentile bars, then tap **"+ same industry sector"** — cohort drops to 43 users, below the 50-user privacy floor, and *everything disappears behind the shield card*. "Fail closed. The system would rather show nothing than risk identifying a real person (BENCH-002)."
- **Rewards:** level tied to score, streak freeze, and the **anti-gaming rule card** — no badge can be earned through financially harmful behavior (GAM-009).

### Stop 6 · Family (2 min)

- **Members:** toggle Priya's "Budgets" sharing off — jump to **Shared Budget** — her contributions now read "hidden by choice." "Sharing is per-person, per-category, revocable — a household is not a merged account (HH-001)."
- **Joint Goal:** the contribution ledger — factual, never judgmental.
- **Life Events:** the AI's income-jump detection card ("never acts on a guess"); then declare *New child* — one coordinated 3-item bundle appears (insurance recheck, education-goal draft, dependent profile). Each item individually accepted or deferred; the finish button stays locked until every item is decided. Completed events land on the timeline.

### Stop 7 · Rules (1 min)

- Build a rule live with the WHEN/THEN composer.
- Show the **conflict warning** (two rules tagging the same merchant) and resolve it by disabling one.
- **Audit Log:** "an automation that acts silently is a trust risk — every firing is recorded."
- **Suggested:** accept the AI's observed-pattern rule; it genuinely appears in the list.

### Stop 8 · AI Coach (2 min) — the closer

Ask the chips or type freely. Best live questions:
- *"Can I afford my Home Down Payment goal?"* — watch for cited figures `[goals]` `[income]` and the confidence line.
- *"Which mutual fund should I buy?"* — it should **refuse** the product recommendation (advisory boundary) while still offering grounded, useful context. "The refusal is the feature."

Close with: bell → **Notifications** (digest mode, snooze, the life-event bundle) and avatar → **Settings** (consent revocation, data-sharing audit log, export in 3 formats, the 30-day deletion flow) — the **Paywall** ("safety alerts are never paywalled — that's a board-level pricing principle, visible in the product").

### Optional Stop 9 · Admin Portal (2 min, technical/investor audiences)

Open `finpilot-admin-portal.jsx`:
- **AI Quality:** evaluation gates (release blocked if any zero-tolerance suite fails) and the prompt A/B viewer — show the mutual-fund scenario where the old prompt violates the advisory boundary and the candidate correctly refuses.
- **Incidents:** open the Sev-1, tag root causes, click "Convert to permanent regression test" — every incident produces a safeguard.
- **Feature Flags:** rollout sliders showing canary → staged → full, each flag carrying its Feature Inventory ID (live traceability, §53).
- **Compliance:** the planted disclosure violation, flagged red — "revenue never outranks disclosure."

---

## Part 2 — Feature Coverage Map

Implemented Feature IDs by module (✅ = interactive in prototype · 🔶 = represented/visible principle · ⬜ = not in prototype scope).

| Module | Implemented in prototype | Notes |
|---|---|---|
| M01 Auth | AUTH-001 ✅ (email+OTP), AUTH-014 🔶, AUTH-015 ✅ (scope, expiry, revoke) | Login/2FA/biometrics not simulated |
| M02 Profile | PROF-007 ✅ (persona drives dashboard), PROF-006 ✅, PROF-008 ✅ (dependent) | |
| M03 Financial Profile | FPROF-001 ✅ (multi-bank link + fallback note) | |
| M04 Dashboard | DASH-001–007 ✅, DASH-010 ✅ (persona templates), DASH-011 ✅ (alert strip) | Drag-rearrange (008) not built |
| M05 Expense | EXP-001/002 ✅, EXP-005 ✅ (confidence + confirm), EXP-010/011 ✅, EXP-011-01 ✅ (price hike), EXP-012/013 ✅ (search/filter), EXP-015 ✅ | |
| M06 Income | INC-001 ✅, INC-004 ✅ (smoothing, used platform-wide), INC-004-02 ✅ (tax nudge), INC-016 ✅ (raise detection → Life Events) | |
| M07 Budget | BUD-001/005 ✅, BUD-006 ✅ (thresholds), BUD-009 ✅ (AI rebalance, consent-first) | |
| M08 Investment | INV-005 ✅, INV-006 ✅ (real XIRR), INV-007 ✅ (risk alignment), INV-008 ✅ (overlap) | |
| M09 Loan | LOAN-002 ✅, LOAN-003 ✅ (live simulator), LOAN-005 ✅ (DTI) | |
| M10 Insurance | INS-002 ✅, INS-003 ✅ (transparent gap math), INS-009/010 ✅ (via Life Events) | |
| M11 Bills/Subs | BILL-004 ✅, BILL-005 ✅ (unused), BILL-006 ✅ | |
| M12 Goals | GOAL-001/002 ✅, GOAL-003/004 ✅ (feasibility states), GOAL-012 ✅ (ledger) | |
| M14 Health Score | FHS-001 ✅ (6-pillar v1.2 formula), FHS-003 ✅, FHS-004 ✅ (ranked actions), FHS-005 ✅ (simulator), FHS-006 ✅ (percentile) | |
| M15 Net Worth | NW-001–003 ✅ (trend, split) | |
| M16 Reports | REP-001 ✅, REP-006 ✅ (expiring link), REP-008 ✅ (scheduled), REP-009 ✅, REP-014 ✅ (annotation) | |
| M17 AI Assistant | AI-001 ✅ (live, grounded), AI-003 ✅ (chips), AI-004/005 ✅ (insight cards), AI-008 ✅ (deterministic tool layer), AI-011 ✅ (conversation memory) | Multi-agent pipeline compressed into one grounded call with guardrail prompt |
| M19 RAG | RAG-003 ✅ (citations), RAG-004 ✅ (confidence) | Over computed evidence, not vector search |
| M25 Tax | TAX-002 ✅ (live regime comparison), TAX-003 ✅, TAX-005 ✅, TAX-010 ✅ | |
| M26 Notifications | NOTIF-003 ✅, NOTIF-005 ✅ (digest), NOTIF-007 ✅ (inbox), NOTIF-008 ✅, NOTIF-010 ✅ (bundle), NOTIF-011 ✅ (snooze) | |
| M27 Gamification | GAM-001 ✅, GAM-003 ✅ (score-tied levels), GAM-005 ✅, GAM-006 ✅ (freeze), GAM-009 ✅ (anti-gaming rule), GAM-010 ✅ | |
| M28 Admin | ADM-001/002 ✅, ADM-011 ✅ (eval gates), ADM-012 ✅ (triage→regression), ADM-013 ✅ (A/B), ADM-014 ✅, ADM-015 ✅ (disclosure audit), ADM-016 ✅, ADM-017 ✅, ADM-018 ✅ (flags+traceability) | Separate file |
| M29 Settings | SET-002 ✅ (revoke/re-link), SET-004 ✅ (export + 30-day deletion), SET-006 ✅, SET-009 ✅, SET-010 ✅, SET-011 ✅, SET-012 ✅ | |
| M30 Security | SEC-007 ✅ (access audit trail) — others ⬜ | |
| M32 Household | HH-001 ✅, HH-002 ✅ (invite), HH-003/004 ✅, HH-005 ✅, HH-006 ✅, HH-010 ✅, HH-011 ✅ | |
| M33 Automation | AUTO-001 ✅ (builder), AUTO-006 ✅ (audit), AUTO-007 ✅ (conflict), AUTO-008 ✅, AUTO-009 ✅ | |
| M34 Benchmarking | BENCH-001 ✅ (cohort card), BENCH-002 ✅ (fail-closed demo), BENCH-003 ✅ (global opt-in), BENCH-004/005/007/008 ✅ | |
| M35 Life Events | LIFE-001 ✅, LIFE-002 ✅ (consent-gated), LIFE-003 ✅ (timeline), LIFE-004–009 ✅ (workflow bundles) | |
| §29–30 Pricing | Three tiers ✅, activation-timed trial ✅, safety-never-gated ✅, honest cancel ✅ | |

**Not in prototype scope (by design):** real backend/persistence, actual AA/bank integrations, Document Intelligence & OCR upload flows (M20–24), Knowledge Base (M18), Support surfaces (M31), login/2FA, true multi-agent orchestration, and production security. These require a real engineering build; the prototype simulates their outcomes where relevant.

---

## Part 3 — Running the Prototype

- Open either `.jsx` file as a Claude artifact (or drop into any React + Recharts environment).
- Onboarding OTP: **1234**. "Skip to demo dashboard" bypasses the flow.
- The AI Coach makes live model calls inside Claude artifacts; on failure it degrades gracefully to the "deterministic features still work" state — which is itself demo-able as the NFR fallback behavior.
- Data is in-memory and resets on reload (artifacts don't persist) — a clean slate for every demo is a feature here.
