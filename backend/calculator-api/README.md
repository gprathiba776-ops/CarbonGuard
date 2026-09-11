# CarbonGuard deterministic Calculator API

Pure deterministic calculation service. It refuses to calculate unless the upstream factor status is exactly `VERIFIED`.

For a verified factor:

`kg CO2e = quantity × factor`

`tCO2e = kg CO2e / 1000`

No LLM arithmetic is performed.
