from flask import Blueprint, request, jsonify
import json, os, uuid
from datetime import datetime

sessions_bp = Blueprint("sessions", __name__, url_prefix="/api/sessions")

SESSIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "sessions.json")


# ---------------------- Helpers ----------------------
def load_sessions():
    """Load all saved sessions from JSON file"""
    if not os.path.exists(SESSIONS_FILE):
        return []
    try:
        with open(SESSIONS_FILE, "r") as f:
            data = f.read().strip()
            if not data:
                return []
            return json.loads(data)
    except json.JSONDecodeError:
        return []


def save_sessions(sessions):
    """Save all sessions to JSON file"""
    with open(SESSIONS_FILE, "w") as f:
        json.dump(sessions, f, indent=4)


# ---------------------- POST: Create New Session (Booking) ----------------------
@sessions_bp.route("/", methods=["POST"])
def create_session():
    """Book a tutoring session"""
    data = request.get_json() or {}

    # Required fields check
    required_fields = ["student_name", "student_email", "tutorId", "tutor_name", "session_time", "topic"]
    missing_fields = [f for f in required_fields if not data.get(f)]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    student_name = data["student_name"].strip()
    student_email = data["student_email"].strip().lower()
    tutor_id = data["tutorId"]
    tutor_name = data["tutor_name"]
    session_time = data["session_time"]
    topic = data["topic"].strip()

    # ------------------ FIX: Normalize session_time ------------------
    try:
        # Replace space with 'T' if needed
        session_time = session_time.replace(" ", "T")

        # If seconds are missing, append ':00'
        if len(session_time.split("T")[-1].split(":")) == 2:
            session_time += ":00"

        dt = datetime.fromisoformat(session_time)
        if dt < datetime.utcnow():
            return jsonify({"error": "Session time must be in the future."}), 400
    except Exception:
        return jsonify({"error": "Invalid session_time format."}), 400

    sessions = load_sessions()

    # Prevent duplicate booking for the same student, tutor, and time
    for s in sessions:
        if s["student_email"] == student_email and s["tutorId"] == tutor_id and s["session_time"] == session_time:
            return jsonify({"error": "You already booked this tutor for that time."}), 400

    new_session = {
        "id": str(uuid.uuid4()),
        "student_name": student_name,
        "student_email": student_email,
        "tutorId": tutor_id,
        "tutor_name": tutor_name,
        "session_time": session_time,
        "topic": topic,
        "status": "pending",  # default status
        "created_at": datetime.utcnow().isoformat()
    }

    sessions.append(new_session)
    save_sessions(sessions)

    return jsonify({"message": "Session booked successfully!", "session": new_session}), 201
