"""Pure deterministic emissions calculation logic."""
from __future__ import annotations

import math
from typing import Any


def calculate_emissions(*, quantity: Any, factor_value: Any, factor_unit: Any, factor_status: Any) -> dict[str, Any]:
    if factor_status != "VERIFIED":
        return {"status": "BLOCKED", "kg_co2e": None, "tco2e": None, "formula": None, "factor_unit": factor_unit}

    if not isinstance(quantity, (int, float)) or isinstance(quantity, bool):
        return {"status": "BLOCKED", "kg_co2e": None, "tco2e": None, "formula": None, "factor_unit": factor_unit}
    if not isinstance(factor_value, (int, float)) or isinstance(factor_value, bool):
        return {"status": "BLOCKED", "kg_co2e": None, "tco2e": None, "formula": None, "factor_unit": factor_unit}
    if not math.isfinite(quantity) or not math.isfinite(factor_value) or quantity < 0 or factor_value < 0:
        return {"status": "BLOCKED", "kg_co2e": None, "tco2e": None, "formula": None, "factor_unit": factor_unit}

    kg = quantity * factor_value
    return {
        "status": "CALCULATED",
        "kg_co2e": kg,
        "tco2e": kg / 1000,
        "formula": f"{quantity} × {factor_value}",
        "factor_unit": factor_unit,
    }
