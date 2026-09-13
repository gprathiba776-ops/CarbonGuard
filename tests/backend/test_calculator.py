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

    def test_blocked_when_factor_not_found(self):
        result = calculate_emissions(
            quantity=2500,
            factor_value=2.66155,
            factor_unit="kg CO2e per litres",
            factor_status="FACTOR_NOT_FOUND",
        )
        self.assertEqual(result["status"], "BLOCKED")
        self.assertIsNone(result["kg_co2e"])
        self.assertIsNone(result["tco2e"])

    def test_zero_quantity_is_valid(self):
        result = calculate_emissions(
            quantity=0,
            factor_value=2.66155,
            factor_unit="kg CO2e per litres",
            factor_status="VERIFIED",
        )
        self.assertEqual(result["status"], "CALCULATED")
        self.assertEqual(result["kg_co2e"], 0)
        self.assertEqual(result["tco2e"], 0)

    def test_negative_factor_is_blocked(self):
        result = calculate_emissions(
            quantity=2500,
            factor_value=-2.66155,
            factor_unit="kg CO2e per litres",
            factor_status="VERIFIED",
        )
        self.assertEqual(result["status"], "BLOCKED")

    def test_non_numeric_quantity_is_blocked(self):
        result = calculate_emissions(
            quantity="2500",
            factor_value=2.66155,
            factor_unit="kg CO2e per litres",
            factor_status="VERIFIED",
        )
        self.assertEqual(result["status"], "BLOCKED")

    def test_non_numeric_factor_is_blocked(self):
        result = calculate_emissions(
            quantity=2500,
            factor_value="2.66155",
            factor_unit="kg CO2e per litres",
            factor_status="VERIFIED",
        )
        self.assertEqual(result["status"], "BLOCKED")

    def test_boolean_quantity_is_blocked(self):
        result = calculate_emissions(
            quantity=True,
            factor_value=2.66155,
            factor_unit="kg CO2e per litres",
            factor_status="VERIFIED",
        )
        self.assertEqual(result["status"], "BLOCKED)

    def test_infinite_quantity_is_blocked(self):
        result = calculate_emissions(
            quantity=float("inf"),
            factor_value=2.66155,
            factor_unit="kg CO2e per litres",
            factor_status="VERIFIED",
        )
        self.assertEqual(result["status"], "BLOCKED")

    def test_infinite_factor_is_blocked(self):
        result = calculate_emissions(
            quantity=2500,
            factor_value=float("inf"),
            factor_unit="kg CO2e per litres",
            factor_status="VERIFIED",
        )
        self.assertEqual(result["status"], "BLOCKED")

    def test_formula_preserves_exact_inputs(self):
        result = calculate_emissions(
            quantity=18500,
            factor_value=0.13096,
            factor_unit="kg CO2e per kWh",
            factor_status="VERIFIED",
        )
        self.assertEqual(result["formula"], "18500 × 0.13096")

    def test_factor_unit_is_preserved(self):
        result = calculate_emissions(
            quantity=2500,
            factor_value=2.66155,
            factor_unit="kg CO2e per litres",
            factor_status="VERIFIED",
        )
        self.assertEqual(
            result["factor_unit"],
            "kg CO2e per litres",
        )


if __name__ == "__main__":
    unittest.main()
