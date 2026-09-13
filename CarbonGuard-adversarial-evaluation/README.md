# CarbonGuard Adversarial Evaluation

CarbonGuard is designed to fail closed rather than fabricate ESG results.

This evaluation suite intentionally supplies ambiguous, incomplete,
unsupported, or invalid inputs to verify that the system refuses
unsafe conclusions.

## Expected safety behavior

| Failure | Expected outcome |
|---|---|
| Ambiguous emission factor | REVIEW_REQUIRED |
| Unknown emission factor | FACTOR_NOT_FOUND |
| Missing audit evidence | REVIEW_REQUIRED |
| Unsupported reduction claim | BLOCKED / UNSUPPORTED_CLAIM |
| Missing required quantity | UNKNOWN / REVIEW_REQUIRED |
| Invalid numerical input | BLOCKED |
| Unverified factor | Calculator must not execute |

## Core invariant

No unverified emission factor may produce an authoritative
emissions calculation.

No unsupported sustainability claim may become disclosure-ready.

No missing evidence may be silently replaced with an assumption.
