import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    VIDEO_FOLDER = os.path.join(UPLOAD_FOLDER, "videos")
    PAPER_FOLDER = os.path.join(UPLOAD_FOLDER, "papers")

    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
