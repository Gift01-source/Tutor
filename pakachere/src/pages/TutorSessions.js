import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SessionActions from '../components/ApprovedSessionActions';

function TutorSessions() {
  const [sessions, setSessions] = useState([]);

  const BASE_URL = "https://fuzzy-space-guacamole-q7pr4j6vrrx9c95g-5000.app.github.dev";

  // Fetch sessions from backend
  useEffect(() => {
    axios.get(`${BASE_URL}/sessions`)
      .then(res => {
        const updated = res.data.map(b => ({
          id: b.id,
          studentName: b.student_name || 'Student',
          date: b.session_time ? b.session_time.split('T')[0] : '',
          time: b.session_time ? b.session_time.split('T')[1].slice(0,5) : '',
          topic: b.topic,
          status: b.status || 'pending',
          tutorId: b.tutor_id || 1,
        }));
        setSessions(updated);
      })
      .catch(err => console.error("Error fetching sessions:", err));
  }, []);

  // Update session status via backend
  const updateSessionStatus = (id, status) => {
    axios.post(`${BASE_URL}/sessions/${id}/status`, { status })
      .then(res => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      })
      .catch(err => console.error("Error updating status:", err));
  };

  const handleApprove = (id) => updateSessionStatus(id, 'approved');
  const handleReject = (id) => updateSessionStatus(id, 'rejected');

  return (
    <div>
      {/* <Navbar role="tutor" /> */}
      <div className="min-h-screen bg-gray-100 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Sessions</h1>

        {sessions.length === 0 ? (
          <p>No sessions booked yet.</p>
        ) : (
          <ul className="space-y-4">
            {sessions.map(session => (
              <li
                key={session.id}
                className="bg-white p-4 rounded shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-3"
              >
                <div>
                  <p><strong>Student:</strong> {session.studentName}</p>
                  <p><strong>Date:</strong> {session.date}</p>
                  <p><strong>Time:</strong> {session.time}</p>
                  <p><strong>Topic:</strong> {session.topic}</p>
                  <p>
                    <strong>Status:</strong>
                    <span className={
                      session.status === 'approved' ? 'text-green-600' :
                      session.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }> {session.status}</span>
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  {session.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(session.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(session.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {session.status === 'approved' && (
                    <SessionActions session={session} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TutorSessions;
