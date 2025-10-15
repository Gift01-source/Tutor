import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const TutorDetails = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const tutor = {
    id,
    name: 'Ms. Jane Doe',
    subject: 'Mathematics',
    bio: 'Experienced math tutor with over 5 years of teaching high school and college students.',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You rated ${tutor.name} ${rating} stars and said: "${review}"`);
    setRating(0);
    setReview('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ color: '#2563eb' }}>{tutor.name}</h1>
      <p><b>Subject:</b> {tutor.subject}</p>
      <p style={{ maxWidth: 500 }}>{tutor.bio}</p>

      <h3 style={{ marginTop: 20 }}>Leave a Review</h3>
      <div style={{ marginBottom: 8 }}>
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={24}
            color={i < rating ? '#facc15' : '#d1d5db'}
            onClick={() => setRating(i + 1)}
            style={{ cursor: 'pointer', marginRight: 4 }}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 500,
            height: 80,
            padding: 8,
            borderRadius: 6,
            border: '1px solid #ccc',
            marginBottom: 8
          }}
        />
        <br />
        <button type="submit" style={{ ...buttonStyle, background: '#2563eb' }}>
          Submit Review
        </button>
      </form>
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
};

export default TutorDetails;
