# Automated test evidence

The repository now contains executable tests for the numerical safety boundary rather than relying only on narrative test results.

| Test | Expected | Covered by |
|---|---|---|
| Exact mineral diesel factor | `VERIFIED`, factor `2.66155` | `tests/backend/test_factor_lookup.py` |
| Ambiguous diesel | `REVIEW_REQUIRED` | `tests/backend/test_factor_lookup.py` |
| Unknown factor | `FACTOR_NOT_FOUND` | `tests/backend/test_factor_lookup.py` |
| Scope 2 UK electricity | `VERIFIED`, factor `0.13096` | `tests/backend/test_factor_lookup.py` |
| Verified diesel calculation | `6.653875 tCO2e` | `tests/backend/test_calculator.py` |
| Non-verified factor | `BLOCKED` | `tests/backend/test_calculator.py` |
| Negative quantity | `BLOCKED` | `tests/backend/test_calculator.py` |
| Scope 2 electricity calculation | `2.42276 tCO2e` | `tests/backend/test_calculator.py` |

The deterministic Python suite was executed locally during this repository pass: **8/8 tests passed**.

The frontend suite adds tests for governance-state mapping and explicitly verifies that incomplete live responses cannot be populated with demo emissions or factors. Frontend dependency installation was not available in the build environment used for this pass; CI runs the frontend suite on every push and pull request.
