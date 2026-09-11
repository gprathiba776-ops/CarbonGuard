# CarbonGuard AI

## Autonomous ESG & Carbon Accounting Compliance Copilot

**CarbonGuard AI is a governed, fail-closed ESG accounting pipeline that combines Lyzr agent orchestration with deterministic emission-factor lookup and deterministic emissions calculation.**

> **Core principle:** LLMs reason and orchestrate. Deterministic tools calculate. Verified source data provides numerical authority.

CarbonGuard is designed for the hardest part of ESG automation: not merely producing a carbon number, but proving **why that number is allowed to exist**.

---

## Why CarbonGuard

ESG and carbon-accounting workflows combine messy source records, Scope 1/2/3 classification, unit handling, emission-factor selection, calculations, disclosure controls and audit evidence. A conventional LLM workflow can sound confident while silently guessing a factor, performing arithmetic incorrectly, or approving an unsupported reduction claim.

CarbonGuard uses a different control boundary:

**Source data → Lyzr Intake → Lyzr Scope Classification → Lyzr Factor Resolution → deterministic Factor Lookup → deterministic Calculator → Lyzr Governance → Lyzr Disclosure**

If the required evidence is not verified, the system does **not** manufacture a result.

Supported control states include:

- `VERIFIED`
- `CALCULATED`
- `READY_FOR_DISCLOSURE`
- `APPROVED`
- `REVIEW_REQUIRED`
- `FACTOR_NOT_FOUND`
- `UNSUPPORTED_CLAIM`
- `BLOCKED`
- `UNKNOWN`

---

## Competition Rubric Alignment

CarbonGuard is explicitly engineered around the judging rubric.

| Rubric pillar |  CarbonGuard evidence |
|---|---|
| **Lyzr Architecture & Tool Calling**   | Five specialized Lyzr agents, Lyzr SuperFlow orchestration, deterministic OpenAPI tools, explicit handoff contracts, Agent → Tool → Agent boundaries |
| **Emission Calculation Accuracy**  | Official 2026 factor dataset, hard constraint matching, deterministic calculator, exact units/formulas, fail-closed unresolved-factor behavior |
| **Auditability & Traceability**| Source record → activity → scope → factor → formula → result → governance → disclosure lineage |
| **Sustainability Dashboard UX**| Action-oriented governance state, Scope KPIs, factor/formula evidence, audit trail and disclosure readiness |

### Six optimization metrics

CarbonGuard's engineering and evaluation strategy also targets:

1. **Hallucination Mitigation** — no guessed factors, no invented quantities, no unsupported environmental claims.
2. **Groundedness** — every material output is anchored to upstream records, verified factors and explicit evidence.
3. **Retrieval Quality** — semantic retrieval is treated as contextual evidence; numerical authority remains deterministic rather than similarity-based.
4. **Costing & Token Optimization** — narrow agent responsibilities, structured outputs, minimal tool scope and reduced redundant context are prioritized.
5. **Prompt Architecture** — defensive instructions, fail-closed states, provenance preservation and explicit tool gates.
6. **Latency Optimization** — short agent roles, deterministic tools and measured end-to-end execution are monitored without sacrificing verification.

---

## Lyzr Architecture

CarbonGuard uses Lyzr as the governed agent layer rather than as an unbounded calculation engine.

### Environment · Agent · Inference

**Environment**
- Model/tool credentials are externalized.
- Official emission-factor data is versioned separately from prompts.
- Deterministic Factor Lookup and Calculator are exposed as tools.
- Secrets are never committed to source control.

**Agent**
- Agents are authored/configured in **Lyzr Agent Studio**.
- Each agent has one responsibility and a bounded decision surface.
- Structured output contracts are used wherever the runtime configuration supports them.
- Tool permissions are intentionally narrow.

**Inference**
- **Lyzr Agent API / SuperFlow runtime** provides the execution boundary.
- The dashboard sends a normalized activity record to the workflow webhook.
- SuperFlow hands the record through the five-agent chain.
- Deterministic backend tools return authoritative factor/calculation results.
- The final governance-reviewed disclosure is returned to the dashboard.

### Lyzr components

- **Lyzr Agent Studio** — agent definitions, instructions, tools, structured outputs and governance configuration.
- **Lyzr Agent API** — deployable agent inference interface.
- **Lyzr SDK** — application-side integration option for invoking and composing Lyzr capabilities programmatically.
- **Lyzr AIMS** — governance/evaluation/monitoring layer for controlled agent operation; repository documentation separates these governance controls from the application runtime.
- **Lyzr SuperFlow** — end-to-end multi-agent orchestration and webhook entry point.
- **Lyzr Knowledge Base / Qdrant** — contextual evidence/retrieval layer, not the numerical source of truth.

> Numerical authority is deliberately outside semantic similarity retrieval: a retrieved passage can support context and provenance, while the deterministic Factor Lookup service decides whether a factor is uniquely verified.

---

## Five-Agent Control Plane

### 1. CarbonGuard Intake
**Role:** ESG Data Intake and Normalization Agent

Extracts activity, quantity, unit, date, location, supplier and source identifiers. Missing or ambiguous fields become `UNKNOWN`; it never calculates or selects factors.

### 2. CarbonGuard Scope Classifier
**Role:** GHG Scope Classification Agent

Classifies normalized activities as Scope 1, Scope 2 or Scope 3 using the supplied evidence. Insufficient evidence produces `REVIEW_REQUIRED`.

### 3. CarbonGuard Factor Resolver
**Role:** Verified Emission Factor Resolution Agent

