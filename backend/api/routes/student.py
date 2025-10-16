from flask import Blueprint, request, jsonify

student_bp = Blueprint('student', __name__, url_prefix='/api/student')

# In-memory storage for demonstration
STUDENT_GOALS = {}

@student_bp.route('/goal', methods=['POST'])
def add_goal():
    data = request.get_json()
    student_id = data.get('student_id')
    text = data.get('text')

    if not student_id or not text:
        return jsonify({"error": "Missing student_id or text"}), 400

    # Initialize if first goal
    if student_id not in STUDENT_GOALS:
        STUDENT_GOALS[student_id] = []

    # Add new goal
    STUDENT_GOALS[student_id].append({"text": text, "completed": False})

    return jsonify({"goals": STUDENT_GOALS[student_id]}), 201


@student_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({"error": "Missing student_id"}), 400

    return jsonify({
        "upcoming_sessions": [],      # populate as needed
        "session_history": [],
        "goals": STUDENT_GOALS.get(student_id, []),
        "available_tutors": []
    }), 200
