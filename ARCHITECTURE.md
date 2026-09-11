# CarbonGuard AI — Architecture

## 1. System objective

CarbonGuard is an autonomous ESG and carbon-accounting compliance copilot. The architecture separates probabilistic reasoning from numerical authority.

## 2. Runtime flow

```text
                    ┌─────────────────────────────┐
                    │ Sustainability Dashboard    │
                    └──────────────┬──────────────┘
                                   │ webhook
                                   ▼
                    ┌─────────────────────────────┐
                    │ Lyzr SuperFlow / Inference  │
                    └──────────────┬──────────────┘
                                   ▼
                         ┌───────────────────┐
                         │  Intake Agent     │
                         └─────────┬─────────┘
                                   ▼
                         ┌───────────────────┐
                         │ Scope Classifier  │
                         └─────────┬─────────┘
                                   ▼
                         ┌───────────────────┐
                         │ Factor Resolver   │──────┐
                         └─────────┬─────────┘      │ OpenAPI
                                   │                ▼
                                   │       ┌───────────────────┐
                                   │       │ Deterministic     │
                                   │       │ Factor Lookup API │
                                   │       └─────────┬─────────┘
                                   │                 │ VERIFIED
                                   │                 ▼
                                   │       ┌───────────────────┐
                                   └──────▶│ Deterministic     │
                                           │ Calculator API    │
                                           └─────────┬─────────┘
                                                     ▼
                         ┌───────────────────┐
                         │ Governance Agent  │
                         └─────────┬─────────┘
                                   ▼
                         ┌───────────────────┐
                         │ Disclosure Agent  │
                         └─────────┬─────────┘
                                   ▼
                    ┌─────────────────────────────┐
                    │ Audit-ready dashboard result│
                    └─────────────────────────────┘
```

## 3. Control boundaries

### Environment
Credentials, factor datasets, API endpoints and deployment configuration.

### Agent
Lyzr Agent Studio definitions, roles, instructions, schemas, tool permissions and governance behavior.

### Inference
Lyzr Agent API/SuperFlow execution, webhook input, agent handoffs and tool invocation.

### Numerical authority
Deterministic backend services. No LLM-generated factor or arithmetic is accepted as authoritative.

### Governance
Lyzr governance/evaluation/monitoring controls plus explicit application-level fail-closed states.

## 4. Why five agents

The agents are deliberately narrow. This reduces prompt ambiguity and makes evaluation traces interpretable.

- Intake owns extraction.
- Scope owns classification.
- Factor Resolver owns factor verification and tool sequencing.
- Governance owns evidence/compliance decisions.
- Disclosure owns presentation of already-approved evidence.

## 5. Failure propagation

A failure must propagate forward rather than being hidden:

```text
FACTOR_NOT_FOUND ──────────────┐
REVIEW_REQUIRED ───────────────┼──► Governance ─► Disclosure REVIEW_REQUIRED
BLOCKED ──────────────────────┘
```

An unresolved factor cannot reach an `APPROVED` disclosure.

## 6. Audit lineage

Each material output should be traceable through the same canonical chain:

`source → activity → scope → factor → formula → result → governance → disclosure`

This makes the final carbon figure explainable to an auditor instead of merely plausible to a user.