Calls the deterministic Factor Lookup tool. A single exact match is required before the deterministic Calculator is allowed to execute.

### 4. CarbonGuard Governance
**Role:** ESG Compliance and Greenwashing Governance Agent

Checks factor provenance, calculation evidence, audit completeness and environmental claims. Unsupported claims cannot become disclosure-ready.

### 5. CarbonGuard Disclosure
**Role:** Audit-Ready ESG Disclosure Generation Agent

Produces the final disclosure only when the required evidence chain is complete and governance returns `READY_FOR_DISCLOSURE`.

---

## Deterministic Tool Boundary

### Factor Lookup

The Factor Lookup service uses hard constraints such as:

`year + scope + unit + category + activity + subtype`

It returns:

- `VERIFIED` — exactly one compatible factor
- `REVIEW_REQUIRED` — multiple compatible factors remain
- `FACTOR_NOT_FOUND` — no compatible factor exists

There is no semantic similarity fallback for numerical factor selection.

### Calculator

The Calculator executes only when the factor status is `VERIFIED`.

Conceptually:

`kg CO2e = quantity × verified factor`

`tCO2e = kg CO2e / 1000`

The LLM never performs or edits the authoritative arithmetic.

---

## Fail-Closed Governance

CarbonGuard intentionally prefers an incomplete answer over a fabricated answer.

Examples:

- Ambiguous diesel factor → `REVIEW_REQUIRED`
- Unknown factor → `FACTOR_NOT_FOUND`
- Missing quantity → `UNKNOWN`
- Missing audit evidence → `REVIEW_REQUIRED`
- Unsupported claimed reduction → `UNSUPPORTED_CLAIM`
- Unresolved/blocked upstream result → `BLOCKED`

This is the project's primary hallucination-mitigation mechanism.

---

## Verified Example

For the tested 2026 UK diesel activity:

- Activity: Diesel (100% mineral diesel)
- Quantity: 2500 litres
- Scope: Scope 1
- Verified factor: 2.66155 kg CO2e/litre
- Formula: `2500 × 2.66155`
- Result: 6653.875 kg CO2e = 6.653875 tCO2e
- Factor ID: `1_101_1012_8_1`
- Source: UK Government GHG Conversion Factors 2026, revised July 2026 flat file

The value is copied from the deterministic tool chain rather than generated by the LLM.

---

## Evidence-First Audit Lineage

Every disclosure is designed to preserve:

**Source record → Activity → Scope → Factor → Formula → Result → Governance → Disclosure**

The dashboard surfaces this lineage instead of displaying a carbon number without explanation.

---

## Retrieval Strategy

CarbonGuard evaluated semantic retrieval against the emission-factor corpus and found that broad activity words such as “diesel” can retrieve incompatible factors (different scope, unit or activity). Therefore the system does **not** use vector similarity as numerical authority.

This is an intentional architecture decision:

**Retrieval = contextual evidence.**  
**Deterministic constraints = numerical verification.**

The retrieval evaluation is documented in `evaluation/retrieval/retrieval-evaluation.md`.

---

## Security

Never commit:

- Lyzr API keys
- model-provider API keys
- SuperFlow webhook secrets
- supplier credentials
- private source documents
- production tokens

Use `.env.example` as a template only. Regenerate any webhook secret that has ever been exposed outside the protected Lyzr environment before final submission.

---

## Repository Map

```text
CarbonGuard-AI/
├── README.md
├── ARCHITECTURE.md
├── EVALUATION.md
├── TEST_RESULTS.md
├── SECURITY.md
├── .env.example
├── .gitignore
├── agents/
│   ├── README.md
│   ├── intake-agent.json
│   ├── scope-classifier-agent.json
│   ├── factor-resolver-agent.json
│   ├── governance-agent.json
│   ├── disclosure-agent.json
│   └── carbonguard-esg-superflow.json
├── frontend/
│   ├── README.md
│   └── src/
├── backend/
│   ├── factor-api/
│   └── calculator-api/
├── evaluation/
│   ├── accuracy/
│   ├── hallucination/
│   ├── retrieval/
│   ├── latency/
│   ├── token-optimization/
│   └── failure-cases/
└── docs/
    ├── audit-lineage.md
    ├── greenwashing-governance.md
    ├── emission-factor-provenance.md
    
```

---

## Status

CarbonGuard has been tested against valid calculations, ambiguous factors, unknown factors, missing inputs, missing audit evidence, unsupported reduction claims, Scope 1 diesel and Scope 2 electricity.

See `TEST_RESULTS.md` and `EVALUATION.md` for the evidence matrix.


## Executable repository

This repository contains the implementation artifacts needed for review, not only design documents:

- `agents/` — exported Lyzr Agent Studio configurations and SuperFlow definition
- `frontend/` — the React/TypeScript CarbonGuard dashboard and server-side SuperFlow proxy
- `backend/factor-api/` — deterministic 2026 factor registry and lookup service
- `backend/calculator-api/` — deterministic emissions calculator
- `tests/` — executable deterministic safety and accuracy tests
- `.github/workflows/ci.yml` — automated Python and frontend checks
- `docker-compose.yml` — local multi-service runtime

### Run deterministic tests

```bash
make test-python
```

### Run the backend services

```bash
cd backend/factor-api && pip install -r requirements.txt
flask --app app run --port 8001

cd backend/calculator-api && pip install -r requirements.txt
flask --app app run --port 8002
```

### Run the dashboard

```bash
cd frontend
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

### Run with Docker Compose

```bash
docker compose up --build
```

No production webhook/API secret belongs in the repository. Configure credentials through environment variables or the deployment platform's secret store.
