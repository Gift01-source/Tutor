import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

function TutorProfile() {
  const { tutorId } = useParams();
  const [reviews, setReviews] = useState(
    () => JSON.parse(localStorage.getItem(`reviews_${tutorId}`) || "[]")
  );
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleAddReview = () => {
    if (rating < 1 || !reviewText.trim()) return;
    const updated = [
      ...reviews,
      { rating, text: reviewText, date: new Date().toLocaleDateString() },
    ];
    setReviews(updated);
    localStorage.setItem(`reviews_${tutorId}`, JSON.stringify(updated));
    setRating(0);
    setReviewText("");
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center mb-6">
          Tutor Profile
        </h1>

        <TutorAvatar tutorId={tutorId} />

        <TutorInfoForm tutorId={tutorId} />

        {/* Reviews Section */}
        <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-300">
          <h3 className="text-lg sm:text-xl font-bold text-yellow-600 mb-2">
            Ratings & Reviews
          </h3>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-yellow-500 font-bold text-lg sm:text-xl">
              {avgRating ? `${avgRating}/5` : "No ratings yet"}
            </span>
            <span className="text-gray-500 text-sm">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-xl sm:text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } transition-colors duration-200`}
                />
              ))}
            </div>

            <input
              type="text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleAddReview}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Submit
            </button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-500 font-medium">
              No reviews yet. Be the first to review this tutor!
            </p>
          ) : (
            <div className="space-y-2">
              {reviews.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 p-2 sm:p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-500 font-bold">
                      ★ {r.rating}
                    </span>
                    <span className="text-sm text-gray-500">{r.date}</span>
                  </div>
                  <p className="text-gray-700 mt-1">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TutorProfile;

// ===================================
// Avatar + Drag & Drop Certificates
// ===================================
function TutorAvatar({ tutorId }) {
  const [avatar, setAvatar] = useState(
    localStorage.getItem(`tutor_avatar_${tutorId}`) || null
  );
  const [certificates, setCertificates] = useState(
    JSON.parse(localStorage.getItem(`tutor_certs_${tutorId}`) || "[]")
  );

  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      localStorage.setItem(`tutor_avatar_${tutorId}`, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    uploadCertificates(files);
  };

  const handleCertUpload = (e) => {
    const files = Array.from(e.target.files);
    uploadCertificates(files);
  };

  const uploadCertificates = (files) => {
    const newCerts = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    const updated = [...certificates, ...newCerts];
    setCertificates(updated);
    localStorage.setItem(`tutor_certs_${tutorId}`, JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <img
        src={
          avatar ||
          `https://ui-avatars.com/api/?name=Tutor+${tutorId}&background=2563eb&color=fff`
        }
        alt="Avatar"
        className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mb-3"
      />
      <input type="file" accept="image/*" onChange={handleAvatarChange} />

      <div
        className="mt-4 w-full sm:w-3/4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        <p className="text-gray-600">Drag & drop certificates here or click to upload</p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleCertUpload}
          className="hidden"
          ref={fileInputRef}
        />
      </div>

      {certificates.length > 0 && (
        <ul className="mt-2 list-disc list-inside text-gray-600 w-full sm:w-3/4">
          {certificates.map((c, idx) => (
            <li key={idx}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words"
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===================================
// Tutor Info Form - Mobile Friendly
// ===================================
function TutorInfoForm({ tutorId }) {
  const defaultForm = {
    fullName: "",
    email: "",
    phone: "",
    subjects: "",
    bio: "",
    education: "",
    experience: "",
    teachingStyle: "",
    preferredMode: "Online",
    location: "",
    hourlyRate: "",
    availableDays: "",
    availableTimes: "",
    contactPreference: "Email",
  };

  const [form, setForm] = useState(() => {
    const stored = localStorage.getItem(`tutor_info_${tutorId}`);
    return stored ? JSON.parse(stored) : defaultForm;
  });

  const [editing, setEditing] = useState(!localStorage.getItem(`tutor_info_${tutorId}`));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(`tutor_info_${tutorId}`, JSON.stringify(form));
    setEditing(false);
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200 mb-6">
      <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3">
        Tutor Information
      </h3>

      {editing ? (
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={handleSave}>
          {Object.keys(form).map((key) => {
            const isTextarea = ["bio", "teachingStyle"].includes(key);
            const isSelect = ["preferredMode", "contactPreference"].includes(key);
            if (isTextarea)
              return (
                <textarea
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={key.replace(/([A-Z])/g, " $1")}
                  rows={2}
                  className="input col-span-1 sm:col-span-2"
                />
              );
            if (isSelect) {
              const options =
                key === "preferredMode"
                  ? ["Online", "In-person", "Hybrid"]
                  : ["Email", "Phone", "WhatsApp"];
              return (
                <select
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="input"
                >
                  {options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              );
            }
            return (
              <input
                key={key}
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                className="input"
              />
            );
          })}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg col-span-1 sm:col-span-2 hover:bg-blue-700 mt-2"
          >
            Save Profile
          </button>
        </form>
      ) : (
        <div className="space-y-2 text-gray-700">
          {Object.entries(form).map(([key, value]) => (
            <p key={key}>
              <strong className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
              {value || <span className="text-gray-400">Not set</span>}
            </p>
          ))}
          <button
            onClick={() => setEditing(true)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Edit Info
          </button>
        </div>
      )}
    </div>
  );
}
