import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const BASE_URL = "https://tutorbackend-tr3q.onrender.com/api/tutors";

const TutorDetailsView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        if (!userId) throw new Error("Invalid tutor ID");

        // Fetch tutor profile by userId
        const resTutor = await fetch(`${BASE_URL}/profile/${userId}`);
        if (!resTutor.ok) throw new Error("Failed to fetch tutor details");
        const dataTutor = await resTutor.json();

        // Ensure we have internal tutor id for reviews
        const tutorId = dataTutor.id || dataTutor.userId;

        setTutor({ ...dataTutor, id: tutorId });

        // Fetch reviews by tutor id
        const resReviews = await fetch(`${BASE_URL}/${tutorId}/reviews`);
        if (!resReviews.ok) throw new Error("Failed to fetch reviews");
        const dataReviews = await resReviews.json();
        setReviews(dataReviews.reviews || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load tutor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [userId]);

  const handleSubmitReview = async () => {
    if (!newReview.trim() || rating === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/${tutor.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newReview, rating }),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      const savedReview = await res.json();

      setReviews([savedReview.review, ...reviews]);
      setNewReview("");
      setRating(0);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading tutor details...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
  if (!tutor) return <p className="text-center mt-6">Tutor not found.</p>;

  const subjectsArray = Array.isArray(tutor.subjects) ? tutor.subjects : (tutor.subjects || "").split(",");
  const availabilityArray = Array.isArray(tutor.availability) ? tutor.availability : (tutor.availability || "").split(",");

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white shadow rounded">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={tutor.profilePhoto || "https://via.placeholder.com/80"}
          alt={`${tutor.name} profile`}
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h1 className="text-3xl font-bold text-blue-600">{tutor.name}</h1>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={16} color={i < Math.round(tutor.rating || 0) ? "#facc15" : "#d1d5db"} />
            ))}
            <span className="ml-2 text-gray-500">
              {(tutor.rating || 0).toFixed(1)} ({tutor.reviewsCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Tutor info */}
      <div className="mb-4">
        <p><b>Subjects:</b> {subjectsArray.join(", ") || "N/A"}</p>
        <p><b>Experience:</b> {tutor.experience ? `${tutor.experience} years` : "N/A"}</p>
        <p><b>Price:</b> {tutor.price ? `K${tutor.price}/hr` : "N/A"}</p>
        <p><b>Availability:</b> {availabilityArray.join(", ") || "N/A"}</p>
        <p className="mt-2">{tutor.bio}</p>
      </div>

      <button
        onClick={() => navigate(`/book-session/${tutor.userId}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
      >
        Book a Session
      </button>

      {/* Reviews Section */}
      <h2 className="text-xl font-semibold mb-2">Reviews</h2>

      {/* Typing area */}
      <div className="mb-4 p-3 border rounded bg-gray-50">
        <p className="mb-1 font-semibold">Leave a Review</p>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={20}
              color={i < rating ? "#facc15" : "#d1d5db"}
              className="cursor-pointer"
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Write your review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSubmitReview}
          disabled={submitting}
        >
          Submit Review
        </button>
      </div>

      {/* Reviews list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border p-3 rounded bg-gray-50">
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={16} color={i < r.rating ? "#facc15" : "#d1d5db"} />
                ))}
                <span className="ml-2 font-semibold text-gray-700">{r.userName || "Anonymous"}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TutorDetailsView;
