import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVideo, FaPhone, FaEnvelope, FaDollarSign } from 'react-icons/fa';

function StudentSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Load all bookings for this student from localStorage
    const allBookings = JSON.parse(localStorage.getItem('all_bookings') || '[]');
    const studentSessions = allBookings.map(b => ({
      id: b.id,
      tutorName: b.tutor_name || 'Tutor',
      date: b.session_time ? b.session_time.split('T')[0] : '',
      time: b.session_time ? b.session_time.split('T')[1].slice(0,5) : '',
      topic: b.topic,
      status: localStorage.getItem(`status_${b.id}`) || b.status || 'pending',
      isPaid: localStorage.getItem(`paid_${b.id}`) === 'true',
      tutorId: b.tutor_id || 1,
    }));
    setSessions(studentSessions);
  }, []);

  const handlePayment = (id) => {
    navigate(`/payment/${id}`);
  };

  const handleVideoCall = (topic) => {
    alert(`Starting Video Call for "${topic}"`);
  };

  const handleAudioCall = (topic) => {
    alert(`Starting Audio Call for "${topic}"`);
  };

  const handleMessages = (tutorId) => {
    navigate(`/messages/${tutorId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Sessions</h1>

      {sessions.length === 0 ? (
        <p>No sessions booked yet.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map(session => (
            <li key={session.id} className="bg-white p-4 rounded shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <p><strong>Tutor:</strong> {session.tutorName}</p>
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

              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                {/* If not approved yet */}
                {session.status === 'pending' && (
                  <p className="text-yellow-700 font-semibold">Waiting for tutor approval...</p>
                )}

                {/* If approved but not paid */}
                {session.status === 'approved' && !session.isPaid && (
                  <button
                    onClick={() => handlePayment(session.id)}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    <FaDollarSign /> Pay Now
                  </button>
                )}

                {/* If approved and paid */}
                {session.status === 'approved' && session.isPaid && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleVideoCall(session.topic)}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <FaVideo /> Video Call
                    </button>

                    <button
                      onClick={() => handleAudioCall(session.topic)}
                      className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                      <FaPhone /> Audio Call
                    </button>

                    <button
                      onClick={() => handleMessages(session.tutorId)}
                      className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      <FaEnvelope /> Messages
                    </button>
                  </div>
                )}

                {/* If rejected */}
                {session.status === 'rejected' && (
                  <p className="text-red-600 font-semibold">Session rejected by tutor.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentSessions;
