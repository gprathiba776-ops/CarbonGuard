"""Deterministic emission-factor resolution for CarbonGuard.

The registry is derived from the July 2026 revised UK Government GHG
Conversion Factors flat-file representation. This module deliberately does
not use embeddings or LLM similarity for numerical factor selection.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from config import settings

REGISTRY_PATH = Path(settings.REGISTRY_PATH)
YEAR = settings.YEAR
SOURCE = settings.SOURCE


def _norm(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().lower())


def load_registry() -> list[dict[str, Any]]:
    with REGISTRY_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)


REGISTRY = load_registry()


def _leaf(record: dict[str, Any]) -> str:
    path = record.get("category_path") or []
    if not path:
        return ""
    unit = _norm(record.get("unit"))
    last = _norm(path[-1])
    if last == "unknown" or last == unit:
        return str(path[-2]) if len(path) >= 2 else ""
    return str(path[-1])


def _category_components(record: dict[str, Any]) -> set[str]:
    return {_norm(x) for x in (record.get("category_path") or []) if x and _norm(x) != "unknown"}


def _activity_matches(record: dict[str, Any], activity: str) -> bool:
    q = _norm(activity)
    if not q:
        return True
    explicit = _norm(record.get("activity"))
    leaf = _norm(_leaf(record))
    # The flat file often represents the activity as UNKNOWN while the
    # category leaf is the official activity name.
    return q == explicit or q == leaf or (q and q in leaf)


def _subtype_matches(record: dict[str, Any], subtype: str) -> bool:
    q = _norm(subtype)
    if not q:
        return True
    leaf = _norm(_leaf(record))
    aliases = {
        "diesel": "diesel (100% mineral diesel)",
        "mineral diesel": "diesel (100% mineral diesel)",
        "100% mineral diesel": "diesel (100% mineral diesel)",
    }
    return leaf == aliases.get(q, q)


def lookup_factor(*, scope: str, activity: str, unit: str, year: int,
                  category: str | None = None, fuel_subtype: str | None = None) -> dict[str, Any]:
    """Return VERIFIED, REVIEW_REQUIRED, or FACTOR_NOT_FOUND deterministically."""
    if year != YEAR:
        return {"status": "FACTOR_NOT_FOUND", "reason": f"No {YEAR} factor registry is configured for year {year}.", "matches": []}

    candidates = [
        r for r in REGISTRY
        if r.get("factor") is not None
        and _norm(r.get("scope")) == _norm(scope)
        and _norm(r.get("unit")) == _norm(unit)
        and r.get("year") == year
    ]

    if category:
        cat = _norm(category)
        candidates = [r for r in candidates if cat in _category_components(r)]

    if activity:
        candidates = [r for r in candidates if _activity_matches(r, activity)]

    if fuel_subtype:
        candidates = [r for r in candidates if _subtype_matches(r, fuel_subtype)]

    if len(candidates) == 1:
        match = candidates[0]
        return {
            "status": "VERIFIED",
            "reason": "Exactly one factor satisfies all supplied deterministic constraints.",
            "match": match,
            "matches": [match],
        }

    if len(candidates) > 1:
        return {
            "status": "REVIEW_REQUIRED",
            "reason": "Multiple official factors satisfy the supplied constraints; additional context is required.",
            "matches": candidates,
        }

    return {
        "status": "FACTOR_NOT_FOUND",
        "reason": "No official factor satisfies all supplied deterministic constraints.",
        "matches": [],
    }
