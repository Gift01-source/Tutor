import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = "https://supreme-train-pjpvw497vvqqf7559-5000.app.github.dev";

export default function LiveSessionsPage({ role, tutorId }) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Optional: fetch active sessions from backend
  }, []);

  const startSession = async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/video/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: tutorId }),
      });
      const data = await res.json();
      navigate(`/live/${data.room_id}?role=tutor`);
    } catch (err) {
      console.error(err);
      alert("Failed to start session.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{role === 'tutor' ? 'Your Live Sessions' : 'Join Live Sessions'}</h1>

      {role === 'tutor' && (
        <button onClick={startSession} style={{ padding: 10, borderRadius: 6, cursor: 'pointer' }}>
          Start New Session
        </button>
      )}

      {/* Here you could list active sessions for students to join */}
      <div>
        {sessions.length === 0 && <p>No active sessions</p>}
        {sessions.map(s => (
          <button
            key={s.room_id}
            onClick={() => navigate(`/live/${s.room_id}?role=student`)}
          >
            Join {s.session_name}
          </button>
        ))}
      </div>
    </div>
  );
}
