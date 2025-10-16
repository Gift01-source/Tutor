from flask import Blueprint, request, jsonify
from api.db import load_users, save_users
import bcrypt
import uuid

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

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
    if any(u["email"] == email for u in users):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = {
        "id": str(uuid.uuid4()),
        "fullName": full_name,
        "email": email,
        "password": hashed_pw,
        "role": role
    }

    users.append(user)
    save_users(users)

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    users = load_users()
    user = next((u for u in users if u["email"] == email), None)
    if not user:
        return jsonify({"error": "User not found"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"error": "Invalid password"}), 401

    # In production, generate a real JWT token. Here we return a dummy token
    token = str(uuid.uuid4())
    return jsonify({"token": token, "user": {"id": user["id"], "fullName": user["fullName"], "email": user["email"], "role": user["role"]}}), 200
