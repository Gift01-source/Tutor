import React, { useState, useEffect } from "react";
import axios from "axios";
import "./pages.css";

function StudentProfile() {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    institution: "",
    course: "",
    goals: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const baseUrl = "https://tutorbackend-tr3q.onrender.com/api/students";

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(`${baseUrl}/profile/${email}`)
        .then((res) => setStudent(res.data))
        .catch(() => console.log("No profile found yet"));
    }
  }, []);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post(`${baseUrl}/upload-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStudent((prev) => ({ ...prev, avatar: res.data.avatarUrl }));
      setMessage("Avatar uploaded successfully!");
    } catch {
      setMessage("Failed to upload image.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/profile`, student);
      setMessage(res.data.message);
    } catch {
      setMessage("Error saving profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">🎓 Student Profile</h2>

        <div className="avatar-container">
          <img
            src={avatarPreview || student.avatar || "https://via.placeholder.com/120"}
            alt="avatar"
            className="avatar-img"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="file-input" />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="name"
            value={student.name}
            placeholder="Full Name"
            onChange={handleChange}
            className="input"
          />
          <input
            type="email"
            name="email"
            value={student.email}
            placeholder="Email"
            onChange={handleChange}
            className="input"
          />
          <input
            type="text"
            name="institution"
            value={student.institution}
            placeholder="Institution"
            onChange={handleChange}
            className="input"
          />
          <input
            type="text"
            name="course"
            value={student.course}
            placeholder="Course"
            onChange={handleChange}
            className="input"
          />
          <textarea
            name="goals"
            value={student.goals}
            placeholder="Your learning goals..."
            onChange={handleChange}
            className="textarea"
          />
        </div>

        <button className="button" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>

        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}

export default StudentProfile;
