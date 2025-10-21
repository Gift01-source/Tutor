// src/pages/TutorSessions.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import SessionActions from "../components/ApprovedSessionActions";

const BASE_URL = "https://tutorbackend-tr3q.onrender.com";

export default function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get tutor ID and role from localStorage
  let tutorUserId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Ensure tutorUserId is a string (backend expects string)
  if (tutorUserId) tutorUserId = tutorUserId.toString();

  useEffect(() => {
    if (!tutorUserId || role !== "tutor") return;

    const fetchSessions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/sessions`, {
          params: { tutorId: tutorUserId },
        });
        // backend returns { sessions: [...] }
        setSessions(res.data.sessions || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    // Optional: poll for updates every 10s
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, [tutorUserId, role]);

  const updateSessionStatus = async (id, status) => {
    try {
      await axios.post(`${BASE_URL}/api/sessions/${id}/status`, { status });
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (!tutorUserId || role !== "tutor") {
    return (
      <p className="text-center mt-16 text-red-600">
        You must be logged in as a tutor to view sessions.
      </p>
    );
  }

  return (
    <div>
      <Navbar role="tutor" />
      <div className="min-h-screen bg-gray-100 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Sessions</h1>
        {loading ? (
          <p>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p>No sessions booked yet.</p>
        ) : (
          <ul className="space-y-4">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="bg-white p-4 rounded shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-3"
              >
                <div>
                  <p><strong>Student:</strong> {session.student_name}</p>
                  <p><strong>Date:</strong> {session.session_time?.split('T')[0]}</p>
                  <p><strong>Time:</strong> {session.session_time?.split('T')[1]?.slice(0, 5)}</p>
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
                  {session.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateSessionStatus(session.id, "approved")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateSessionStatus(session.id, "rejected")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {session.status === "approved" && <SessionActions session={session} />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
