from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from .routes.video import video_bp, init_socketio
from .config import Config
from .models import db  # SQLAlchemy instance
from flask_mail import Mail
from dotenv import load_dotenv

from .routes.auth import auth_bp
from .routes.student import students_bp
from .routes.tutors import tutors_bp
from .routes.sessions import sessions_bp
from .routes.message import messages_bp
from .routes.video import video_bp
from .routes.payments import payments_bp
from .routes.referral import referral_bp
from .routes.reset import reset_bp

# --- CREATE FLASK APP ---
app = Flask(__name__)
app.config.from_object(Config)
load_dotenv()  # Load variables from .env

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

mail = Mail(app)

# --- INIT DATABASE ---
db.init_app(app) 
with app.app_context():
    db.create_all()
 # ✅ fixes 'current Flask app is not registered with this SQLAlchemy instance'

# --- SOCKET.IO ---
socketio = SocketIO(app, cors_allowed_origins="*")
init_socketio(socketio)

# --- CONFIG ---
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # max 500MB

# --- CORS ---
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- ROUTES ---
@app.route("/")
def home():
    return jsonify({"message": "Backend is running!"})

app.register_blueprint(auth_bp, url_prefix="/api/auth")
# app.register_blueprint(students_bp, url_prefix="/api/student")
app.register_blueprint(tutors_bp, url_prefix="/api/tutors")
app.register_blueprint(sessions_bp)
app.register_blueprint(students_bp)
app.register_blueprint(messages_bp, url_prefix="/api/messages")
app.register_blueprint(video_bp, url_prefix="/api/video")
app.register_blueprint(payments_bp, url_prefix="/api/payments")
app.register_blueprint(referral_bp, url_prefix="/api/referral")
app.register_blueprint(reset_bp, url_prefix="/api/reset")

# --- RUN SERVER ---
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)



