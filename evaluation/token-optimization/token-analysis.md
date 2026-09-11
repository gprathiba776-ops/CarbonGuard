# Token Optimization

Current SuperFlow prompts carry repeated upstream fields and runtime metadata. This is an identified optimization opportunity.

Optimization rule:

**Pass the smallest evidence package that preserves auditability.**

Do not remove provenance fields merely to save tokens. Reduce duplication while retaining the canonical evidence chain.
