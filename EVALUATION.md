# CarbonGuard AI — Evaluation Strategy

CarbonGuard is evaluated against both the competition rubric and six engineering metrics.

## Rubric scorecard

### 30% — Lyzr Architecture & Tool Calling

Evidence:
- Five specialized Lyzr agents.
- Lyzr Agent Studio configurations committed under `agents/`.
- Lyzr SuperFlow orchestration.
- Factor Resolver has a deterministic tool gate.
- Calculator is invoked only after `VERIFIED`.
- Agent API/SuperFlow provides inference boundary.
- Environment · Agent · Inference separation is documented.
- Governance is explicit rather than being an afterthought.

### 30% — Emission Calculation Accuracy

Evidence:
- Official UK Government 2026 conversion-factor source.
- Hard constraints: scope, unit, year and category/activity context.
- Exact factor provenance preserved.
- Deterministic calculator.
- No LLM arithmetic.
- Unknown/ambiguous factors fail closed.

### 20% — Auditability & Traceability

Evidence:
- Source record identifier retained.
- Factor ID, source, year and unit retained.
- Exact formula retained.
- kg CO2e and tCO2e retained.
- Governance decision retained.
- Final disclosure carries the complete lineage.

### 20% — Sustainability Dashboard UX

Evidence:
- Scope KPIs.
- Governance status.
- Factor verification.
- Evidence completeness.
- Greenwashing status.
- Deterministic audit trail.
- Formula and factor visibility.
- Actionable `REVIEW_REQUIRED` rather than silently presenting a number.

---

# Six engineering metrics

## 1. Hallucination Mitigation

Primary controls:
- no factor guessing
- no quantity invention
- no unsupported reduction claims
- deterministic calculation
- explicit unresolved states
- governance gate before disclosure

## 2. Groundedness

Every material field must originate from the activity record, Scope Classifier, Factor Lookup, Calculator or governance evidence. Agents are instructed not to substitute plausible values.

## 3. Retrieval Quality

Vector retrieval was intentionally tested and found unsafe as a numerical selector for broad activity terms. CarbonGuard therefore separates contextual retrieval from numerical verification.

This is stronger than hiding a weak retrieval result: the architecture explicitly constrains what retrieval is allowed to decide.

## 4. Costing & Token Optimization

Optimization priorities:
- narrow agent roles
- avoid repeated full workflow metadata
- pass only fields needed by each downstream decision
- use structured outputs where supported
- keep deterministic work outside the LLM
- disable unnecessary persistent memory for stateless execution only after regression testing

The current workflow's redundant upstream context is an identified optimization target; it should be reduced carefully after capturing a baseline.

## 5. Prompt Architecture

Prompts use defensive constraints:
- authoritative tool outputs
- exact field preservation
- fail-closed statuses
- explicit prohibited behaviors
- evidence completeness gates
- no self-calculation
- no unsupported claims

## 6. Latency Optimization

Measured end-to-end dashboard submissions averaged 16.8 seconds across three repeat runs in the current test environment.

The observed individual stage timings identified Factor Resolver as the slowest listed stage (~8 s), so optimization should target context/tool overhead around that stage without removing deterministic verification.

---

# Evaluation philosophy

CarbonGuard should be judged on **correct refusal**, not only successful happy-path output.

A strong result is:

`VERIFIED → CALCULATED → READY_FOR_DISCLOSURE → APPROVED`

A strong safety result is:

`AMBIGUOUS → REVIEW_REQUIRED`

`UNKNOWN FACTOR → FACTOR_NOT_FOUND`

`UNSUPPORTED CLAIM → UNSUPPORTED_CLAIM`

`MISSING EVIDENCE → REVIEW_REQUIRED`

This creates measurable separation between useful automation and unsafe greenwashing automation.
