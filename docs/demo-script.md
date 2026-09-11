# 3-Minute Judge Demo

## 1. Start with the problem

“Carbon accounting does not fail only because data is missing. It fails when a system confidently fills gaps with the wrong factor, wrong unit or unsupported claim.”

## 2. Show the architecture

“CarbonGuard separates Lyzr reasoning from deterministic numerical authority. Five specialized Lyzr agents orchestrate the compliance workflow; two backend tools control factor verification and arithmetic.”

## 3. Happy path

Submit a 2500-litre verified diesel record.

Show:
- Scope 1
- factor 2.66155 kg CO2e/litre
- formula 2500 × 2.66155
- 6.653875 tCO2e
- factor ID/source/year
- READY_FOR_DISCLOSURE
- APPROVED

## 4. Break it deliberately

Remove the diesel subtype so the deterministic lookup cannot select one unique factor.

Expected result: `REVIEW_REQUIRED`.

Say: “This is the feature. CarbonGuard refuses to guess.”

## 5. Greenwashing attack

Submit a 40% reduction claim where verified data supports only 17.8%.

Expected result: `UNSUPPORTED_CLAIM`.

## 6. Finish on auditability

Trace the number backward:

Source → Activity → Scope → Factor → Formula → Result → Governance → Disclosure.

Closing line:

“CarbonGuard does not just automate carbon reporting. It automates the evidence and refusal logic required to make carbon reporting defensible.”
