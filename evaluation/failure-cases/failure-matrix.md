# Failure Matrix

| Failure | Safe state | Calculation allowed? | Disclosure allowed? |
|---|---|---:|---:|
| Missing quantity | UNKNOWN | No | No |
| Ambiguous factor | REVIEW_REQUIRED | No | No |
| No factor | FACTOR_NOT_FOUND | No | No |
| Missing audit evidence | REVIEW_REQUIRED | Already-calculated evidence may be reviewed, but no approval | No |
| Unsupported reduction claim | UNSUPPORTED_CLAIM | N/A | No |
| Blocked upstream | BLOCKED | No | No |
