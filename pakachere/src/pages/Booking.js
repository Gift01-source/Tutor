import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ApprovedSessionActions from '../components/ApprovedSessionActions';
import { format } from 'date-fns';
import { FaStar } from 'react-icons/fa';
import LiveVideoSession from './video'; // Import the live video component

const BASE_URL = 'https://tutorbackend-tr3q.onrender.com';

function Book() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const studentName = localStorage.getItem("fullName");
  const studentEmail = localStorage.getItem("email");

  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState({ tutors: true, bookings: true });
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: null, error: null });
  const [bookingInputs, setBookingInputs] = useState({});

  const [activeSession, setActiveSession] = useState(null); // <-- live video session state

  // --- FETCH TUTORS ---
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/tutors/all`);
        const data = await res.json();
        if (data.tutors) {
          const cleanTutors = data.tutors.map(t => ({
            ...t,
            subjects: Array.isArray(t.subjects) ? t.subjects : t.subjects?.split(',') || [],
            availability: Array.isArray(t.availability) ? t.availability : t.availability?.split(',') || [],
          }));
          setTutors(cleanTutors);
        }
      } catch (err) {
        console.error('Error fetching tutors:', err);
      } finally {
        setLoading(prev => ({ ...prev, tutors: false }));
      }
    };
    fetchTutors();
  }, []);

  // --- FETCH STUDENT BOOKINGS ---
  useEffect(() => {
    if (!studentEmail) return;
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/sessions?student_email=${studentEmail}`);
        const data = await res.json();
        setBookings(data.sessions || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(prev => ({ ...prev, bookings: false }));
      }
    };
    fetchBookings();
  }, [studentEmail]);

  // --- INPUT HANDLER ---
  const handleInputChange = (tutorId, field, value) => {
    setBookingInputs(prev => ({
      ...prev,
      [tutorId]: { ...prev[tutorId], [field]: value }
    }));
  };

  // --- VALIDATION ---
  const validateTutorInput = (input) => {
    const errors = {};
    if (!input.topic || input.topic.trim().length < 2) errors.topic = 'Topic must be at least 2 characters';
    if (!input.date) errors.date = 'Select a date';
    if (!input.time) errors.time = 'Select a time';

    if (input.date && input.time) {
      const timePattern = /^\d{2}:\d{2}$/;
      if (!timePattern.test(input.time)) {
        errors.time = 'Invalid time format';
      }

      const [hour, minute] = input.time.split(':').map(Number);
      const dt = new Date(input.date);
      dt.setHours(hour, minute, 0, 0);
      if (dt < new Date()) errors.date = 'Select a future date and time';
    }

    return errors;
  };

  // --- BOOKING SUBMIT ---
  const handleBookingSubmit = async (tutor) => {
    if (!studentName || !studentEmail) {
      setSubmitStatus({ loading: false, success: null, error: 'Student name or email not found. Please login again.' });
      return;
    }

    const input = bookingInputs[tutor.id] || {};
    const errors = validateTutorInput(input);
    if (Object.keys(errors).length > 0) {
      setSubmitStatus({ loading: false, success: null, error: Object.values(errors).join(', ') });
      return;
    }

    setSubmitStatus({ loading: true, success: null, error: null });

    try {
      const [hour, minute] = input.time.split(':').map(Number);
      const dt = new Date(input.date);
      dt.setHours(hour, minute, 0, 0);
      const session_time = dt.toISOString();

      const res = await fetch(`${BASE_URL}/api/sessions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName,
          student_email: studentEmail,
          tutorId: tutor.id,
          tutor_name: tutor.name,
          session_time,
          topic: input.topic,
          subjects: tutor.subjects
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to book session');

      const newSession = data.session || data;

      setBookings(prev => [...prev, newSession]);
      setBookingInputs(prev => ({ ...prev, [tutor.id]: { topic: '', date: today, time: '' } }));
      setSubmitStatus({ loading: false, success: 'Session booked successfully!', error: null });
      setTimeout(() => setSubmitStatus(prev => ({ ...prev, success: null })), 3000);
    } catch (err) {
      setSubmitStatus({ loading: false, success: null, error: err.message });
    }
  };

  return (
    <div>
      <Navbar role="student" />
      <div className="min-h-screen bg-blue-50 p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Book a Session</h1>

        {submitStatus.success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{submitStatus.success}</div>}
        {submitStatus.error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{submitStatus.error}</div>}

        {/* My Bookings */}
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">📘 My Booked Sessions</h2>
        {loading.bookings ? <p>Loading your sessions...</p> :
          bookings.length === 0 ? <p className="text-gray-600">You haven't booked any sessions yet.</p> :
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
            {bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(booking => (
              <div key={booking.id} className="min-w-[250px] bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
                <p><strong>Tutor:</strong> {booking.tutor_name}</p>
                <p><strong>Date:</strong> {new Date(booking.session_time).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(booking.session_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Topic:</strong> {booking.topic}</p>
                <p><strong>Status:</strong> <span className={`ml-1 font-medium ${booking.status === 'approved' ? 'text-green-600' : booking.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{booking.status}</span></p>
                <ApprovedSessionActions session={booking} />

                {/* Live Video Button */}
                {booking.status === 'approved' && (
                  <button
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    onClick={() => setActiveSession({ roomId: booking.id, name: studentName })}
                  >
                    Join Live Session
                  </button>
                )}
              </div>
            ))}
          </div>
        }

        {/* Available Tutors */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">🎓 Available Tutors</h2>
        {loading.tutors ? <p>Loading tutors...</p> :
          tutors.length === 0 ? <p>No tutors available at the moment.</p> :
          tutors.map(tutor => {
            const input = bookingInputs[tutor.id] || { topic: '', date: today, time: '' };
            return (
              <div key={tutor.id} className="bg-white p-4 mb-4 rounded shadow-md">
                <div className="flex items-center gap-4 mb-2">
                  <img src={tutor.profilePhoto || "https://via.placeholder.com/60"} alt={tutor.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
                  <div>
                    <h2 className="text-lg font-semibold">{tutor.name}</h2>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={14} color={i < Math.round(tutor.rating || 0) ? "#facc15" : "#d1d5db"} />
                      ))}
                      <span className="ml-2 text-gray-500 text-sm">{tutor.reviewsCount || 0} reviews</span>
                    </div>
                  </div>
                </div>
                <p><strong>Subjects:</strong> {tutor.subjects.join(', ') || 'N/A'}</p>
                <p><strong>Experience:</strong> {tutor.experience || 'N/A'} yrs</p>
                <p><strong>Price:</strong> K{tutor.price || 'N/A'}/hr</p>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" placeholder="Topic" value={input.topic} onChange={e => handleInputChange(tutor.id, 'topic', e.target.value)} className="p-2 border rounded" />
                  <input type="date" value={input.date} min={today} onChange={e => handleInputChange(tutor.id, 'date', e.target.value)} className="p-2 border rounded" />
                  <input type="time" value={input.time} onChange={e => handleInputChange(tutor.id, 'time', e.target.value)} className="p-2 border rounded" />
                </div>

                <button onClick={() => handleBookingSubmit(tutor)} disabled={submitStatus.loading} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  {submitStatus.loading ? 'Booking...' : 'Book Session'}
                </button>
              </div>
            );
          })
        }

        {/* Live Video Session Modal */}
        {activeSession && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="w-full max-w-5xl h-[80vh] bg-white rounded-lg overflow-hidden relative">
              <button
                className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => setActiveSession(null)}
              >
                Close
              </button>
              <LiveVideoSession roomId={activeSession.roomId} name={activeSession.name} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Book;
