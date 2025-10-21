from flask import Blueprint, request, jsonify
from api.db import load_users, save_users
from .tutors import load_tutors

import bcrypt
import uuid

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# ----------------------
# REGISTER ROUTE
# ----------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([full_name, email, password, role]):
        return jsonify({"error": "All fields are required"}), 400

    users = load_users()
    if any(u.get("email") == email for u in users):

        return jsonify({"error": "Email already registered"}), 400

    # Hash password
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Create new user
    user = {
        "id": str(uuid.uuid4()),
        "fullName": full_name,
        "email": email,
        "password": hashed_pw,
        "role": role
    }

    users.append(user)
    save_users(users)

    # Return user info for frontend (so `user.id` exists)
    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": user["id"],
            "fullName": user["fullName"],
            "role": user["role"]
        }
    }), 201

# ----------------------
# LOGIN ROUTE
# ----------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    users = load_users()
    user = next((u for u in users if u.get("email") == email), None)
    if not user:
        return jsonify({"error": "User not found"}), 401


    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"error": "Invalid password"}), 401

    token = str(uuid.uuid4())

    # Load tutor details if this user is a tutor
    tutor_details = None
    if user["role"] == "tutor":
        tutors = load_tutors()
        tutor_details = next((t for t in tutors if t.get("userId") == user["id"]), None)


    return jsonify({
        "token": token,
        "user": {
            "id": user["id"],
            "fullName": user["fullName"],
            "email": user["email"],
            "role": user["role"],
            "tutorDetails": tutor_details  # <--- include tutor details if they exist
        }
    }), 200
