import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaEye, FaCommentDots } from 'react-icons/fa';

const TutorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Sample tutors list (you can later fetch this from backend)
  const sampleTutors = [
    { id: 1, name: 'Ms. Jane Doe', subject: 'Mathematics', rating: 4.8, reviews: 12 },
    { id: 2, name: 'Mr. John Smith', subject: 'English Literature', rating: 4.6, reviews: 9 },
    { id: 3, name: 'Mrs. Emily Brown', subject: 'Science', rating: 4.9, reviews: 20 },
    { id: 4, name: 'Dr. Alex Kim', subject: 'Physics', rating: 4.7, reviews: 7 },
    { id: 5, name: 'Prof. Sara Lee', subject: 'Poetry', rating: 4.5, reviews: 15 }
  ];

  const filteredTutors = sampleTutors.filter((tutor) =>
    `${tutor.name} ${tutor.subject}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ marginBottom: '1rem', color: '#2563eb' }}>Find a Tutor</h1>
      <input
        type="text"
        placeholder="Search by name or subject"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: 16,
          padding: 8,
          borderRadius: 8,
          border: '1px solid #ccc',
          width: '100%',
          maxWidth: 400
        }}
      />
      <div>
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="tutor-card"
              style={{
                marginBottom: 16,
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                background: '#fff'
              }}
            >
              <h2 style={{ color: '#2563eb', marginBottom: 4 }}>{tutor.name}</h2>
              <p style={{ color: '#555', marginBottom: 8 }}>Subject: {tutor.subject}</p>

              {/* Rating Display */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(tutor.rating) ? '#facc15' : '#d1d5db'}
                    size={18}
                  />
                ))}
                <span style={{ marginLeft: 8, color: '#888', fontSize: '0.9rem' }}>
                  {tutor.rating.toFixed(1)} ({tutor.reviews} reviews)
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => navigate(`/tutor/${tutor.id}`)}
                  style={buttonStyle}
                >
                  <FaEye style={{ marginRight: 6 }} /> View Details
                </button>

                <button
                  onClick={() => navigate(`/messages?tutor=${tutor.id}`)}
                  style={{ ...buttonStyle, background: '#22c55e' }}
                >
                  <FaCommentDots style={{ marginRight: 6 }} /> Message
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tutors found.</p>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  transition: '0.2s ease',
};

export default TutorSearch;
