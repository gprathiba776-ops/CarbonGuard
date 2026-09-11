# Architecture Decisions

## 1. Deterministic factor lookup over semantic similarity

**Decision:** Use hard constraints for numerical factor selection.

**Why:** Semantic retrieval can return a related activity with the wrong scope or unit. Carbon accounting requires compatibility, not merely relevance.

## 2. Deterministic arithmetic

**Decision:** The LLM may request calculation but may not perform authoritative arithmetic.

**Why:** This creates a reproducible numerical boundary and makes the formula auditable.

## 3. Fail closed

**Decision:** Ambiguous or missing evidence becomes an explicit review/block state.

**Why:** In compliance workflows, a missing number is safer than a fabricated number.

## 4. Five narrow agents

**Decision:** Separate intake, scope, factor resolution, governance and disclosure.

**Why:** Narrow responsibilities reduce prompt ambiguity and make traces easier to audit.

## 5. Retrieval remains contextual

**Decision:** Keep the Knowledge Base/Qdrant layer for context/provenance rather than forcing it to select authoritative factors.

**Why:** This preserves retrieval value without granting semantic similarity numerical authority.

## 6. Thin dashboard

**Decision:** The frontend visualizes and submits evidence; it does not calculate emissions.

**Why:** Calculation logic belongs behind the controlled inference/tool boundary.
