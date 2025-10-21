import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = "https://supreme-train-pjpvw497vvqqf7559-5000.app.github.dev";

const LiveSession = ({ role = "student" }) => { // role: 'tutor' or 'student'
  const { tutorId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);

  const [status, setStatus] = useState("Initializing...");
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const initSession = async () => {
      setStatus(`Starting live session as ${role}`);

      let localStream;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      } catch (err) {
        console.error(err);
        setStatus("Failed to access camera/microphone");
        return;
      }

      const socket = io(SOCKET_URL, { transports: ["websocket"], path: "/socket.io" });
      socketRef.current = socket;

      socket.on("connect", () => console.log("Connected!", socket.id));
      socket.on("connect_error", (err) => console.error(err));

      const pc = new RTCPeerConnection();
      pcRef.current = pc;
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("signal", { roomId, candidate: event.candidate });
        }
      };

      const userName = role === "tutor" ? "Tutor" : "Student";

      if (role === "tutor") {
        // Tutor creates the room
        const res = await fetch(`${SOCKET_URL}/api/video/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: tutorId }),
        });
        const data = await res.json();
        const newRoomId = data.room_id;
        setRoomId(newRoomId);
        socket.emit("join-room", { roomId: newRoomId, name: userName });
        setParticipants([userName]);

        // Create offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("signal", { roomId: newRoomId, sdp: pc.localDescription });
      } else {
        // Student joins existing room
        setRoomId(tutorId);
        socket.emit("join-room", { roomId: tutorId, name: userName });
        setParticipants([userName]);
      }

      socket.on("signal", async (data) => {
        if (data.sdp) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            if (data.sdp.type === "offer" && role === "student") {
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socket.emit("signal", { roomId: tutorId, sdp: pc.localDescription });
            }
          } catch (err) {
            console.error("SDP error:", err);
          }
        } else if (data.candidate) {
          try {
            await pc.addIceCandidate(data.candidate);
          } catch (err) {
            console.error(err);
          }
        }
      });

      socket.on("chat-message", (data) => {
        setMessages(prev => [...prev, { sender: data.sender || "Tutor", message: data.message }]);
      });

      socket.on("user-joined", (data) => {
        setParticipants(prev => [...prev, data.name]);
        setMessages(prev => [...prev, { sender: "System", message: `${data.name} joined` }]);
      });

      setStatus("Live session started!");
    };

    initSession();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (pcRef.current) pcRef.current.close();
    };
  }, [tutorId, role]);

  const sendMessage = () => {
    if (!chatInput.trim() || !socketRef.current) return;
    socketRef.current.emit("chat-message", { roomId, message: chatInput });
    setMessages(prev => [...prev, { sender: "You", message: chatInput }]);
    setChatInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", backgroundColor: "#000" }}>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          width: 120,
          height: 160,
          borderRadius: 8,
          border: "2px solid #fff",
          objectFit: "cover",
        }}
      />
      <div style={{
        position: "absolute",
        top: 40,
        left: 20,
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textShadow: "0px 0px 5px #000"
      }}>
        {participants.length} viewer{participants.length !== 1 ? "s" : ""}
      </div>
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 20,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        maxHeight: "50%",
        overflowY: "auto",
        width: "50%",
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ color: "#fff", textShadow: "0px 0px 3px #000" }}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        display: "flex",
        width: "50%",
      }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 20,
            border: "none",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 10,
            padding: "10px 16px",
            borderRadius: 20,
            backgroundColor: "#00a6ffff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveSession;
