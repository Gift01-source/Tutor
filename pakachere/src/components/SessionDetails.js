import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ApprovedSessionActions from './ApprovedSessionActions';

function SessionDetails() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    axios.get(`/api/sessions/${sessionId}`).then(res => {
      setSession(res.data);
    });
  }, [sessionId]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Session with {session.tutorName || session.studentName}</h1>

      <p>Status: <strong>{session.status}</strong></p>

      {session.status === 'approved' && (
        <div className="mt-6 flex gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => window.open(`https://tutor-session-room.daily.co/tutor-session-room/${sessionId}`, '_blank')}
          >
            Video Call
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => window.open(`https://tutor-session-room.daily.co/tutor-session-roomp/${sessionId}`, '_blank')}
          >
            Audio Call
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => window.open(`/messages/${sessionId}`, '_blank')}
          >
            Messages
          </button>
        </div>
      )}
    </div>
  );
}

export default SessionDetails;
