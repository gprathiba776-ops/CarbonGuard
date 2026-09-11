# CarbonGuard deterministic Factor API

This service is the numerical authority for emission-factor selection. It uses a local JSON registry derived from the July 2026 revised UK Government GHG Conversion Factors flat-file representation used by CarbonGuard.

The upstream official source remains GOV.UK:
https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026

## Deterministic policy

Hard constraints are applied for year, scope, and unit. Category, activity, and fuel subtype narrow the candidate set. Exactly one compatible factor produces `VERIFIED`; multiple compatible factors produce `REVIEW_REQUIRED`; zero compatible factors produce `FACTOR_NOT_FOUND`.

No embeddings, LLM similarity, estimation, or arithmetic are used to select a numerical factor.

## Run

```bash
pip install -r requirements.txt
flask --app app run --port 8000
```

## Example

`Scope 1 + Diesel (100% mineral diesel) + litres + 2026 + Liquid fuels + diesel` resolves to factor `1_101_1012_8_1` at `2.66155 kg CO2e/litres`.
