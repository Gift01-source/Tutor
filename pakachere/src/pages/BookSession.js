import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ApprovedSessionActions from '../components/ApprovedSessionActions';
import { format } from 'date-fns';
import { FaStar } from 'react-icons/fa';

const BASE_URL = 'https://supreme-train-pjpvw497vvqqf7559-5000.app.github.dev/api/sessions'; // your backend URL

function BookSession() {
  const studentName = 'Student'; // Replace with logged-in student info
  const today = format(new Date(), 'yyyy-MM-dd');

  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState({ tutors: true, bookings: true });
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: null, error: null });
  const [bookingInputs, setBookingInputs] = useState({});

  // Fetch tutors and booked sessions
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/tutors/`);
        const data = await res.json();
        setTutors(data.tutors || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, tutors: false }));
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/sessions/?student_name=${studentName}`);
        const data = await res.json();
        setBookings(data.sessions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, bookings: false }));
      }
    };

    fetchTutors();
    fetchBookings();
  }, [studentName]);

  const handleInputChange = (tutorId, field, value) => {
    setBookingInputs(prev => ({
      ...prev,
      [tutorId]: { ...prev[tutorId], [field]: value }
    }));
  };

  const validateTutorInput = (input) => {
    const errors = {};
    if (!input.topic || input.topic.trim().length < 2) errors.topic = 'Topic must be at least 2 characters';
    if (!input.date) errors.date = 'Select a date';
    if (!input.time) errors.time = 'Select a time';
    if (input.date && input.time) {
      const dt = new Date(`${input.date}T${input.time}`);
      if (dt < new Date()) errors.date = 'Select a future date and time';
    }
    return errors;
  };

  const handleBookingSubmit = async (tutor) => {
    const input = bookingInputs[tutor.id] || {};
    const errors = validateTutorInput(input);
    if (Object.keys(errors).length > 0) {
      setSubmitStatus({ loading: false, success: null, error: Object.values(errors).join(', ') });
      return;
    }

    setSubmitStatus({ loading: true, success: null, error: null });

    try {
      const session_time = new Date(`${input.date}T${input.time}`).toISOString();
      const res = await fetch(`${BASE_URL}/api/sessions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName,
          tutorId: tutor.id,
          tutor_name: tutor.name,
          session_time,
          topic: input.topic
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to book session');

      const newSession = data.session || data;

      // Update bookings instantly
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
      <div className="min-h-screen bg-blue-50 p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Book a Session</h1>

        {submitStatus.success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{submitStatus.success}</div>
        )}
        {submitStatus.error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{submitStatus.error}</div>
        )}

        {/* Tutors List */}
        {loading.tutors ? (
          <p>Loading tutors...</p>
        ) : (
          tutors.map(tutor => {
            const input = bookingInputs[tutor.id] || { topic: '', date: today, time: '' };
            return (
              <div key={tutor.id} className="bg-white p-4 mb-4 rounded shadow-md">
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={tutor.profilePhoto || "https://via.placeholder.com/60"}
                    alt={tutor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{tutor.name}</h2>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          color={i < Math.round(tutor.rating || 0) ? "#facc15" : "#d1d5db"}
                        />
                      ))}
                      <span className="ml-2 text-gray-500 text-sm">{tutor.reviewsCount || 0} reviews</span>
                    </div>
                  </div>
                </div>

                <p>
                  <strong>Subjects:</strong>{' '}
                  {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : tutor.subjects || 'N/A'}
                </p>
                <p><strong>Experience:</strong> {tutor.experience || 'N/A'} yrs</p>
                <p><strong>Price:</strong> K{tutor.price || 'N/A'}/hr</p>
                <p>
                  <strong>Availability:</strong>{' '}
                  {Array.isArray(tutor.availability) ? tutor.availability.join(', ') : tutor.availability || 'N/A'}
                </p>

                {/* Booking Inputs */}
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Topic"
                    value={input.topic}
                    onChange={e => handleInputChange(tutor.id, 'topic', e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    type="date"
                    value={input.date}
                    min={today}
                    onChange={e => handleInputChange(tutor.id, 'date', e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    type="time"
                    value={input.time}
                    onChange={e => handleInputChange(tutor.id, 'time', e.target.value)}
                    className="p-2 border rounded"
                  />
                </div>
                <button
                  onClick={() => handleBookingSubmit(tutor)}
                  disabled={submitStatus.loading}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {submitStatus.loading ? 'Booking...' : 'Book Session'}
                </button>
              </div>
            );
          })
        )}

        {/* My Booked Sessions */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">My Booked Sessions</h2>
        {loading.bookings ? (
          <p>Loading your sessions...</p>
        ) : bookings.length === 0 ? (
          <p>You haven't booked any sessions yet.</p>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="booked-session-card bg-white p-4 rounded shadow-md mb-3">
              <p><strong>Tutor:</strong> {booking.tutor_name}</p>
              <p><strong>Date:</strong> {booking.session_time?.split('T')[0]}</p>
              <p><strong>Time:</strong> {booking.session_time?.split('T')[1]?.slice(0,5)}</p>
              <p><strong>Topic:</strong> {booking.topic}</p>
              <ApprovedSessionActions session={booking} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BookSession;
