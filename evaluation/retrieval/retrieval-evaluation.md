# Retrieval Evaluation

## Finding

Semantic retrieval over the emission-factor corpus was tested with broad activity queries. Queries such as “diesel” retrieved incompatible records including different units/scopes and other fuel categories.

## Risk

A similarity-ranked result can be semantically related while still being numerically incompatible.

## Architecture response

CarbonGuard therefore uses retrieval for contextual evidence/provenance and deterministic hard constraints for numerical factor selection.

The factor resolver requires exact compatibility across supplied constraints. If one factor cannot be uniquely verified, the pipeline refuses to calculate.

## Evaluation conclusion

This is a deliberate retrieval-quality control: the system does not confuse semantic relevance with accounting correctness.
