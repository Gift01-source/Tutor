from flask import Flask
from flask_cors import CORS
from .routes.auth import auth_bp
from .routes.student import student_bp
from .routes.tutors import tutors_bp
from .routes.sessions import sessions_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(student_bp, url_prefix='/api/student')
app.register_blueprint(tutors_bp, url_prefix='/api/tutors')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
