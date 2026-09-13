import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).parents[2]

sys.path.insert(0, str(ROOT / "backend" / "factor-api"))
sys.path.insert(0, str(ROOT / "backend" / "calculator-api"))

from factor_lookup import lookup_factor
from calculator import calculate_emissions


class PipelineContractTests(unittest.TestCase):

    def resolve_and_calculate(self, **lookup_input):
        """
        Test-only representation of the CarbonGuard deterministic handoff.

        The calculator receives data only when Factor Lookup returns VERIFIED.
        No factor is guessed and no arithmetic is performed here.
        """
        factor_result = lookup_factor(**lookup_input)

        if factor_result["status"] != "VERIFIED":
            return {
                "factor_result": factor_result,
                "calculation_result": None,
            }

        match = factor_result["match"]

        calculation_result = calculate_emissions(
            quantity=lookup_input["quantity"],
            factor_value=match["factor"],
            factor_unit=match["unit"],
            factor_status=factor_result["status"],
        )

        return {
            "factor_result": factor_result,
            "calculation_result": calculation_result,
        }

    def test_verified_factor_flows_to_calculator(self):
        lookup_input = {
            "scope": "Scope 1",
            "activity": "Diesel (100% mineral diesel)",
            "unit": "litres",
            "year": 2026,
            "category": "Liquid fuels",
            "fuel_subtype": "diesel",
            "quantity": 2500,
        }

        result = self.resolve_and_calculate(
            scope=lookup_input["scope"],
            activity=lookup_input["activity"],
            unit=lookup_input["unit"],
            year=lookup_input["year"],
            category=lookup_input["category"],
            fuel_subtype=lookup_input["fuel_subtype"],
        )

        factor_result = result["factor_result"]

        calculation_result = calculate_emissions(
            quantity=lookup_input["quantity"],
            factor_value=factor_result["match"]["factor"],
            factor_unit=factor_result["match"]["unit"],
            factor_status=factor_result["status"],
        )

        self.assertEqual(factor_result["status"], "VERIFIED")
        self.assertEqual(calculation_result["status"], "CALCULATED")
        self.assertEqual(calculation_result["kg_co2e"], 6653.875)
        self.assertEqual(calculation_result["tco2e"], 6.653875)

    def test_ambiguous_factor_never_reaches_calculator(self):
        factor_result = lookup_factor(
            scope="Scope 1",
            activity="Diesel",
            unit="litres",
            year=2026,
            category="Liquid fuels",
        )

        self.assertEqual(factor_result["status"], "REVIEW_REQUIRED")

        self.assertNotIn("match", factor_result)

    def test_unknown_factor_never_reaches_calculator(self):
        factor_result = lookup_factor(
            scope="Scope 1",
            activity="Quantum diesel fuel",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="quantum-diesel",
        )

        self.assertEqual(factor_result["status"], "FACTOR_NOT_FOUND")

        self.assertNotIn("match", factor_result)

    def test_review_required_blocks_calculator(self):
        calculation_result = calculate_emissions(
            quantity=2500,
            factor_value=None,
            factor_unit=None,
            factor_status="REVIEW_REQUIRED",
        )

        self.assertEqual(calculation_result["status"], "BLOCKED")
        self.assertIsNone(calculation_result["kg_co2e"])
        self.assertIsNone(calculation_result["tco2e"])

    def test_factor_not_found_blocks_calculator(self):
        calculation_result = calculate_emissions(
            quantity=2500,
            factor_value=None,
            factor_unit=None,
            factor_status="FACTOR_NOT_FOUND",
        )

        self.assertEqual(calculation_result["status"], "BLOCKED")
        self.assertIsNone(calculation_result["formula"])

    def test_exact_factor_is_preserved_during_handoff(self):
        factor_result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )

        self.assertEqual(factor_result["status"], "VERIFIED")

        match = factor_result["match"]

        calculation_result = calculate_emissions(
            quantity=2500,
            factor_value=match["factor"],
            factor_unit=match["unit"],
            factor_status=factor_result["status"],
        )

        self.assertEqual(match["factor"], 2.66155)
        self.assertEqual(calculation_result["factor_unit"], match["unit"])
        self.assertEqual(calculation_result["formula"], "2500 × 2.66155")

    def test_factor_provenance_survives_before_calculation(self):
        factor_result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )

        self.assertEqual(factor_result["status"], "VERIFIED")

        match = factor_result["match"]

        self.assertIn("factor_id", match)
        self.assertIn("source", match)
        self.assertIn("year", match)
        self.assertIn("scope", match)
        self.assertIn("unit", match)

        self.assertEqual(match["year"], 2026)
        self.assertEqual(match["scope"], "Scope 1")


if __name__ == "__main__":
    unittest.main()
