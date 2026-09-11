# Automated tests

These tests are intentionally deterministic and independent of LLM inference.

They verify the numerical safety boundary:

- exactly one compatible factor → `VERIFIED`
- multiple compatible factors → `REVIEW_REQUIRED`
- no compatible factor → `FACTOR_NOT_FOUND`
- calculation allowed only for `VERIFIED`
- invalid/negative numerical inputs → `BLOCKED`

Run:

```bash
make test-python
```
