import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaEye, FaCommentDots } from "react-icons/fa";

const TutorSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = "https://tutorbackend-tr3q.onrender.com";

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/tutors/all`);
        if (!response.ok) throw new Error("Failed to load tutors");
        const data = await response.json();

        const normalizedTutors = (data.tutors || []).map((t) => ({
          id: t.id,
          userId: t.userId || t.id,
          name: t.name || "Unnamed Tutor",
          subjects: Array.isArray(t.subjects)
            ? t.subjects.join(", ")
            : t.subjects || "Not specified",
          bio: t.bio || "No bio available",
          experience: t.experience || "N/A",
          price: t.price || "N/A",
          rating: t.rating || 4,
          reviewsCount: t.reviewsCount || 0,
          photo: t.profilePhoto || "https://via.placeholder.com/100?text=Tutor",
        }));

        setTutors(normalizedTutors);
      } catch (err) {
        console.error(err);
        setError("Unable to load tutors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter((tutor) =>
    `${tutor.name} ${tutor.subjects}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading tutors...</p>;

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>{error}</p>
    );

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem", color: "#2563eb", textAlign: "center" }}>
        Find a Tutor
      </h1>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search by name or subject"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: 20,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: 500,
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />

      {/* Tutor Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="tutor-card"
              style={{
                padding: 15,
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                background: "#fff",
                textAlign: "center",
                transition: "0.3s ease",
              }}
            >
              {/* Profile Photo */}
              <img
                src={tutor.photo}
                alt={tutor.name}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #2563eb",
                  marginBottom: 8,
                }}
              />

              {/* Name and Subjects */}
              <h2 style={{ color: "#2563eb", marginBottom: 4, fontSize: "0.95rem" }}>
                {tutor.name}
              </h2>
              <p style={{ color: "#555", marginBottom: 4, fontSize: "0.8rem" }}>
                {tutor.subjects}
              </p>
              <p style={{ color: "#555", marginBottom: 4, fontSize: "0.75rem" }}>
                {tutor.bio}
              </p>

              {/* Experience & Price */}
              <p style={{ color: "#777", marginBottom: 2, fontSize: "0.75rem" }}>
                Exp: {tutor.experience} yrs
              </p>
              <p style={{ color: "#777", marginBottom: 6, fontSize: "0.75rem" }}>
                Price: {tutor.price !== "N/A" ? `K${tutor.price}/hr` : "Not listed"}
              </p>

              {/* Rating */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 6,
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(tutor.rating) ? "#facc15" : "#d1d5db"}
                    size={14}
                  />
                ))}
                <span style={{ marginLeft: 4, color: "#888", fontSize: "0.7rem" }}>
                  {tutor.rating.toFixed(1)} ({tutor.reviewsCount} reviews)
                </span>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                  marginTop: "6px",
                }}
              >
                <button
                  onClick={() => navigate(`/view-tutor-details/${tutor.userId}`)}
                  style={buttonStyle}
                >
                  <FaEye style={{ marginRight: 4 }} /> Details
                </button>

                <button
                  onClick={() => navigate(`/messages?tutor=${tutor.id}`)}
                  style={{ ...buttonStyle, background: "#22c55e" }}
                >
                  <FaCommentDots style={{ marginRight: 4 }} /> Msg
                </button>

                {/* Live Session Button */}
                <button
                  onClick={() => navigate(`/video?tutor=${tutor.id}`)}
                  style={{ ...buttonStyle, background: "#ef4444" }}
                >
                  🎥 Live
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No tutors found.</p>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "0.8rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s ease",
};

export default TutorSearch;
