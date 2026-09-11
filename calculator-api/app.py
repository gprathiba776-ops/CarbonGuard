from flask import Flask, jsonify, request

from calculator import calculate_emissions

app = Flask(__name__)


@app.post("/calculate")
def calculate():
    data = request.get_json(silent=True) or {}
    result = calculate_emissions(
        quantity=data.get("quantity"),
        factor_value=data.get("factor_value"),
        factor_unit=data.get("factor_unit"),
        factor_status=data.get("factor_status"),
    )
    return jsonify(result), 200


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "carbonguard-calculator-api"})
