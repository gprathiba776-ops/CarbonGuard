# Repository execution map

```text
Lyzr Agent Studio
      |
      v
5 governed agents + SuperFlow
      |
      +----> Factor Resolver ----> deterministic Factor Lookup API
      |                                  |
      |                                  v
      |                           VERIFIED / REVIEW_REQUIRED / FACTOR_NOT_FOUND
      |
      +----> deterministic Calculator API
      |
      v
Governance + Disclosure
      |
      v
React/TypeScript Dashboard
```

The browser is presentation/integration code. Numerical factor selection and arithmetic remain server-side deterministic boundaries.
