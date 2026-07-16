<div align="center">

# 💰 FinPilot AI

### Your AI-Powered Personal Financial Intelligence Platform

[![Status](https://img.shields.io/badge/status-early--build-orange)](#-status)
[![License](https://img.shields.io/badge/license-TBD-lightgrey)](#)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%20%7C%20TypeScript-000000?logo=nextdotjs)](#-tech-stack)
[![Backend](https://img.shields.io/badge/backend-Java%2021%20%7C%20Spring%20Boot-6DB33F?logo=springboot&logoColor=white)](#-tech-stack)
[![AI](https://img.shields.io/badge/AI-Python%20%7C%20FastAPI%20%7C%20LangGraph-3776AB?logo=python&logoColor=white)](#-tech-stack)
[![Database](https://img.shields.io/badge/database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](#-tech-stack)

FinPilot AI aggregates a user's full financial life — bank accounts, cards,
investments, loans, insurance, and documents — into a single grounded,
explainable AI coaching layer. Every number shown to the user comes from a
**deterministic calculation engine**; the AI explains and recommends, it
never invents figures.

</div>

---

## 📚 Documentation

The product is specified across five companion documents (not yet all
present in this repo as files, but referenced throughout the codebase and
commit history by ID):

| Doc | Contents |
|---|---|
| `00_Feature_Inventory` *(+ v2 addendum)* | 501 features across 35 modules — the source of truth for every Feature ID (`AUTH-*`, `EXP-*`, `AI-*`, etc.) |
| `01_PRD` *(+ Enterprise Addendum)* | Vision, personas, scope, functional/non-functional requirements, business rules, KPIs, release/compliance/governance strategy |
| `02_Product_Backlog` | Epics broken into tickets with business flows, rules, edge cases, and acceptance criteria |
| `03_AI_Design_Document` | Multi-agent AI architecture (Planner, Retrieval, Calculation, Coaching, Reflection, Compliance, Risk, Recommendation agents), RAG pipeline, guardrails |
| `04_UX_Documentation` / `05_Testing_Documentation` | Screen specs and test plans |

> 🔎 **Tip:** Every feature, ticket, and screen traces back to a Feature
> Inventory ID. Grep the codebase for an ID (e.g. `FPROF-001`) to find
> everything related to that feature across docs, backend, and frontend.

---

## 🗂️ Repository layout

```
backend/        Spring Boot (Java) — core domain, deterministic calculations, auth, consent
frontend/       Next.js (TypeScript) — web/mobile-web client
ai-service/     Python + FastAPI + LangGraph — multi-agent AI coaching layer
infra/          Docker Compose, database init, environment templates
prototype/      Standalone JSX showcase prototype (not part of the production build)
```

> ⚠️ Not all of the above directories exist yet — they are being built out
> epic-by-epic, starting with **Epic 1: Financial Onboarding & Aggregation**.

---

## 🛠️ Tech stack

<table>
<tr><td valign="top">

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form + Zod
- Recharts

</td><td valign="top">

**Backend**
- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA / Hibernate
- JWT + OAuth2
- PostgreSQL (Flyway migrations)
- Redis

</td><td valign="top">

**AI**
- Python + FastAPI
- LangGraph (+ LangChain, selectively)
- OpenAI / Gemini
- Qdrant (vector DB)

</td><td valign="top">

**Infra**
- MinIO (local) / S3 (prod)
- RabbitMQ
- Docker + Docker Compose
- GitHub Actions

</td></tr>
</table>

---

## 🧭 Core principles

> These are non-negotiable across all code — every feature is reviewed against them.

- 🔢 **No AI-generated number without a deterministic source.** The language
  model explains and recommends; it never invents a figure. All financial
  math (Financial Health Score, XIRR, tax estimates, coverage gaps, EMI
  simulations) lives in versioned, auditable calculation logic.
- 🔐 **Consent is scoped, time-boxed, and revocable.** No financial account
  is linked without explicit, granular consent; every consent grant has a
  visible expiry and a one-tap revocation path.
- 📢 **Sponsored content is always disclosed and never blended into neutral
  analysis.** Any third-party product placement is visually separated from
  the platform's own recommendations.
- 🎓 **Educational, not licensed advice.** FinPilot AI never executes
  trades, moves money, or files taxes on a user's behalf — it informs and
  recommends only.
- 🔍 **Explainability over black-box advice.** Every score and
  recommendation is traceable to its inputs and logic, on demand.

---

## 🎨 `/prototype`

Two standalone React files used for early UX/product exploration, wrapped in
a minimal Vite build:

- `prototype/finpilot-prototype-v3.jsx` — the **consumer app** (onboarding →
  Home → Money → Wealth → Goals → Family → Rules → AI Coach → Notifications
  → Settings)
- `prototype/finpilot-admin-portal.jsx` — the **staff surface** (AI quality
  gates, incident triage, feature flags, compliance audit)

Together they cover **Wave 1 (Epics 1–5) fully functional**, plus modules
from Epics 6–9 and the Enterprise Addendum. See
[`FinPilot_Demo_Guide_and_Coverage_Map.md`](FinPilot_Demo_Guide_and_Coverage_Map.md)
for the full walkthrough script and the feature-by-feature coverage table
(implemented ✅ / represented 🔶 / not in scope ⬜ against every Feature ID).

<details>
<summary><strong>What it is / isn't — click to expand</strong></summary>

<br>

It is **not** part of the production build:
- Uses inline styles instead of Tailwind/shadcn
- Hardcoded mock data instead of real API calls
- A direct client-side call to an LLM API instead of going through the
  backend/AI service
- Data is in-memory only and resets on reload — no real backend,
  persistence, or bank integrations

It exists purely as a design and interaction reference while the real
Next.js frontend is built out against the actual backend.

**Not simulated (by design):** real backend/persistence, actual
Account Aggregator/bank integrations, Document Intelligence & OCR upload
(M20–24), Knowledge Base (M18), Support surfaces (M31), login/2FA, true
multi-agent orchestration, and production security.

**Running it locally:**
```bash
cd prototype
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to prototype/dist/
```

Onboarding OTP is `1234`; use "Skip to demo dashboard" to bypass the flow
on repeat runs. The AI Coach makes live model calls — on failure it degrades
gracefully to a "deterministic features still work" state.

</details>

---

## 🚀 Getting started

Production setup instructions will land here once the backend, frontend,
and infra scaffolding are in place — starting with **Ticket 1.1: Bank
Account Linking via Consent Framework**, under Epic 1.

**Prerequisites for local development:**

| Requirement | Version |
|---|---|
| JDK | 21 |
| Node.js | 21+ |
| Docker Desktop | with WSL2 backend on Windows — for PostgreSQL, Redis, RabbitMQ, and MinIO via Docker Compose |

---

## 📍 Status

> 🟠 **Early build (production stack).** Currently scaffolding **Epic 1:
> Financial Onboarding & Aggregation**, starting with **Ticket 1.1: Bank
> Account Linking via Consent Framework**.
>
> 🟢 **Prototype (design reference).** Wave 1 (Epics 1–5) is fully
> functional in the `/prototype` JSX apps, with modules from Epics 6–9 and
> the Enterprise Addendum also represented. See the
> [Demo Guide & Coverage Map](FinPilot_Demo_Guide_and_Coverage_Map.md) for
> the walkthrough script and per-feature status — this is UX/product
> validation, not a substitute for the production backend/frontend build.

