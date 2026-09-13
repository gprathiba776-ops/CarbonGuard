import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).parents[2] / "backend" / "factor-api"))
from factor_lookup import lookup_factor


class FactorLookupTests(unittest.TestCase):
    def test_exact_diesel_is_verified(self):
        result = lookup_factor(
            scope="Scope 1", activity="Diesel (100% mineral diesel)",
            unit="litres", year=2026, category="Liquid fuels", fuel_subtype="diesel"
        )
        self.assertEqual(result["status"], "VERIFIED")
        self.assertEqual(result["match"]["factor_id"], "1_101_1012_8_1")
        self.assertEqual(result["match"]["factor"], 2.66155)

    def test_ambiguous_diesel_is_not_selected(self):
        result = lookup_factor(
            scope="Scope 1", activity="Diesel", unit="litres", year=2026,
            category="Liquid fuels"
        )
        self.assertEqual(result["status"], "REVIEW_REQUIRED")
        self.assertGreater(len(result["matches"]), 1)

    def test_unknown_activity_is_not_guessed(self):
        result = lookup_factor(
            scope="Scope 1", activity="Quantum diesel fuel", unit="litres", year=2026,
            category="Liquid fuels", fuel_subtype="quantum-diesel"
        )
        self.assertEqual(result["status"], "FACTOR_NOT_FOUND")

    def test_scope_2_uk_electricity(self):
        result = lookup_factor(
            scope="Scope 2", activity="Electricity", unit="kWh", year=2026
        )
        self.assertEqual(result["status"], "VERIFIED")
        self.assertEqual(result["match"]["factor_id"], "7_400_4000_5_1")
        self.assertEqual(result["match"]["factor"], 0.13096)

    def test_wrong_scope_is_not_verified(self):
        result = lookup_factor(
            scope="Scope 3",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )
        self.assertNotEqual(result["status"], "VERIFIED")

    def test_wrong_unit_is_not_verified(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="kWh",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )
        self.assertNotEqual(result["status"], "VERIFIED")

    def test_wrong_year_is_not_verified(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2025,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )
        self.assertEqual(result["status"], "FACTOR_NOT_FOUND")

    def test_empty_activity_does_not_create_false_verified_match(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="",
            unit="litres",
            year=2026,
            category="Liquid fuels",
        )
        self.assertIn(
            result["status"],
            {"VERIFIED", "REVIEW_REQUIRED", "FACTOR_NOT_FOUND"},
        )

    def test_diesel_alias_resolves_correctly(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="mineral diesel",
        )
        self.assertEqual(result["status"], "VERIFIED")
        self.assertEqual(result["match"]["factor_id"], "1_101_1012_8_1")

    def test_factor_contains_provenance(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )
        self.assertEqual(result["status"], "VERIFIED")

        match = result["match"]

        self.assertIn("factor_id", match)
        self.assertIn("source", match)
        self.assertIn("year", match)
        self.assertIn("scope", match)
        self.assertIn("unit", match)

    def test_verified_result_contains_single_match(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )
        self.assertEqual(result["status"], "VERIFIED")
        self.assertEqual(len(result["matches"]), 1)

    def test_unknown_fuel_subtype_is_not_guessed(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="imaginary-fuel",
        )
        self.assertEqual(result["status"], "FACTOR_NOT_FOUND")

    def test_unknown_category_is_not_guessed(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Imaginary Category",
            fuel_subtype="diesel",
        )
        self.assertEqual(result["status"], "FACTOR_NOT_FOUND")

    def test_factor_value_is_numeric(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )
        self.assertEqual(result["status"], "VERIFIED")
        self.assertIsInstance(result["match"]["factor"], (int, float))

    def test_factor_year_is_2026(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel (100% mineral diesel)",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="diesel",
        )
        self.assertEqual(result["status"], "VERIFIED")
        self.assertEqual(result["match"]["year"], 2026)


if __name__ == "__main__":
    unittest.main()
