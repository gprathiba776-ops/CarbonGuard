# CarbonGuard Data Model

CarbonGuard treats each emissions activity as an evidence-bearing record rather than a free-form text item.

## Core activity record

| Field | Purpose | Authority |
|---|---|---|
| record_id | Stable source identifier | Source system |
| activity | Activity description | Source / Intake |
| quantity | Activity quantity | Source / Intake |
| unit | Activity unit | Source / Intake |
| date | Activity/billing date | Source / Intake |
| location | Geography | Source / Intake |
| supplier | Supplier/context | Source |
| scope | Scope 1/2/3 classification | Scope Classifier |
| year | Factor/reporting year | Source / workflow |
| category | Official factor category component | Factor resolution context |
| fuel_subtype | Disambiguating subtype | Source / workflow |

## Factor evidence

A verified factor carries:

`factor_id + factor_value + factor_unit + scope + category_path + activity + year + source`

## Calculation evidence

A calculated result carries:

`quantity + factor_value + factor_unit + formula + kg_co2e + tco2e + calculation_status`

## Governance evidence

The final control decision carries:

`governance_status + evidence_status + greenwashing_status + reason`

## Disclosure evidence

The disclosure record must preserve the upstream identifiers and numerical evidence. A governance status alone is never sufficient for approval.

## Source of truth

- Activity facts: source records after normalization.
- Scope: Scope Classifier decision.
- Factor: deterministic Factor Lookup.
- Arithmetic: deterministic Calculator.
- Approval: Governance + Disclosure gates.

This separation prevents an LLM from becoming the hidden source of truth for numerical accounting.
