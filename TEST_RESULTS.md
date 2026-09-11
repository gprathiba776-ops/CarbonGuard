# CarbonGuard AI — Test Results

These are observed project tests, not synthetic performance claims.

## Functional tests

| Test | Expected behavior | Observed |
|---|---|---|
| Scope 1 diesel, exact subtype | VERIFIED + deterministic calculation | PASS |
| Scope 2 electricity | VERIFIED + deterministic calculation | PASS |
| Ambiguous diesel | REVIEW_REQUIRED, no calculation | PASS |
| Unknown factor | FACTOR_NOT_FOUND / review path, no fabricated factor | PASS |
| Missing quantity | UNKNOWN | PASS |
| Missing factor ID/source | Disclosure not approved | PASS |
| Unsupported reduction claim | UNSUPPORTED_CLAIM | PASS |
| Repeat identical Scope 2 input 3× | Stable result | PASS |

## Verified diesel case

`2500 litres × 2.66155 kg CO2e/litre = 6653.875 kg CO2e = 6.653875 tCO2e`

Factor ID: `1_101_1012_8_1`

## Verified electricity case

`18500 kWh × 0.13096 kg CO2e/kWh = 2422.76 kg CO2e = 2.42276 tCO2e`

## Greenwashing adversarial test

Baseline: 100 tCO2e  
Current: 82.2 tCO2e  
Claimed reduction: 40%  
Supported reduction: 17.8%

Result: unsupported claim correctly rejected rather than accepted.

## Repeatability / latency

Three identical end-to-end dashboard submissions measured:

- 18.3 s
- 16.8 s
- 15.3 s

Average: **16.8 s**

Listed individual stage timings during profiling were approximately:

- Intake: 6 s
- Scope: 5 s
- Factor: 8 s
- Governance: 5 s
- Disclosure: 5 s

These stage values should not be summed blindly because runtime traces may overlap/round differently from wall-clock measurements.

## Known issue tracked

An adversarial Factor Resolver test exposed a lineage-preservation edge case where an unresolved input could be returned with altered `record_id`/activity text. This is documented rather than hidden because auditability requires preserving original identifiers exactly.
