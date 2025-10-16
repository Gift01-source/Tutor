from flask import Blueprint, jsonify

tutors_bp = Blueprint('tutors', __name__, url_prefix='/api/tutors')

# Sample tutors
TUTORS = [
    {"id": 1, "name": "Ms. Jane", "subject": "Mathematics", "email": "Dedza Secondary School"},
    {"id": 2, "name": "Mr. John Banda", "subject": "English Literature", "email": "MUST"},
    {"id": 3, "name": "Mrs. Emily Waya", "subject": "Science", "email": "COM"},
    {"id": 4, "name": "Dr. Alex Kim", "subject": "Physics", "email": "UNIMA"},
    {"id": 5, "name": "Prof. Sara Brown", "subject": "Chemistry", "email": "MUBAS"},
]

@tutors_bp.route('/', methods=['GET'])
def get_tutors():
    return jsonify({"tutors": TUTORS}), 200
