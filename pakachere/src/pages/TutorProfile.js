import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaEdit, FaSave, FaUpload, FaRegFileAlt } from "react-icons/fa";
import axios from "axios";
import "./pages.css";

const BACKEND_URL =
  "https://tutorbackend-tr3q.onrender.com/api/tutors";

export default function TutorProfile() {
  const { tutorId } = useParams();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subjects: "",
    hourlyRate: "",
    preferredMode: "Online",
    experience: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/profile/${tutorId}`)
      .then((res) =>
        setForm({
          fullName: res.data.name || "",
          email: res.data.email || "",
          subjects: res.data.subjects?.join(", ") || "",
          hourlyRate: res.data.price || "",
          preferredMode: res.data.preferredMode || "Online",
          experience: res.data.experience || "",
          bio: res.data.bio || "",
        })
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tutorId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <header className="relative bg-gradient-to-b from-blue-700 to-blue-800 h-44 sm:h-56 rounded-b-3xl shadow-md">
        <div className="absolute top-4 left-4">
    
        </div>
      </header>

      {/* Card */}
      <main className="max-w-4xl mx-auto -mt-20 mb-12 px-4">
        <section className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-10 space-y-8">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-36 w-36 rounded-full bg-gray-200 mx-auto" />
                <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
              </div>
            ) : (
              <>
                <TutorHeader
                  fullName={form.fullName}
                  tutorId={tutorId}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <AvatarAndCerts tutorId={tutorId} fullName={form.fullName} />
                  </div>
                  <div className="lg:col-span-2">
                    <TutorInfoForm tutorId={tutorId} form={form} setForm={setForm} />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ============================
   Header (name + subtitle)
   ============================ */
function TutorHeader({ fullName }) {
  return (
    <div className="text-center">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
        {fullName || "Unnamed Tutor"}
      </h1>
      <p className="text-sm text-gray-500 mt-1">Professional Educator</p>
    </div>
  );
}

/* ============================
   Avatar + Certificates Column
   - Upload icons visible on small screens
   - Symbol-only upload controls
   ============================ */
function AvatarAndCerts({ tutorId, fullName }) {
  const [avatar, setAvatar] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);

  useEffect(() => {
    setLoadingCerts(true);
    axios
      .get(`${BACKEND_URL}/profile/${tutorId}`)
      .then((res) => {
        setAvatar(res.data.profilePhoto || null);
        setCertificates(res.data.certificates || []);
      })
      .catch(console.error)
      .finally(() => setLoadingCerts(false));
  }, [tutorId]);

  const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    axios
      .post(`${BACKEND_URL}/upload-avatar/${tutorId}`, formData)
      .then((res) => setAvatar(res.data.avatarUrl))
      .catch(console.error);
  };

  const uploadCerts = (files) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("certificates", f));
    axios
      .post(`${BACKEND_URL}/upload-certs/${tutorId}`, formData)
      .then((res) => setCertificates(res.data.certificates))
      .catch(console.error);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAvatar(file);
  };

  const handleCertChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    uploadCerts(files);
  };

  return (
    <aside className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
          {avatar ? (
            <img src={avatar} alt={`${fullName || "Tutor"} avatar`} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <span className="text-xl font-semibold">{(fullName || "T").charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Avatar upload: symbol-only, always visible on small screens */}
        <label
          className="absolute -bottom-2 -right-2 bg-white border rounded-full p-2 shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none"
          title="Upload profile photo"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            aria-label="Upload profile photo"
          />
          <FaUpload className="text-blue-600" />
        </label>
      </div>

      <div className="mt-4 w-full">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-sm font-medium text-gray-700">Certificates</h4>

          {/* Certificate upload: symbol-only button visible on all sizes */}
          <label
            className="bg-white border rounded-full p-2 shadow-sm cursor-pointer hover:bg-gray-50 flex items-center"
            title="Upload certificates"
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={handleCertChange}
              aria-label="Upload certificates"
            />
            <FaUpload className="text-blue-600" />
          </label>
        </div>

        <div className="mt-3">
          {loadingCerts ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ) : certificates.length ? (
            <ul className="max-h-48 overflow-y-auto divide-y divide-gray-100 rounded-md border border-gray-100 p-2">
              {certificates.map((c, i) => (
                <li key={i} className="flex items-center gap-3 py-2 text-sm">
                  <FaRegFileAlt className="text-gray-400" />
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                    title={c.name}
                  >
                    {c.name}
                  </a>
                  <span className="ml-auto text-xs text-gray-400">{c.type || ""}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">No certificates uploaded</p>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ============================
   Tutor Info Form (editable)
   - fields: name, email, subjects, rate, mode, experience, bio
   - clean inputs when editing, plain text display otherwise
   ============================ */
function TutorInfoForm({ tutorId, form, setForm }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fields = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "subjects", label: "Subjects" },
    { key: "hourlyRate", label: "Hourly Rate" },
    { key: "preferredMode", label: "Preferred Mode" },
    { key: "experience", label: "Experience" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    const payload = {
      userId: tutorId,
      name: form.fullName,
      email: form.email,
      subjects: form.subjects,
      price: form.hourlyRate,
      preferredMode: form.preferredMode,
      experience: form.experience,
      bio: form.bio,
      availability: "[]",
    };
    axios
      .post(`${BACKEND_URL}/details`, payload)
      .then(() => setEditing(false))
      .catch(console.error)
      .finally(() => setSaving(false));
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Tutor Information</h3>
          <p className="text-sm text-gray-500 mt-1">Public profile details</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition ${
              editing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            aria-label={editing ? "Save tutor info" : "Edit tutor info"}
          >
            {editing ? <FaSave /> : <FaEdit />}
            {editing ? (saving ? "Saving..." : "Save") : "Edit"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs font-medium text-gray-600">{label}</label>
            {editing ? (
              <input
                name={key}
                value={form[key] ?? ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-700">{form[key] || <span className="text-gray-400">Not provided</span>}</p>
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">Bio</label>
          {editing ? (
            <textarea
              name="bio"
              value={form.bio ?? ""}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-700">{form.bio || <span className="text-gray-400">No bio provided</span>}</p>
          )}
        </div>
      </div>
    </div>
  );
}
