from flask import Blueprint, request, jsonify, send_from_directory
import os
import json
import uuid
from werkzeug.utils import secure_filename

students_bp = Blueprint("students", __name__, url_prefix="/api/students")

# -------------------------
# File paths
# -------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "..", "students.json")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads", "students")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# -------------------------
# Helper Functions
# -------------------------
def load_students():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r") as f:
            data = f.read().strip()
            if not data:
                return []
            return json.loads(data)
    except json.JSONDecodeError:
        return []

def save_students(students):
    with open(DATA_FILE, "w") as f:
        json.dump(students, f, indent=4)


# -------------------------
# ROUTES
# -------------------------

# ✅ Upload student avatar
@students_bp.route("/upload-avatar", methods=["POST"])
def upload_avatar():
    if "avatar" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["avatar"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_name = f"{uuid.uuid4()}_{filename}"
        file.save(os.path.join(UPLOAD_FOLDER, unique_name))
        return jsonify({
            "message": "Avatar uploaded successfully",
            "avatarUrl": f"/api/students/avatars/{unique_name}"
        }), 200
    return jsonify({"error": "Invalid file type"}), 400


# ✅ Serve uploaded images
@students_bp.route("/avatars/<filename>")
def get_avatar(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ✅ Create or update student profile
@students_bp.route("/profile", methods=["POST"])
def save_student_profile():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing data"}), 400

    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    students = load_students()
    existing = next((s for s in students if s.get("email") == email), None)

    student_data = {
        "id": str(uuid.uuid4()) if not existing else existing["id"],
        "name": data.get("name"),
        "email": email,
        "institution": data.get("institution"),
        "course": data.get("course"),
        "goals": data.get("goals", ""),
        "avatar": data.get("avatar", ""),
    }

    if existing:
        students = [student_data if s["email"] == email else s for s in students]
    else:
        students.append(student_data)

    save_students(students)
    return jsonify({"message": "Profile saved successfully", "student": student_data}), 201


# ✅ Get student profile by email or ID
@students_bp.route("/profile/<identifier>", methods=["GET"])
def get_student_profile(identifier):
    students = load_students()
    student = next(
        (s for s in students if s.get("id") == identifier or s.get("email") == identifier),
        None,
    )
    if not student:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(student), 200


# ✅ Get all students
@students_bp.route("/all", methods=["GET"])
def get_all_students():
    students = load_students()
    return jsonify(students), 200


# ✅ Delete student
@students_bp.route("/delete/<student_id>", methods=["DELETE"])
def delete_student(student_id):
    students = load_students()
    updated = [s for s in students if s["id"] != student_id]
    if len(updated) == len(students):
        return jsonify({"error": "Student not found"}), 404
    save_students(updated)
    return jsonify({"message": "Student deleted successfully"}), 200
