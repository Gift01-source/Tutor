from flask import Blueprint, request, jsonify, send_from_directory
from models import db, TutorVideo, TutorPaper
from config import Config
import os

tutors_bp = Blueprint("tutors", __name__)

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
