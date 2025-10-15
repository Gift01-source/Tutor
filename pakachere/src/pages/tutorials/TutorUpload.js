import React, { useEffect, useState } from 'react';
import './TutorUpload.css';

export default function TutorUpload() {
  const [uploaderName, setUploaderName] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [videoSubject, setVideoSubject] = useState('');
  const [videoGrade, setVideoGrade] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoPublic, setVideoPublic] = useState(true);

  const [paperTitle, setPaperTitle] = useState('');
  const [paperUrl, setPaperUrl] = useState('');
  const [paperFile, setPaperFile] = useState(null);
  const [paperSubject, setPaperSubject] = useState('');
  const [paperGrade, setPaperGrade] = useState('');
  const [paperDescription, setPaperDescription] = useState('');
  const [paperPublic, setPaperPublic] = useState(true);

  const [message, setMessage] = useState('');
  const [pastVideos, setPastVideos] = useState([]);
  const [pastPapers, setPastPapers] = useState([]);

  useEffect(() => {
    setPastVideos(JSON.parse(localStorage.getItem('tutorial_videos') || '[]'));
    setPastPapers(JSON.parse(localStorage.getItem('exam_papers') || '[]'));
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const saveVideos = (items) => {
    localStorage.setItem('tutorial_videos', JSON.stringify(items));
    setPastVideos(items);
  };

  const savePapers = (items) => {
    localStorage.setItem('exam_papers', JSON.stringify(items));
    setPastPapers(items);
  };

  // Generate thumbnail for an uploaded video File
  const generateVideoThumbnail = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      video.muted = true;
      video.playsInline = true;

      const cleanup = () => {
        try { URL.revokeObjectURL(url); } catch {}
        video.src = '';
      };

      const capture = () => {
        try {
          const canvas = document.createElement('canvas');
          const w = video.videoWidth;
          const h = video.videoHeight;
          if (!w || !h) {
            cleanup();
            return resolve(null);
          }
          const maxW = 640;
          const scale = w > maxW ? maxW / w : 1;
          canvas.width = Math.floor(w * scale);
          canvas.height = Math.floor(h * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          cleanup();
          resolve(dataUrl);
        } catch (err) {
          cleanup();
          resolve(null);
        }
      };

      const handleLoadedMeta = () => {
        // seek to a point (1s or 10% of duration)
        try {
          const t = Math.min(1, (video.duration || 0) * 0.1);
          video.currentTime = t;
        } catch {
          capture();
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMeta);
      video.addEventListener('seeked', capture);

      // fallback
      setTimeout(() => {
        if (!video.videoWidth) {
          capture();
        }
      }, 1500);
    });
  };

  // Helpers to push items into localStorage with full shape
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoTitle || (!videoUrl && !videoFile)) {
      setMessage('Please provide a title and a video URL or file.');
      return;
    }

    const current = JSON.parse(localStorage.getItem('tutorial_videos') || '[]');

    // if a file was selected, create object URL for immediate preview/usage
    let urlToSave = videoUrl;
    if (videoFile) {
      const objUrl = URL.createObjectURL(videoFile);
      urlToSave = objUrl;
    }

    // generate thumbnail if we have a file
    let thumbnail = videoThumbnail;
    if (!thumbnail && videoFile) {
      thumbnail = await generateVideoThumbnail(videoFile);
    }

    const item = {
      id: Date.now().toString(),
      title: videoTitle,
      url: urlToSave,
      uploadedAt: new Date().toISOString(),
      uploader: uploaderName || 'Tutor',
      uploaderId: uploaderName ? uploaderName.replace(/\s+/g, '_').toLowerCase() : 'tutor',
      thumbnail: thumbnail || null,
      subject: videoSubject || '',
      grade: videoGrade || '',
      description: videoDescription || '',
      public: Boolean(videoPublic),
      type: 'video',
      size: videoFile ? videoFile.size : undefined,
      filename: videoFile ? videoFile.name : undefined,
    };

    current.push(item);
    saveVideos(current);

    // clear form but preserve uploaderName
    setVideoTitle('');
    setVideoUrl('');
    setVideoFile(null);
    setVideoThumbnail(null);
    setVideoSubject('');
    setVideoGrade('');
    setVideoDescription('');
    setVideoPublic(true);
    setMessage('Video uploaded and saved locally.');
  };

  const handlePaperUpload = (e) => {
    e.preventDefault();
    if (!paperTitle || (!paperUrl && !paperFile)) {
      setMessage('Please provide a title and a paper URL or file.');
      return;
    }

    const current = JSON.parse(localStorage.getItem('exam_papers') || '[]');

    let urlToSave = paperUrl;
    if (paperFile) {
      const objUrl = URL.createObjectURL(paperFile);
      urlToSave = objUrl;
    }

    const item = {
      id: Date.now().toString(),
      title: paperTitle,
      url: urlToSave,
      uploadedAt: new Date().toISOString(),
      uploader: uploaderName || 'Tutor',
      uploaderId: uploaderName ? uploaderName.replace(/\s+/g, '_').toLowerCase() : 'tutor',
      thumbnail: null,
      subject: paperSubject || '',
      grade: paperGrade || '',
      description: paperDescription || '',
      public: Boolean(paperPublic),
      type: 'paper',
      size: paperFile ? paperFile.size : undefined,
      filename: paperFile ? paperFile.name : undefined,
    };

    current.push(item);
    savePapers(current);

    setPaperTitle('');
    setPaperUrl('');
    setPaperFile(null);
    setPaperSubject('');
    setPaperGrade('');
    setPaperDescription('');
    setPaperPublic(true);
    setMessage('Paper uploaded and saved locally.');
  };

  // file input handlers
  const onVideoFileSelected = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('video')) {
      setMessage('Please select a valid video file.');
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // generate thumbnail async and set state
    const thumb = await generateVideoThumbnail(file);
    if (thumb) setVideoThumbnail(thumb);
    if (!videoTitle) setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const onPaperFileSelected = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
      setMessage('Unsupported paper file type.');
      return;
    }
    setPaperFile(file);
    const url = URL.createObjectURL(file);
    setPaperUrl(url);
    if (!paperTitle) setPaperTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  // delete helpers
  const deleteVideo = (id) => {
    const list = JSON.parse(localStorage.getItem('tutorial_videos') || '[]').filter(i => i.id !== id);
    saveVideos(list);
    setMessage('Video deleted.');
  };

  const deletePaper = (id) => {
    const list = JSON.parse(localStorage.getItem('exam_papers') || '[]').filter(i => i.id !== id);
    savePapers(list);
    setMessage('Paper deleted.');
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1 className="upload-title">Upload Tutorials & Exam Papers</h1>

        {message && <div className="upload-message">{message}</div>}

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Uploader name</label>
          <input
            type="text"
            placeholder="Your name (will appear to students)"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            className="input-field"
            style={{ width: '100%' }}
          />
        </div>

        {/* Video upload form */}
        <form onSubmit={handleVideoUpload} className="upload-form">
          <h2 className="section-title">Upload Tutorial Video</h2>

          <input
            type="text"
            placeholder="Tutorial Title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="input-field"
          />

          <input
            type="url"
            placeholder="Video URL (optional if you upload a file)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="input-field"
          />

          <input
            type="file"
            accept="video/*"
            className="input-field"
            onChange={(e) => onVideoFileSelected(e.target.files[0])}
          />

          <input
            type="text"
            placeholder="Subject (optional)"
            value={videoSubject}
            onChange={(e) => setVideoSubject(e.target.value)}
            className="input-field"
          />

          <input
            type="text"
            placeholder="Grade (optional)"
            value={videoGrade}
            onChange={(e) => setVideoGrade(e.target.value)}
            className="input-field"
          />

          <textarea
            placeholder="Short description (optional)"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            className="input-field"
            style={{ minHeight: 80 }}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={videoPublic} onChange={(e) => setVideoPublic(e.target.checked)} />
            <span>Make this tutorial public</span>
          </label>

          {videoThumbnail && (
            <div style={{ marginTop: 8 }}>
              <label className="preview-label">Generated thumbnail</label>
              <img src={videoThumbnail} alt="thumbnail" style={{ width: '100%', maxWidth: 320, borderRadius: 8 }} />
            </div>
          )}

          {videoUrl && !videoThumbnail && (
            <div style={{ marginTop: 8 }}>
              <label className="preview-label">Preview</label>
              <video controls src={videoUrl} style={{ width: '100%', maxWidth: 320, borderRadius: 8 }} />
            </div>
          )}

          <button type="submit" className="upload-button">Upload Video</button>
        </form>

        {/* Past videos */}
        <div className="past-section">
          <h2 className="section-title">Past Video Previews</h2>
          {pastVideos.length === 0 ? (
            <p className="muted">No tutorials available.</p>
          ) : (
            <div className="card-grid">
              {pastVideos.map((vid) => (
                <div className="card" key={vid.id}>
                  <div className="card-top">
                    <div className="card-title">{vid.title}</div>
                    <div className="card-time">{new Date(vid.uploadedAt).toLocaleString()}</div>
                  </div>

                  {vid.thumbnail ? (
                    <img className="card-media" src={vid.thumbnail} alt={vid.title} />
                  ) : (
                    <video className="card-media" controls src={vid.url} />
                  )}

                  <div style={{ marginTop: 8, color: '#374151' }}>{vid.description}</div>
                  <div className="card-actions">
                    <button className="link-button" onClick={() => window.open(vid.url, '_blank')}>Open</button>
                    <button className="link-button" onClick={() => navigator.clipboard?.writeText(vid.url)}>Copy Link</button>
                    <button className="delete-button" onClick={() => deleteVideo(vid.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr style={{ margin: '18px 0' }} />

        {/* Paper upload form */}
        <form onSubmit={handlePaperUpload} className="upload-form">
          <h2 className="section-title">Upload Paper</h2>

          <input
            type="text"
            placeholder="Paper Title"
            value={paperTitle}
            onChange={(e) => setPaperTitle(e.target.value)}
            className="input-field"
          />

          <input
            type="url"
            placeholder="Paper URL (optional if you upload a file)"
            value={paperUrl}
            onChange={(e) => setPaperUrl(e.target.value)}
            className="input-field"
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="input-field"
            onChange={(e) => onPaperFileSelected(e.target.files[0])}
          />

          <input
            type="text"
            placeholder="Subject (optional)"
            value={paperSubject}
            onChange={(e) => setPaperSubject(e.target.value)}
            className="input-field"
          />

          <input
            type="text"
            placeholder="Grade (optional)"
            value={paperGrade}
            onChange={(e) => setPaperGrade(e.target.value)}
            className="input-field"
          />

          <textarea
            placeholder="Short description (optional)"
            value={paperDescription}
            onChange={(e) => setPaperDescription(e.target.value)}
            className="input-field"
            style={{ minHeight: 80 }}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={paperPublic} onChange={(e) => setPaperPublic(e.target.checked)} />
            <span>Make this paper public</span>
          </label>

          {paperUrl && (
            <div style={{ marginTop: 8 }}>
              <label className="preview-label">Preview</label>
              <a className="paper-link" href={paperUrl} target="_blank" rel="noopener noreferrer">Open Paper</a>
            </div>
          )}

          <button type="submit" className="upload-button">Upload Paper</button>
        </form>

        {/* Past papers */}
        <div className="past-section" style={{ marginTop: 16 }}>
          <h2 className="section-title">Past Papers</h2>
          {pastPapers.length === 0 ? (
            <p className="muted">No papers available.</p>
          ) : (
            <div className="card-grid">
              {pastPapers.map((paper) => (
                <div className="card" key={paper.id}>
                  <div className="card-top">
                    <div className="card-title">{paper.title}</div>
                    <div className="card-time">{new Date(paper.uploadedAt).toLocaleString()}</div>
                  </div>

                  <div style={{ marginTop: 8 }}>{paper.description}</div>

                  <a className="paper-link" href={paper.url} target="_blank" rel="noopener noreferrer">View Paper</a>

                  <div className="card-actions">
                    <button className="link-button" onClick={() => window.open(paper.url, '_blank')}>Open</button>
                    <a className="link-button" href={paper.url} download>Download</a>
                    <button className="delete-button" onClick={() => deletePaper(paper.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

