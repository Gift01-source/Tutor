from flask import Blueprint, request, jsonify
import json, os, uuid
from datetime import datetime

messages_bp = Blueprint("messages", __name__, url_prefix="/api/messages")

MESSAGES_FILE = os.path.join(os.path.dirname(__file__), "..", "messages.json")


# ---------------------- Helpers ----------------------
def load_messages():
    if not os.path.exists(MESSAGES_FILE):
        return []
    try:
        with open(MESSAGES_FILE, "r") as f:
            data = f.read().strip()
            if not data:
                return []
            return json.loads(data)
    except json.JSONDecodeError:
        return []


def save_messages(messages):
    with open(MESSAGES_FILE, "w") as f:
        json.dump(messages, f, indent=4)


# ---------------------- GET: Messages for a Tutor ----------------------
@messages_bp.route("/<tutor_id>", methods=["GET"])
def get_messages(tutor_id):
    all_messages = load_messages()
    tutor_messages = [m for m in all_messages if m["tutor_id"] == tutor_id]
    # Sort by timestamp ascending
    tutor_messages.sort(key=lambda x: x["timestamp"])
    return jsonify({"messages": tutor_messages})


# ---------------------- POST: Send Message ----------------------
@messages_bp.route("/<tutor_id>", methods=["POST"])
def send_message(tutor_id):
    data = request.get_json() or {}
    sender = data.get("sender", "").strip()
    message_text = data.get("message", "").strip()
    if not sender or not message_text:
        return jsonify({"error": "Sender and message are required"}), 400

    new_message = {
        "id": str(uuid.uuid4()),
        "tutor_id": tutor_id,
        "sender": sender,
        "message": message_text,
        "timestamp": datetime.utcnow().isoformat()
    }

    messages = load_messages()
    messages.append(new_message)
    save_messages(messages)

    return jsonify({"message": new_message}), 201


# ---------------------- DELETE: Remove a Message ----------------------
@messages_bp.route("/<tutor_id>/delete/<msg_id>", methods=["DELETE"])
def delete_message(tutor_id, msg_id):
    messages = load_messages()
    messages = [m for m in messages if not (m["id"] == msg_id and m["tutor_id"] == tutor_id)]
    save_messages(messages)
    return jsonify({"success": True})


# Optional: EDIT by deleting and posting again (handled in frontend)
# Or you can add a dedicated PUT endpoint:
@messages_bp.route("/<tutor_id>/edit/<msg_id>", methods=["PUT"])
def edit_message(tutor_id, msg_id):
    data = request.get_json() or {}
    new_text = data.get("message", "").strip()
    if not new_text:
        return jsonify({"error": "Message text required"}), 400

    messages = load_messages()
    edited = False
    for m in messages:
        if m["id"] == msg_id and m["tutor_id"] == tutor_id:
            m["message"] = new_text
            m["timestamp"] = datetime.utcnow().isoformat()
            edited = True
            break
    if not edited:
        return jsonify({"error": "Message not found"}), 404

    save_messages(messages)
    return jsonify({"message": m})
