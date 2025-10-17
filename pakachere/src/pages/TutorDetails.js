import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const BASE_URL = 'https://tutorbackend-tr3q.onrender.com';

const TutorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorAndReviews = async () => {
      try {
        // Fetch all tutors and find the one with matching id
        const resTutors = await fetch(`${BASE_URL}/api/tutors/`);
        const dataTutors = await resTutors.json();
        const foundTutor = (dataTutors.tutors || []).find(t => t.id === Number(id));

        if (foundTutor) setTutor(foundTutor);
        else setTutor({
          id,
          name: 'Unknown Tutor',
          subjects: [],
          bio: 'No details available',
        });

        // Fetch reviews for this tutor
        const resReviews = await fetch(`${BASE_URL}/api/reviews?tutorId=${id}`);
        const dataReviews = await resReviews.json();
        setReviews(dataReviews.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorAndReviews();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || review.trim() === '') {
      alert('Please provide both rating and review.');
      return;
    }

    const newReview = { id: Date.now(), rating, comment: review };
    setReviews(prev => [newReview, ...prev]);
    setRating(0);
    setReview('');
  };

  if (loading) return <p className="text-center mt-6">Loading tutor details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">{tutor.name}</h1>
      <p><b>Subjects:</b> {tutor.subjects?.join(', ') || 'N/A'}</p>
      <p><b>Experience:</b> {tutor.experience ? `${tutor.experience} years` : 'N/A'}</p>
      <p><b>Price:</b> {tutor.price ? `$${tutor.price}/hr` : 'N/A'}</p>
      <p><b>Availability:</b> {tutor.availability?.join(', ') || 'N/A'}</p>
      <p className="mt-2">{tutor.bio}</p>

      {tutor.rating && (
        <div className="flex items-center mt-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} size={18} color={i < Math.round(tutor.rating) ? '#facc15' : '#d1d5db'} />
          ))}
          <span className="ml-2 text-gray-500">{tutor.rating.toFixed(1)} ({tutor.reviewsCount || 0} reviews)</span>
        </div>
      )}

      <button
        onClick={() => navigate(`/book-session/${tutor.id}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
      >
        Book a Session
      </button>

      <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={24}
            color={i < rating ? '#facc15' : '#d1d5db'}
            onClick={() => setRating(i + 1)}
            className="cursor-pointer mr-1"
          />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your review..."
          value={review}
          onChange={e => setReview(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows={4}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Review
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-6 mb-2">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(r => (
          <div key={r.id} className="border p-2 rounded mb-2">
            <div className="flex mb-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={16} color={i < r.rating ? '#facc15' : '#d1d5db'} />
              ))}
            </div>
            <p>{r.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TutorDetails;
