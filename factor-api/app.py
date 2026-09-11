from flask import Flask, jsonify, request

from factor_lookup import lookup_factor

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "carbonguard-factor-api", "year": 2026})


@app.post("/lookup-factor")
def lookup():
    data = request.get_json(silent=True) or {}
    required = ["scope", "activity", "unit", "year"]
    missing = [key for key in required if data.get(key) in (None, "")]
    if missing:
        return jsonify({"status": "FACTOR_NOT_FOUND", "reason": f"Missing required fields: {', '.join(missing)}", "matches": []}), 400

    try:
        result = lookup_factor(
            scope=str(data["scope"]),
            activity=str(data["activity"]),
            unit=str(data["unit"]),
            year=int(data["year"]),
            category=data.get("category"),
            fuel_subtype=data.get("fuel_subtype") or data.get("subtype"),
        )
    except (TypeError, ValueError) as exc:
        return jsonify({"status": "FACTOR_NOT_FOUND", "reason": f"Invalid request: {exc}", "matches": []}), 400

    return jsonify(result), 200
