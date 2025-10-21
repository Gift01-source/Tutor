from flask import Blueprint, request, jsonify, send_from_directory
import json
import uuid
from datetime import datetime
import os
from .db import load_users
from api.config import Config
from api.models import db, TutorVideo, TutorPaper

tutors_bp = Blueprint("tutors", __name__, url_prefix="/api/tutors")

TUTORS_FILE = os.path.join(os.path.dirname(__file__), "..", "tutors.json")
BACKEND_URL = "https://supreme-train-pjpvw497vvqqf7559-5000.app.github.dev/api"

# ----------------------
# Load/Save helpers
# ----------------------
def load_tutors():
    if not os.path.exists(TUTORS_FILE):
        return []
    try:
        with open(TUTORS_FILE, "r") as f:
            data = f.read().strip()
            if not data:
                return []
            return json.loads(data)
    except json.JSONDecodeError:
        return []

def save_tutors(tutors):
    with open(TUTORS_FILE, "w") as f:
        json.dump(tutors, f, indent=4)

def load_reviews():
    try:
        with open("reviews.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_reviews(reviews):
    with open("reviews.json", "w") as f:
        json.dump(reviews, f, indent=4)

# ----------------------
# GET ALL TUTORS (frontend /api/tutors/)
# ----------------------
@tutors_bp.route("/", methods=["GET"])
def get_tutors_root():
    tutors = load_tutors()
    users = load_users()

    enriched_tutors = []
    for tutor in tutors:
        user_id = tutor.get("userId")
        user = next((u for u in users if u.get("id") == user_id), None)

        tutor_data = tutor.copy()
        tutor_data["name"] = user.get("fullName", "Unnamed Tutor") if user else "Unnamed Tutor"
        tutor_data["profilePhoto"] = user.get("profilePhoto", "https://via.placeholder.com/100?text=Tutor") if user else "https://via.placeholder.com/100?text=Tutor"

        if isinstance(tutor_data.get("subjects"), list):
            tutor_data["subjects"] = ", ".join(tutor_data["subjects"])

        enriched_tutors.append(tutor_data)

    return jsonify({"tutors": enriched_tutors}), 200

# ----------------------
# CREATE/UPDATE TUTOR DETAILS
# ----------------------
@tutors_bp.route("/details", methods=["POST"])
def add_tutor_details():
    user_id = request.form.get("userId")
    subjects = request.form.get("subjects")
    experience = request.form.get("experience")
    price = request.form.get("price")
    bio = request.form.get("bio", "")
    availability = request.form.get("availability", "[]")

    if not all([user_id, subjects, experience, price]):
        return jsonify({"error": "Missing required fields"}), 400

    tutors = load_tutors()
    existing = next((t for t in tutors if t.get("userId") == user_id), None)

    tutor_data = {
        "id": str(uuid.uuid4()) if not existing else existing["id"],
        "userId": user_id,
        "subjects": subjects.split(","),
        "experience": experience,
        "price": price,
        "bio": bio,
        "availability": json.loads(availability)
    }

    if existing:
        tutors = [tutor_data if t.get("userId") == user_id else t for t in tutors]
    else:
        tutors.append(tutor_data)

    save_tutors(tutors)
    return jsonify({"message": "Tutor details saved successfully", "tutor": tutor_data}), 201

# ----------------------
# GET TUTOR PROFILE BY USER ID
# ----------------------
@tutors_bp.route("/profile/<user_id>", methods=["GET"])
def get_tutor_profile(user_id):
    tutors = load_tutors()
    tutor = next((t for t in tutors if t.get("userId") == user_id), None)
    if not tutor:
        return jsonify({"error": "Tutor not found"}), 404
    return jsonify(tutor), 200

# ----------------------
# GET ALL TUTORS (enriched)
# ----------------------
@tutors_bp.route("/all", methods=["GET"])
def get_all_tutors():
    tutors = load_tutors()
    users = load_users()

    enriched_tutors = []
    for tutor in tutors:
        user_id = tutor.get("userId")
        user = next((u for u in users if u.get("id") == user_id), None)

        tutor_data = tutor.copy()
        tutor_data["name"] = user.get("fullName", "Unnamed Tutor") if user else "Unnamed Tutor"
        tutor_data["profilePhoto"] = user.get("profilePhoto", "https://via.placeholder.com/100?text=Tutor") if user else "https://via.placeholder.com/100?text=Tutor"

        if isinstance(tutor_data.get("subjects"), list):
            tutor_data["subjects"] = ", ".join(tutor_data["subjects"])

        enriched_tutors.append(tutor_data)

    return jsonify({"tutors": enriched_tutors}), 200

# GET SINGLE TUTOR BY TUTOR ID
@tutors_bp.route("/<tutor_id>", methods=["GET"])
def get_tutor(tutor_id):
    tutors = load_tutors()
    users = load_users()
    tutor = next((t for t in tutors if t.get("id") == tutor_id), None)

    if not tutor:
        return jsonify({"error": "Tutor not found"}), 404

    user = next((u for u in users if u.get("id") == tutor.get("userId")), None)
    if user:
        tutor["name"] = user.get("name", "Unknown Tutor")
        tutor["profilePhoto"] = user.get("profilePhoto", "")

    return jsonify({"tutor": tutor}), 200

# ----------------------
# REVIEWS
# ----------------------
@tutors_bp.route("/<tutor_id>/reviews", methods=["GET"])
def get_tutor_reviews(tutor_id):
    reviews = load_reviews()
    tutor_reviews = reviews.get(tutor_id, [])
    return jsonify({"reviews": tutor_reviews}), 200

@tutors_bp.route("/<tutor_id>/reviews", methods=["POST"])
def submit_tutor_review(tutor_id):
    data = request.json
    rating = data.get("rating")
    comment = data.get("comment")

    if rating is None or comment is None:
        return jsonify({"error": "Rating and comment are required"}), 400

    reviews = load_reviews()
    tutor_reviews = reviews.get(tutor_id, [])

    new_review = {
        "id": str(uuid.uuid4()),
        "rating": rating,
        "comment": comment
    }
    tutor_reviews.append(new_review)
    reviews[tutor_id] = tutor_reviews
    save_reviews(reviews)

    return jsonify({"message": "Review added successfully", "review": new_review}), 201

# ======================== Remaining code (uploads, bookings, notifications) remains unchanged ========================


# Ensure upload directories exist
os.makedirs(os.path.join(Config.UPLOAD_FOLDER, "videos"), exist_ok=True)
os.makedirs(os.path.join(Config.UPLOAD_FOLDER, "papers"), exist_ok=True)

# ---------------------- VIDEO UPLOAD ----------------------

@tutors_bp.route("/<tutor_id>/videos", methods=["POST"])
def upload_video(tutor_id):
    title = request.form.get("title")
    uploader = request.form.get("uploader", "Tutor")
    description = request.form.get("description")
    file = request.files.get("file")

    if not file or not title:
        return jsonify({"error": "Title and file are required"}), 400

    filename = file.filename
    save_path = os.path.join(Config.UPLOAD_FOLDER, "videos", filename)
    file.save(save_path)

    video = TutorVideo(
        tutor_id=tutor_id,
        title=title,
        uploader=uploader,
        description=description,
        url=filename,
    )
    db.session.add(video)
    db.session.commit()

    return jsonify({"message": "Video uploaded successfully", "file": filename}), 200


@tutors_bp.route("/<tutor_id>/videos", methods=["GET"])
def get_videos(tutor_id):
    videos = TutorVideo.query.filter_by(tutor_id=tutor_id).all()
    return jsonify([
        {
            "id": v.id,
            "title": v.title,
            "uploader": v.uploader,
            "description": v.description,
            "url": v.url
        } for v in videos
    ])


@tutors_bp.route("/<tutor_id>/videos/<int:video_id>", methods=["DELETE"])
def delete_video(tutor_id, video_id):
    video = TutorVideo.query.get(video_id)
    if not video:
        return jsonify({"error": "Video not found"}), 404

    file_path = os.path.join(Config.UPLOAD_FOLDER, "videos", video.url)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.session.delete(video)
    db.session.commit()
    return jsonify({"message": "Video deleted successfully"}), 200


# ---------------------- PAPER UPLOAD ----------------------

@tutors_bp.route("/<tutor_id>/papers", methods=["POST"])
def upload_paper(tutor_id):
    title = request.form.get("title")
    uploader = request.form.get("uploader", "Tutor")
    description = request.form.get("description")
    file = request.files.get("file")

    if not file or not title:
        return jsonify({"error": "Title and file are required"}), 400

    filename = file.filename
    save_path = os.path.join(Config.UPLOAD_FOLDER, "papers", filename)
    file.save(save_path)

    paper = TutorPaper(
        tutor_id=tutor_id,
        title=title,
        uploader=uploader,
        description=description,
        url=filename,
    )
    db.session.add(paper)
    db.session.commit()

    return jsonify({"message": "Paper uploaded successfully", "file": filename}), 200


@tutors_bp.route("/<tutor_id>/papers", methods=["GET"])
def get_papers(tutor_id):
    papers = TutorPaper.query.filter_by(tutor_id=tutor_id).all()
    return jsonify([
        {
            "id": p.id,
            "title": p.title,
            "uploader": p.uploader,
            "description": p.description,
            "url": p.url
        } for p in papers
    ])


@tutors_bp.route("/<tutor_id>/papers/<int:paper_id>", methods=["DELETE"])
def delete_paper(tutor_id, paper_id):
    paper = TutorPaper.query.get(paper_id)
    if not paper:
        return jsonify({"error": "Paper not found"}), 404

    file_path = os.path.join(Config.UPLOAD_FOLDER, "papers", paper.url)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.session.delete(paper)
    db.session.commit()
    return jsonify({"message": "Paper deleted successfully"}), 200


# ---------------------- SERVE FILES ----------------------

@tutors_bp.route("/uploads/videos/<filename>")
def serve_video(filename):
    return send_from_directory(os.path.join(Config.UPLOAD_FOLDER, "videos"), filename)


@tutors_bp.route("/uploads/papers/<filename>")
def serve_paper(filename):
    return send_from_directory(os.path.join(Config.UPLOAD_FOLDER, "papers"), filename)

#students getting videos and papers
@tutors_bp.route("/all/videos", methods=["GET"])
def get_all_videos():
    videos = TutorVideo.query.order_by(TutorVideo.created_at.desc()).all()
    video_list = []
    for v in videos:
        video_list.append({
            "id": v.id,
            "title": v.title,
            "uploader": v.uploader,
            "description": v.description,
            "url": v.url,
            "uploadedAt": v.created_at.isoformat(),
            "subject": getattr(v, "subject", None)  # optional field
        })
    return jsonify({"videos": video_list})


# =========================
# Fetch all papers for students
# GET /api/tutors/all/papers
# =========================
@tutors_bp.route("/all/papers", methods=["GET"])
def get_all_papers():
    papers = TutorPaper.query.order_by(TutorPaper.created_at.desc()).all()
    paper_list = []
    for p in papers:
        paper_list.append({
            "id": p.id,
            "title": p.title,
            "uploader": p.uploader,
            "description": p.description,
            "url": p.url,
            "uploadedAt": p.created_at.isoformat(),
            "subject": getattr(p, "subject", None)  # optional field
        })
    return jsonify({"papers": paper_list})
