from flask import Flask
from flask_cors import CORS
from api.routes.student import student_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend fetch

app.register_blueprint(student_bp)

if __name__ == "__main__":
    app.run(debug=True)
