import React, { useState } from "react";

const StudentProfile = () => {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    institution: "",
    course: "",
    goals: "",
    notifications: true,
  });
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    alert("Profile saved successfully!");
    // You can send data to backend here with axios.post('/api/student', student)
  };

  return (
    <div className="profile-page" style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem 1rem" }}>
      <div className="profile-form" style={{ width: "100%", maxWidth: 550, background: "#fff", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "24px 20px" }}>
        {/* Header */}
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#2563eb",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Student Profile
        </h1>

        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${
                student.name || "Student"
              }&background=2563eb&color=fff`
            }
            alt="avatar"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "3px solid #2563eb",
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{
              display: "block",
              margin: "10px auto 0",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label style={labelStyle}>Institution</label>
            <input
              type="text"
              name="institution"
              value={student.institution}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Your university or school"
            />
          </div>

          <div>
            <label style={labelStyle}>Course / Program</label>
            <input
              type="text"
              name="course"
              value={student.course}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Your course name"
            />
          </div>

          <div>
            <label style={labelStyle}>Learning Goals</label>
            <textarea
              name="goals"
              value={student.goals}
              onChange={handleChange}
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              placeholder="Describe your learning goals..."
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              name="notifications"
              checked={student.notifications}
              onChange={handleChange}
              style={{ width: 18, height: 18 }}
            />
            <label style={{ fontSize: "1rem", color: "#444" }}>
              Enable Email Notifications
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button
            onClick={handleSave}
            style={{
              background: "#2563eb",
              color: "#fff",
              fontWeight: "600",
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#1e40af")}
            onMouseOut={(e) => (e.target.style.background = "#2563eb")}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: "600",
  color: "var(--label-color, #333)",
  fontSize: "0.95rem",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ccc",
  fontSize: "1rem",
  outline: "none",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--input-color, #222)",
};

export default StudentProfile;
