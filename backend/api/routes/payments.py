from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

payments_bp = Blueprint("payments", __name__)

FLUTTERWAVE_SECRET_KEY = os.getenv("FLUTTERWAVE_SECRET_KEY")
FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3"

# In-memory storage
payments = []

@payments_bp.route("/", methods=["POST"])
def create_payment():
    """
    Initialize a payment with Flutterwave
    """
    data = request.get_json() or {}
    method = data.get("method")
    amount = data.get("amount")
    currency = "MWK"  # Malawi Kwacha

    if not method or not amount:
        return jsonify({"error": "Missing payment method or amount"}), 400

    payment_payload = {
        "tx_ref": f"TX-{os.urandom(6).hex()}",
        "amount": amount,
        "currency": currency,
        "payment_type": "mobilemoney" if method == "mobile" else "account",
        "redirect_url": "https://yourfrontend.com/payment-success",  # optional
        "customer": {
            "name": data.get("name", "Customer"),
            "email": data.get("email", "customer@example.com"),
            "phone_number": data.get("mobile_number") or "",
        },
        "meta": {
            "method": method,
            "bank": data.get("bank"),
            "account_number": data.get("account_number"),
            "mobile_provider": data.get("mobile_provider"),
            "country_code": data.get("country_code")
        }
    }

    headers = {
        "Authorization": f"Bearer {FLUTTERWAVE_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    try:
        r = requests.post(f"{FLUTTERWAVE_BASE_URL}/payments", json=payment_payload, headers=headers)
        resp = r.json()
        if resp.get("status") == "success":
            payments.append({
                "id": resp["data"]["id"],
                "tx_ref": payment_payload["tx_ref"],
                "method": method,
                "amount": amount,
                "status": "pending"
            })
            return jsonify({"payment_link": resp["data"]["link"], "tx_ref": payment_payload["tx_ref"]})
        else:
            return jsonify({"error": resp.get("message")}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.route("/verify/<tx_ref>", methods=["GET"])
def verify_payment(tx_ref):
    """
    Verify payment status by tx_ref
    """
    headers = {
        "Authorization": f"Bearer {FLUTTERWAVE_SECRET_KEY}"
    }
    try:
        r = requests.get(f"{FLUTTERWAVE_BASE_URL}/transactions/verify_by_reference?tx_ref={tx_ref}", headers=headers)
        resp = r.json()
        if resp.get("status") == "success" and resp.get("data", {}).get("status") == "successful":
            # Update local record
            for p in payments:
                if p["tx_ref"] == tx_ref:
                    p["status"] = "completed"
            return jsonify({"status": "completed", "payment": resp["data"]})
        else:
            return jsonify({"status": "pending", "data": resp.get("data")})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
