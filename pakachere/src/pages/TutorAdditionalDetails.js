import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image.png';
import './pages.css';

function TutorDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjects: '',
    experience: '',
    price: '',
    availability: [],
    profilePhoto: null,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      setFormData((prev) => ({ ...prev, profilePhoto: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvailabilityChange = (day, slot) => {
    const key = `${day}-${slot}`;
    setFormData((prev) => {
      const newAvailability = prev.availability.includes(key)
        ? prev.availability.filter((item) => item !== key)
        : [...prev.availability, key];
      return { ...prev, availability: newAvailability };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.subjects || !formData.experience || !formData.price) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      const formPayload = new FormData();
      formPayload.append('userId', userId);
      formPayload.append('subjects', formData.subjects);
      formPayload.append('experience', formData.experience);
      formPayload.append('price', formData.price);
      formPayload.append('availability', JSON.stringify(formData.availability));

      if (formData.profilePhoto) {
        formPayload.append('profilePhoto', formData.profilePhoto);
      }

      const res = await fetch(
        'https://supreme-train-pjpvw497vvqqf7559-5000.app.github.dev/api/tutors/details',
        {
          method: 'POST',
          body: formPayload,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed: ${text}`);
      }

      navigate('/tutor-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <img src={logo} alt="App Logo" className="logo" />
        <h2 className="title">Complete Tutor Profile</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="subjects"
            placeholder="Subjects (comma-separated)"
            className="input"
            value={formData.subjects}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="experience"
            placeholder="Years of Experience"
            className="input"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price per Hour"
            className="input"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
          />

          {/* Profile Photo Upload */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{ fontWeight: '500', marginBottom: '4px', display: 'block' }}
            >
              Upload Profile Photo
            </label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="input"
              style={{ padding: '8px', cursor: 'pointer' }}
            />
          </div>

          {/* Availability Section */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontWeight: '500', marginBottom: '4px', display: 'block' }}>
              Availability
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {weekdays.map((day) =>
                timeSlots.map((slot) => {
                  const key = `${day}-${slot}`;
                  const selected = formData.availability.includes(key);
                  return (
                    <div
                      key={key}
                      onClick={() => handleAvailabilityChange(day, slot)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${selected ? '#2563eb' : '#ccc'}`,
                        backgroundColor: selected ? '#2563eb' : '#fff',
                        color: selected ? '#fff' : '#000',
                        cursor: 'pointer',
                        fontSize: '14px',
                        userSelect: 'none',
                      }}
                    >
                      {day} {slot}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="button">
            {isSubmitting ? 'Submitting...' : 'Submit Details'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TutorDetails;
