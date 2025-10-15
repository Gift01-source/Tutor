import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SessionActions from '../components/ApprovedSessionActions';

function TutorSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem('all_bookings') || '[]');
    const updated = allBookings.map(b => ({
      id: b.id,
      studentName: b.student_name || 'Student',
      date: b.session_time ? b.session_time.split('T')[0] : '',
      time: b.session_time ? b.session_time.split('T')[1].slice(0,5) : '',
      topic: b.topic,
      status: localStorage.getItem(`status_${b.id}`) || b.status || 'pending',
      tutorId: b.tutor_id || 1,
    }));
    setSessions(updated);
  }, []);

  const updateSessionStatus = (id, status) => {
    const updated = sessions.map(s => s.id === id ? { ...s, status } : s);
    setSessions(updated);
    localStorage.setItem(`status_${id}`, status);
  };

  const handleApprove = (id) => updateSessionStatus(id, 'approved');
  const handleReject = (id) => updateSessionStatus(id, 'rejected');

  return (
    <div>
      {/*<Navbar role="tutor" />*/}
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

                  {/* Show payment / session actions if approved */}
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
