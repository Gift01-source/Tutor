import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ApprovedSessionActions from '../components/ApprovedSessionActions';
import { format } from 'date-fns';


function BookSession() {
  const [form, setForm] = useState({
    tutorId: '',
    date: '',
    time: '',
    topic: '',
  });

  const [tutors, setTutors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState({
    tutors: true,
    bookings: true
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  useEffect(() => {
    // Sample tutors fallback
    const sampleTutors = [
      { id: 1, name: 'Ms. Jane', subject: 'Mathematics', email: 'Dedza Secondary School' },
      { id: 2, name: 'Mr. John Banda', subject: 'English Literature', email: 'MUST' },
      { id: 3, name: 'Mrs. Emily Waya', subject: 'Science', email: 'COM' },
      { id: 4, name: 'Dr. Alex Kim', subject: 'Physics', email: 'UNIMA' },
      { id: 5, name: 'Prof. Sara Brown', subject: 'Chemistry', email: 'MUBAS' }
    ];
    setTutors(sampleTutors);
    setLoading(prev => ({ ...prev, tutors: false }));

    // Load bookings from localStorage
    const storedBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
    setBookings(storedBookings);
    setLoading(prev => ({ ...prev, bookings: false }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.tutorId) newErrors.tutorId = 'Please select a tutor';
    if (!form.date) newErrors.date = 'Please select a date';
    if (!form.time) newErrors.time = 'Please select a time';
    if (!form.topic.trim()) {
      newErrors.topic = 'Please enter a module/subject and what you want to learn';
    } else if (form.topic.trim().length < 5) {
      newErrors.topic = 'Module/subject should be at least 5 characters';
    }
    if (form.date && form.time) {
      const selectedDateTime = new Date(`${form.date}T${form.time}`);
      if (selectedDateTime < new Date()) {
        newErrors.date = 'Please select a future date and time';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitStatus({ loading: true, success: false, error: null });

    // Combine date and time into ISO string
    const session_time = new Date(`${form.date}T${form.time}`).toISOString();

    // Create new booking object
    const newBooking = {
      id: Date.now(),
      tutorId: form.tutorId,
      tutor_name: tutors.find(t => t.id === Number(form.tutorId))?.name || '',
      session_time,
      topic: form.topic,
      status: 'pending',
      student_name: 'Student',
    };

    // Save to localStorage
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('my_bookings', JSON.stringify(updatedBookings));
    localStorage.setItem('all_bookings', JSON.stringify(updatedBookings));

    setSubmitStatus({
      loading: false,
      success: 'Session booked successfully!',
      error: null
    });
    setForm({ tutorId: '', date: '', time: '', topic: '' });
    setTimeout(() => {
      setSubmitStatus(prev => ({ ...prev, success: null }));
    }, 3000);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div>
      {<Navbar role="student" />}
      <div className="min-h-screen bg-blue-50 p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Book a Session</h1>

        {/* Status Messages */}
        {submitStatus.success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {submitStatus.success}
          </div>
        )}
        {submitStatus.error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {submitStatus.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <label>Select Tutor</label>
          <select
            name="tutorId"
            value={form.tutorId}
            onChange={handleChange}
            disabled={loading.tutors}
          >
            <option value=""> Select Tutor </option>
            {loading.tutors ? (
              <option disabled>Loading tutors...</option>
            ) : (
              tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.name} ({tutor.email})
                </option>
              ))
            )}
          </select>
          {errors.tutorId && <p className="error">{errors.tutorId}</p>}

          <div style={{display:'flex', gap:16}}>
            <div style={{flex:1}}>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={today}
              />
              {errors.date && <p className="error">{errors.date}</p>}
            </div>
            <div style={{flex:1}}>
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
              {errors.time && <p className="error">{errors.time}</p>}
            </div>
          </div>

          <label>Topic</label>
          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            placeholder="What do you want to learn?"
          />
          {errors.topic && <p className="error">{errors.topic}</p>}

          <button type="submit" disabled={submitStatus.loading}>
            {submitStatus.loading ? 'Booking Session...' : 'Book Session'}
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Booked Sessions</h2>

        {loading.bookings ? (
          <div style={{textAlign:'center', padding:'32px 0'}}>
            <div className="animate-spin" style={{width:40, height:40, border:'4px solid #2563eb', borderTop:'4px solid #fff', borderRadius:'50%', margin:'0 auto'}}></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="booked-session-card">
            <p>You haven't booked any sessions yet.</p>
            <p style={{color:'#888'}}>Book your first session using the form above!</p>
          </div>
        ) : (
          <div>
            {bookings.map((booking) => (
              <div key={booking.id} className="booked-session-card">
                <p><span className="session-label">Tutor:</span> {booking.tutor_name || booking.tutorId}</p>
                <p><span className="session-label">Date:</span> {booking.session_time ? booking.session_time.split('T')[0] : ''}</p>
                <p><span className="session-label">Time:</span> {booking.session_time ? booking.session_time.split('T')[1].slice(0,5) : ''}</p>
                <p><span className="session-label">Topic:</span> {booking.topic}</p>
                <ApprovedSessionActions session={booking} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookSession;