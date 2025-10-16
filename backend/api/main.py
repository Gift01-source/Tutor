from flask import Flask
from flask_cors import CORS
from routes.tutors import tutors_bp
from routes.sessions import sessions_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(tutors_bp)
app.register_blueprint(sessions_bp)

if __name__ == '__main__':
    app.run(debug=True)
