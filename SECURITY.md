# Security & Governance

## Secrets

Never commit API keys, webhook secrets, database credentials, supplier credentials or private source documents.

The repository's SuperFlow export is sanitized. The live webhook secret must be regenerated if the previous secret was exposed during development.

## Data minimization

Pass only the fields required for the downstream decision. Avoid forwarding supplier pricing, unnecessary ERP columns or unrelated document contents.

## Fail-closed behavior

CarbonGuard does not convert uncertainty into certainty. Missing or ambiguous evidence becomes an explicit review/block state.

## PII / sensitive commercial data

Supplier names, pricing and ERP details should be treated as sensitive business data. Production deployments should minimize exposure and use appropriate access controls.

## Governance

Application-level governance states are designed to complement Lyzr governance/evaluation/monitoring capabilities. Only controls actually enabled in the deployed Lyzr environment should be represented as active controls in a final submission.
