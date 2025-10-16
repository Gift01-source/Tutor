from flask import Blueprint, request, jsonify
from datetime import datetime

sessions_bp = Blueprint('sessions', __name__, url_prefix='/api/sessions')

# In-memory storage
SESSIONS = []

@sessions_bp.route('/', methods=['POST'])
def book_session():
    data = request.get_json()
    student_name = data.get('student_name', 'Student')
    tutor_id = data.get('tutorId')
    session_time = data.get('session_time')
    topic = data.get('topic')

    # Basic validation
    if not tutor_id or not session_time or not topic:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        datetime.fromisoformat(session_time)
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    new_session = {
        "id": len(SESSIONS) + 1,
        "tutorId": tutor_id,
        "tutor_name": data.get('tutor_name', ''),
        "student_name": student_name,
        "session_time": session_time,
        "topic": topic,
        "status": "pending"
    }

    SESSIONS.append(new_session)
    return jsonify({"message": "Session booked successfully", "session": new_session}), 201

@sessions_bp.route('/', methods=['GET'])
def get_sessions():
    student_name = request.args.get('student_name', 'Student')
    student_sessions = [s for s in SESSIONS if s['student_name'] == student_name]
    return jsonify({"sessions": student_sessions}), 200
