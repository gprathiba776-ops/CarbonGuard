import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).parents[2] / "backend" / "calculator-api"))
from calculator import calculate_emissions


class CalculatorTests(unittest.TestCase):
    def test_verified_diesel_calculation(self):
        result = calculate_emissions(
            quantity=2500, factor_value=2.66155,
            factor_unit="kg CO2e per litres", factor_status="VERIFIED"
        )
        self.assertEqual(result["status"], "CALCULATED")
        self.assertAlmostEqual(result["kg_co2e"], 6653.875, places=9)
        self.assertAlmostEqual(result["tco2e"], 6.653875, places=9)
        self.assertEqual(result["formula"], "2500 × 2.66155")

    def test_blocked_when_factor_not_verified(self):
        result = calculate_emissions(
            quantity=2500, factor_value=2.66155,
            factor_unit="kg CO2e per litres", factor_status="REVIEW_REQUIRED"
        )
        self.assertEqual(result["status"], "BLOCKED")
        self.assertIsNone(result["kg_co2e"])
        self.assertIsNone(result["tco2e"])

    def test_blocked_for_negative_quantity(self):
        result = calculate_emissions(
            quantity=-1, factor_value=2.66155,
            factor_unit="kg CO2e per litres", factor_status="VERIFIED"
        )
        self.assertEqual(result["status"], "BLOCKED")

    def test_scope_2_electricity_calculation(self):
        result = calculate_emissions(
            quantity=18500, factor_value=0.13096,
            factor_unit="kg CO2e per kWh", factor_status="VERIFIED"
        )
        self.assertEqual(result["status"], "CALCULATED")
        self.assertAlmostEqual(result["kg_co2e"], 2422.76, places=9)
        self.assertAlmostEqual(result["tco2e"], 2.42276, places=9)


if __name__ == "__main__":
    unittest.main()
