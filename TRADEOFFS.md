# Deliberate Tradeoffs

## 1. No autonomous factor guessing

We sacrifice completion rate on ambiguous records to preserve accounting correctness.

## 2. No semantic retrieval as the final numerical selector

We sacrifice a seemingly simpler RAG-only architecture because similarity does not guarantee unit/scope compatibility.

## 3. No frontend calculation

We sacrifice instant client-side arithmetic in exchange for one authoritative calculation path that can be audited and governed.

## 4. No unsupported compliance claims

The product deliberately uses language such as “aligned” rather than asserting formal certification/compliance unless independently substantiated.
