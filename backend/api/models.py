from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class TutorVideo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tutor_id = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    uploader = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    url = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TutorPaper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tutor_id = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    uploader = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    url = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
