# routes/video.py
from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
import uuid

video_bp = Blueprint("video", __name__)

# We'll attach SocketIO in the main app later
socketio = None  # placeholder, will be set in app.py

# In-memory rooms for simplicity
rooms = {}

@video_bp.route("/create", methods=["POST"])
def create_room():
    """Create a new video room for a session"""
    data = request.get_json() or {}
    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400

    room_id = str(uuid.uuid4())
    rooms[room_id] = {"session_id": session_id, "participants": []}
    return jsonify({"room_id": room_id})


# ------------------ SOCKET.IO EVENTS ------------------
def init_socketio(sio: SocketIO):
    global socketio
    socketio = sio

    @socketio.on("join-room")
    def handle_join_room(data):
        room_id = data.get("roomId")
        name = data.get("name")
        join_room(room_id)
        if room_id in rooms:
            rooms[room_id]["participants"].append(name)
        emit("user-joined", {"name": name}, room=room_id, include_self=False)

    @socketio.on("signal")
    def handle_signal(data):
        """Forward WebRTC signals between peers"""
        room_id = data.get("roomId")
        emit("signal", data, room=room_id, include_self=False)

    @socketio.on("chat-message")
    def handle_chat_message(data):
        room_id = data.get("roomId")
        message = data.get("message")
        emit("chat-message", {"message": message}, room=room_id)
