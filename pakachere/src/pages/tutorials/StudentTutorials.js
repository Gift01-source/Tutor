import React, { useEffect, useMemo, useRef, useState } from 'react';
import './StudentUpload.css';

export default function StudentTutorials() {
  const [videos, setVideos] = useState([]);
  const [papers, setPapers] = useState([]);
  const [uploaders, setUploaders] = useState(['All']);
  const [subjects, setSubjects] = useState(['All']);
  const [filterUploader, setFilterUploader] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [activeVideo, setActiveVideo] = useState(null);
  const debounceRef = useRef(null);

  const API_BASE = 'https://tutorbackend-tr3q.onrender.com/api/tutors';

  // Fetch all videos and papers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vidRes = await fetch(`${API_BASE}/all/videos`);
        const vidsData = await vidRes.json();
        const vids = Array.isArray(vidsData.videos) ? vidsData.videos : [];

        const papRes = await fetch(`${API_BASE}/all/papers`);
        const papsData = await papRes.json();
        const paps = Array.isArray(papsData.papers) ? papsData.papers : [];

        setVideos(vids);
        setPapers(paps);

        // Extract unique uploaders and subjects
        const uploaderSet = new Set();
        const subjectSet = new Set();
        [...vids, ...paps].forEach(it => {
          if (it.uploader) uploaderSet.add(it.uploader);
          if (it.subject) subjectSet.add(it.subject);
        });

        setUploaders(['All', ...Array.from(uploaderSet)]);
        setSubjects(['All', ...Array.from(subjectSet)]);
      } catch (err) {
        console.error('Failed to fetch tutorials:', err);
      }
    };
    fetchData();
  }, []);

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const normalize = s => (s || '').toString().toLowerCase();
  const matchesFilter = item =>
    (filterUploader === 'All' || item.uploader === filterUploader) &&
    (filterSubject === 'All' || item.subject === filterSubject) &&
    (debouncedSearch === '' || normalize(item.title).includes(normalize(debouncedSearch)));

  const filteredVideos = useMemo(() => {
    const list = videos.filter(matchesFilter);
    list.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
      : new Date(a.uploadedAt) - new Date(b.uploadedAt));
    return list;
  }, [videos, filterUploader, filterSubject, debouncedSearch, sortOrder]);

  const filteredPapers = useMemo(() => {
    const list = papers.filter(matchesFilter);
    list.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
      : new Date(a.uploadedAt) - new Date(b.uploadedAt));
    return list;
  }, [papers, filterUploader, filterSubject, debouncedSearch, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);
  const pagedVideos = filteredVideos.slice((page - 1) * pageSize, page * pageSize);

  const maybe = (v, fallback = '') => v || fallback;

  const handlePlayClick = (globalIndex) => {
    setActiveVideo(globalIndex);
    setTimeout(() => {
      const el = document.querySelector(`[data-video-index="${globalIndex}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  const extractYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const reportItem = ({ type, item, reason }) => {
    const rpt = { id: Date.now(), type, itemTitle: item.title, itemUrl: item.url, uploader: item.uploader, reason: reason || 'Report', reportedAt: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem('student_reports') || '[]');
    all.push(rpt);
    localStorage.setItem('student_reports', JSON.stringify(all));
    alert('Report submitted. Thank you.');
  };

  const resetFilters = () => {
    setFilterUploader('All'); setFilterSubject('All'); setSearch(''); setSortOrder('newest'); setPage(1);
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1 className="upload-title">Tutorials & Papers</h1>

        {/* Filters */}
        <div className="top-search-bar">
          <input type="search" placeholder="Search tutorials..." value={search} onChange={e => setSearch(e.target.value)} className="input-field search-input"/>
          <button className="upload-button reset-button" onClick={resetFilters}>Reset</button>
        </div>

        {/* Tutorials */}
        <h2 className="section-title">Tutorials</h2>
        {pagedVideos.length === 0 ? <p className="muted">No tutorials found.</p> :
          <div className="card-grid">
            {pagedVideos.map((vid, idx) => {
              const globalIndex = (page - 1) * pageSize + idx;
              const ytID = extractYouTubeID(vid.url);

              return (
                <div className="card" key={globalIndex} data-video-index={globalIndex}>
                  <div className="card-top">
                    <div className="card-title">{maybe(vid.title)}</div>
                    <div className="card-time">
                      <button className="uploader-btn">{maybe(vid.uploader)}</button>
                      {vid.uploadedAt ? ` • ${new Date(vid.uploadedAt).toLocaleString()}` : ''}
                      {vid.subject ? ` • ${vid.subject}` : ''}
                    </div>
                  </div>
                  <div className="card-media">
                    {ytID ? (
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${ytID}`}
                        title={vid.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      activeVideo === globalIndex ? (
                        <video controls autoPlay src={vid.url} className="video-player" />
                      ) : (
                        <div className="thumbnail-wrapper">
                          <div className="thumbnail-placeholder">Thumbnail</div>
                          <button onClick={() => handlePlayClick(globalIndex)} className="play-btn">▶ Play</button>
                        </div>
                      )
                    )}
                    <div className="card-description">{vid.description}</div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => window.open(vid.url, '_blank')} className="link-button">Open</button>
                    <button onClick={() => navigator.clipboard?.writeText(vid.url)} className="link-button">Copy Link</button>
                    <button onClick={() => reportItem({ type: 'video', item: vid })} className="link-button">Report</button>
                  </div>
                </div>
              );
            })}
          </div>
        }

        {/* Pagination */}
        {pagedVideos.length > 0 &&
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
            <div>{page} / {totalPages}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
          </div>
        }

        {/* Papers */}
        <h2 className="section-title">Papers</h2>
        {filteredPapers.length === 0 ? <p className="muted">No papers found.</p> :
          <div className="card-grid">
            {filteredPapers.map((paper, idx) => (
              <div className="card" key={idx}>
                <div className="card-top">
                  <div className="card-title">{maybe(paper.title)}</div>
                  <div className="card-time">
                    <button className="uploader-btn">{maybe(paper.uploader)}</button>
                    {paper.uploadedAt ? ` • ${new Date(paper.uploadedAt).toLocaleString()}` : ''}
                    {paper.subject ? ` • ${paper.subject}` : ''}
                  </div>
                </div>
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="paper-link">View Paper</a>
                <div className="card-actions">
                  <button onClick={() => window.open(paper.url, '_blank')} className="link-button">Open</button>
                  <a href={paper.url} download className="link-button">Download</a>
                  <button onClick={() => reportItem({ type: 'paper', item: paper })} className="link-button">Report</button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
