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
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [reports, setReports] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    const v = JSON.parse(localStorage.getItem('tutorial_videos') || '[]');
    const p = JSON.parse(localStorage.getItem('exam_papers') || '[]');
    setVideos(Array.isArray(v) ? v : []);
    setPapers(Array.isArray(p) ? p : []);

    const uploaderSet = new Set();
    const subjectSet = new Set();
    [...v, ...p].forEach(it => { if (it.uploader) uploaderSet.add(it.uploader); if (it.subject) subjectSet.add(it.subject); });
    setUploaders(['All', ...Array.from(uploaderSet)]);
    setSubjects(['All', ...Array.from(subjectSet)]);

    const savedReports = JSON.parse(localStorage.getItem('student_reports') || '[]');
    setReports(Array.isArray(savedReports) ? savedReports : []);
  }, []);

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
    const list = (videos || []).filter(matchesFilter);
    list.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
      : new Date(a.uploadedAt) - new Date(b.uploadedAt));
    return list;
  }, [videos, filterUploader, filterSubject, debouncedSearch, sortOrder]);

  const filteredPapers = useMemo(() => {
    const list = (papers || []).filter(matchesFilter);
    list.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.uploadedAt) - new Date(a.uploadedAt)
      : new Date(a.uploadedAt) - new Date(b.uploadedAt));
    return list;
  }, [papers, filterUploader, filterSubject, debouncedSearch, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);
  const pagedVideos = filteredVideos.slice((page - 1) * pageSize, page * pageSize);

  const maybe = (v, fallback = '') => v || fallback;

  const openProfile = (uploader) => {
    if (!uploader) return;
    const items = [...videos, ...papers].filter(i => i.uploader === uploader);
    const subjects = Array.from(new Set(items.map(i => i.subject).filter(Boolean)));
    const bio = `Tutor of ${subjects.length ? subjects.join(', ') : 'various subjects'}. Uploaded ${items.length} item(s).`;
    setProfileData({ name: uploader, subjects, bio, items });
    setProfileOpen(true);
  };

  const handlePlayClick = (globalIndex) => {
    setActiveVideo(globalIndex);
    setTimeout(() => {
      const el = document.querySelector(`[data-video-index="${globalIndex}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  const reportItem = ({ type, item, reason }) => {
    const rpt = { id: Date.now(), type, itemTitle: item.title, itemUrl: item.url, uploader: item.uploader, reason: reason || 'Report', reportedAt: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem('student_reports') || '[]');
    all.push(rpt);
    localStorage.setItem('student_reports', JSON.stringify(all));
    setReports(all);
    alert('Report submitted. Thank you.');
  };

  const resetFilters = () => {
    setFilterUploader('All'); setFilterSubject('All'); setSearch(''); setSortOrder('newest'); setPage(1);
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1 className="upload-title">Tutorials & Papers</h1>

        {/* Search bar top */}
        <div className="top-search-bar">
          <input
            type="search"
            placeholder="Search tutorials..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field search-input"
          />
          <button className="upload-button reset-button" onClick={resetFilters}>Reset</button>
        </div>

        {/* Filters */}
        <div className="search-row">
          <div className="filter-group">
            <label htmlFor="uploader">Tutor</label>
            <select id="uploader" value={filterUploader} onChange={(e) => { setFilterUploader(e.target.value); setPage(1); }} className="input-field">
              {uploaders.map((u, i) => <option key={i} value={u}>{u}</option>)}
            </select>

            <label htmlFor="subject">Subject</label>
            <select id="subject" value={filterSubject} onChange={(e) => { setFilterSubject(e.target.value); setPage(1); }} className="input-field">
              {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>

            <label htmlFor="sort">Sort</label>
            <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input-field">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Counts */}
        <div className="counts">
          <div>{filteredVideos.length} tutorials</div>
          <div>{filteredPapers.length} papers</div>
        </div>

        {/* Tutorials */}
        <h2 className="section-title">Tutorials</h2>
        {pagedVideos.length === 0 ? <p className="muted">No tutorials found.</p> :
          <div className="card-grid">
            {pagedVideos.map((vid, idx) => {
              const globalIndex = (page - 1) * pageSize + idx;
              return (
                <div className="card" key={globalIndex} data-video-index={globalIndex}>
                  <div className="card-top">
                    <div className="card-title">{maybe(vid.title, 'Untitled')}</div>
                    <div className="card-time">
                      <button onClick={() => openProfile(vid.uploader)} className="uploader-btn">{maybe(vid.uploader, 'Unknown')}</button>
                      {vid.uploadedAt ? ` • ${new Date(vid.uploadedAt).toLocaleString()}` : ''}
                      {vid.subject ? ` • ${vid.subject}` : ''}
                    </div>
                  </div>
                  <div className="card-media">
                    {activeVideo === globalIndex ? (
                      <video controls src={vid.url} className="video-player"/>
                    ) : (
                      <div className="thumbnail-wrapper">
                        {vid.thumbnail ? <img src={vid.thumbnail} alt={vid.title} className="thumbnail"/> :
                          <div className="thumbnail-placeholder">Thumbnail</div>}
                        <button onClick={() => handlePlayClick(globalIndex)} className="play-btn">▶ Play</button>
                      </div>
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
                  <div className="card-title">{maybe(paper.title, 'Untitled')}</div>
                  <div className="card-time">
                    <button onClick={() => openProfile(paper.uploader)} className="uploader-btn">{maybe(paper.uploader, 'Unknown')}</button>
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
