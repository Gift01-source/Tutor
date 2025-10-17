import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ApprovedSessionActions from '../components/ApprovedSessionActions';
import { format } from 'date-fns';

const BASE_URL = 'https://tutorbackend-tr3q.onrender.com';

function BookSession() {
  const studentName = 'Student'; // Replace with logged-in student info if available
  const today = format(new Date(), 'yyyy-MM-dd');

  // Tutors and bookings
  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState({ tutors: true, bookings: true });
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: null, error: null });

  // Booking inputs per tutor
  const [bookingInputs, setBookingInputs] = useState({});

  // Fetch tutors and student bookings
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

  // Update input fields for a specific tutor
  const handleInputChange = (tutorId, field, value) => {
    setBookingInputs(prev => ({
      ...prev,
      [tutorId]: { ...prev[tutorId], [field]: value }
    }));
  };

  // Validate form input for a tutor
  const validateTutorInput = (input) => {
    const errors = {};
    if (!input.topic || input.topic.trim().length < 5) errors.topic = 'Topic must be at least 5 characters';
    if (!input.date) errors.date = 'Select a date';
    if (!input.time) errors.time = 'Select a time';

    if (input.date && input.time) {
      const dt = new Date(`${input.date}T${input.time}`);
      if (dt < new Date()) errors.date = 'Select a future date and time';
    }

    return errors;
  };

  // Submit booking for a tutor
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

      setBookings(prev => [...prev, data.session]);
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

        {submitStatus.success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{submitStatus.success}</div>}
        {submitStatus.error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{submitStatus.error}</div>}

        {/* Tutors List */}
        {loading.tutors ? (
          <p>Loading tutors...</p>
        ) : (
          tutors.map(tutor => {
            const input = bookingInputs[tutor.id] || { topic: '', date: today, time: '' };
            return (
              <div key={tutor.id} className="bg-white p-4 mb-4 rounded shadow-md">
                <h2 className="text-xl font-semibold">{tutor.name}</h2>
                <p><strong>Subjects:</strong> {tutor.subjects?.join(', ') || 'N/A'}</p>
                <p><strong>Experience:</strong> {tutor.experience || 'N/A'}</p>
                <p><strong>Price:</strong> {tutor.price ? `$${tutor.price}/hr` : 'N/A'}</p>
                <p><strong>Availability:</strong> {tutor.availability?.join(', ') || 'N/A'}</p>

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
              <p><strong>Tutor:</strong> {booking.tutor_name || booking.tutorId}</p>
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
