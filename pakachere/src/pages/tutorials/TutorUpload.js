import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUpload, FaFileVideo, FaFileAlt } from "react-icons/fa";
import "./TutorUpload.css";

export default function TutorUpload() {
  const { tutorId: routeTutorId } = useParams();
  const tutorId = routeTutorId || "tutor-123";

  const [uploaderName, setUploaderName] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoDescription, setVideoDescription] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [paperFile, setPaperFile] = useState(null);
  const [paperDescription, setPaperDescription] = useState("");

  const [message, setMessage] = useState("");
  const [uploadingType, setUploadingType] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pastVideos, setPastVideos] = useState([]);
  const [pastPapers, setPastPapers] = useState([]);

  const API_BASE =
    "https://tutorbackend-tr3q.onrender.com/api/tutors";

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_BASE}/${tutorId}/videos`);
      const data = await res.json();
      // Ensure full URL for video playback
      const videos = (data || []).map((v) => ({
        ...v,
        url: v.url.startsWith("http") ? v.url : `${API_BASE}/uploads/videos/${v.url}`,
      }));
      setPastVideos(videos);
    } catch {
      console.log("Failed to load videos");
    }
  };

  const fetchPapers = async () => {
    try {
      const res = await fetch(`${API_BASE}/${tutorId}/papers`);
      const data = await res.json();
      const papers = (data || []).map((p) => ({
        ...p,
        url: p.url.startsWith("http") ? p.url : `${API_BASE}/uploads/papers/${p.url}`,
      }));
      setPastPapers(papers);
    } catch {
      console.log("Failed to load papers");
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchPapers();
  }, [tutorId]);

  const handleUpload = async (type) => {
    const isVideo = type === "video";
    const title = isVideo ? videoTitle : paperTitle;
    const file = isVideo ? videoFile : paperFile;
    const description = isVideo ? videoDescription : paperDescription;

    if (!title || !file) {
      showMsg("Please provide a title and select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("uploader", uploaderName || "Tutor");
    formData.append("description", description);
    formData.append("file", file);

    setUploadingType(type);
    setProgress(0);

    const endpoint = `${API_BASE}/${tutorId}/${isVideo ? "videos" : "papers"}`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploadingType(null);
      setProgress(0);
      if (xhr.status === 200) {
        showMsg(`${isVideo ? "Video" : "Paper"} uploaded successfully!`);
        if (isVideo) fetchVideos();
        else fetchPapers();
      } else {
        showMsg("Upload failed: " + xhr.responseText);
      }

      if (isVideo) {
        setVideoTitle("");
        setVideoFile(null);
        setVideoDescription("");
      } else {
        setPaperTitle("");
        setPaperFile(null);
        setPaperDescription("");
      }
    };

    xhr.onerror = () => {
      setUploadingType(null);
      setProgress(0);
      showMsg("Upload error. Please check backend connection.");
    };

    xhr.send(formData);
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1>🎬 Tutor Studio</h1>
        <p>Upload your tutorial videos or notes</p>
      </div>

      {message && <div className="upload-message">{message}</div>}

      <div className="upload-sections">
        {/* Video Upload */}
        <div className="upload-card">
          <div className="upload-card-header">
            <FaFileVideo size={22} />
            <h2>Upload Video</h2>
          </div>

          <input
            type="text"
            placeholder="Video title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Video description"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            className="input-field"
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="input-field"
          />
          {videoFile && (
            <video
              src={URL.createObjectURL(videoFile)}
              controls
              width="100%"
              className="preview-video"
            />
          )}

          <button
            className="upload-btn"
            onClick={() => handleUpload("video")}
            disabled={uploadingType === "video"}
          >
            {uploadingType === "video" ? "Uploading..." : <><FaUpload /> Upload Video</>}
          </button>

          {uploadingType === "video" && (
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          )}

          <div className="uploaded-list">
            {pastVideos.map((v, i) => (
              <div className="uploaded-item" key={i}>
                <video src={v.url} controls width="300" />
                <p>{v.title}</p>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    if (window.confirm("Delete this video?")) {
                      try {
                        await fetch(`${API_BASE}/${tutorId}/videos/${v.id}`, { method: "DELETE" });
                        fetchVideos();
                      } catch (err) {
                        console.log("Failed to delete video", err);
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Paper Upload */}
        <div className="upload-card">
          <div className="upload-card-header">
            <FaFileAlt size={22} />
            <h2>Upload Paper</h2>
          </div>

          <input
            type="text"
            placeholder="Paper title"
            value={paperTitle}
            onChange={(e) => setPaperTitle(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Paper description"
            value={paperDescription}
            onChange={(e) => setPaperDescription(e.target.value)}
            className="input-field"
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setPaperFile(e.target.files[0])}
            className="input-field"
          />
          {paperFile && <p className="preview-text">📄 {paperFile.name}</p>}

          <button
            className="upload-btn"
            onClick={() => handleUpload("paper")}
            disabled={uploadingType === "paper"}
          >
            {uploadingType === "paper" ? "Uploading..." : <><FaUpload /> Upload Paper</>}
          </button>

          {uploadingType === "paper" && (
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          )}

          <div className="uploaded-list">
            {pastPapers.map((p, i) => (
              <div className="uploaded-item" key={i}>
                <a href={p.url} target="_blank" rel="noreferrer">📄 {p.title}</a>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    if (window.confirm("Delete this paper?")) {
                      try {
                        await fetch(`${API_BASE}/${tutorId}/papers/${p.id}`, { method: "DELETE" });
                        fetchPapers();
                      } catch (err) {
                        console.log("Failed to delete paper", err);
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
