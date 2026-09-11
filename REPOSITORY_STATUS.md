# Repository status

## Dr Agent remediation pass

The first review identified an implementation-depth gap: documentation was substantially stronger than executable code, especially testing and DevOps.

This pass addresses that gap without changing the CarbonGuard agent architecture:

- actual React/TypeScript dashboard source is included under `frontend/`
- deterministic factor registry and lookup implementation are included under `backend/factor-api/`
- deterministic calculator is separated into a pure calculation module plus Flask API
- Python unit tests cover verified, ambiguous, unknown-factor, blocked, negative-input, and Scope 2 cases
- frontend unit tests cover governance failure mapping and prevention of demo-data substitution for incomplete live results
- GitHub Actions CI runs Python tests, frontend typecheck, frontend build, and frontend unit tests
- Dockerfiles are provided for the frontend and both backend services
- webhook/API secrets are externalized; no real webhook secret is committed

## Validation completed locally

- Python unit tests: **8/8 passed**
- Python compile check: passed
- JSON validation: passed
- factor registry record count: **3,425**
- exposed webhook secret scan: exact previously exposed secret not found

Frontend dependency installation was not completed in this environment, so the Vitest suite is included for CI execution but is not represented as locally executed evidence.
