import unittest

from factor_lookup import lookup_factor
from calculator import calculate_emissions


class TestSafetyInvariants(unittest.TestCase):

    def test_ambiguous_factor_cannot_be_calculated(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Diesel",
            unit="litres",
            year=2026,
            category="Liquid fuels",
        )

        self.assertEqual(result["status"], "REVIEW_REQUIRED")

        calculation = calculate_emissions(
            quantity=2500,
            factor_value=2.66155,
            factor_unit="kg CO2e per litres",
            factor_status=result["status"],
        )

        self.assertEqual(calculation["status"], "BLOCKED")
        self.assertIsNone(calculation["kg_co2e"])
        self.assertIsNone(calculation["tco2e"])

    def test_unknown_factor_cannot_be_calculated(self):
        result = lookup_factor(
            scope="Scope 1",
            activity="Quantum diesel fuel",
            unit="litres",
            year=2026,
            category="Liquid fuels",
            fuel_subtype="quantum-diesel",
        )

        self.assertEqual(result["status"], "FACTOR_NOT_FOUND")

        calculation = calculate_emissions(
            quantity=2500,
            factor_value=999999,
            factor_unit="kg CO2e per litres",
            factor_status=result["status"],
        )

        self.assertEqual(calculation["status"], "BLOCKED")
        self.assertIsNone(calculation["kg_co2e"])
        self.assertIsNone(calculation["tco2e"])

    def test_all_unverified_statuses_block_calculation(self):
        for status in [
            "REVIEW_REQUIRED",
            "FACTOR_NOT_FOUND",
            "BLOCKED",
        ]:
            with self.subTest(status=status):
                result = calculate_emissions(
                    quantity=2500,
                    factor_value=2.66155,
                    factor_unit="kg CO2e per litres",
                    factor_status=status,
                )

                self.assertEqual(result["status"], "BLOCKED")
                self.assertIsNone(result["kg_co2e"])
                self.assertIsNone(result["tco2e"])


if __name__ == "__main__":
    unittest.main()
