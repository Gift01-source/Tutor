// StudentTutorials.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './StudentUpload.css'; 
//import Navbar from '.../components/Navbar';// reuse your TutorUpload.css for consistent styling

export default function StudentTutorials() {
  // raw data
  const [videos, setVideos] = useState([]);
  const [papers, setPapers] = useState([]);

  // UI state
  const [uploaders, setUploaders] = useState(['All']);
  const [subjects, setSubjects] = useState(['All']);
  const [filterUploader, setFilterUploader] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // newest | oldest
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // profile modal
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // which video index (global) is expanded/playing
  const [activeVideo, setActiveVideo] = useState(null);

  // reports (local)
  const [reports, setReports] = useState([]);

  // debounce ref
  const debounceRef = useRef(null);

  // load data once
  useEffect(() => {
    const v = JSON.parse(localStorage.getItem('tutorial_videos') || '[]');
    const p = JSON.parse(localStorage.getItem('exam_papers') || '[]');
    setVideos(Array.isArray(v) ? v : []);
    setPapers(Array.isArray(p) ? p : []);

    // uploaders and subjects
    const uploaderSet = new Set();
    const subjectSet = new Set();
    (Array.isArray(v) ? v : []).forEach(it => { if (it.uploader) uploaderSet.add(it.uploader); if (it.subject) subjectSet.add(it.subject); });
    (Array.isArray(p) ? p : []).forEach(it => { if (it.uploader) uploaderSet.add(it.uploader); if (it.subject) subjectSet.add(it.subject); });
    setUploaders(['All', ...Array.from(uploaderSet)]);
    setSubjects(['All', ...Array.from(subjectSet)]);

    const savedReports = JSON.parse(localStorage.getItem('student_reports') || '[]');
    setReports(Array.isArray(savedReports) ? savedReports : []);
  }, []);

  // debounce search input
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // normalize helper
  const normalize = s => (s || '').toString().toLowerCase();

  // filter predicate
  const matchesFilter = item =>
    (filterUploader === 'All' || item.uploader === filterUploader) &&
    (filterSubject === 'All' || item.subject === filterSubject) &&
    (debouncedSearch === '' || normalize(item.title).includes(normalize(debouncedSearch)));

  // filtered + sorted arrays (memoized)
  const filteredVideos = useMemo(() => {
    const list = (videos || []).filter(matchesFilter);
    list.sort((a, b) => {
      const ta = new Date(a.uploadedAt || 0).getTime();
      const tb = new Date(b.uploadedAt || 0).getTime();
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });
    return list;
  }, [videos, filterUploader, filterSubject, debouncedSearch, sortOrder]);

  const filteredPapers = useMemo(() => {
    const list = (papers || []).filter(matchesFilter);
    list.sort((a, b) => {
      const ta = new Date(a.uploadedAt || 0).getTime();
      const tb = new Date(b.uploadedAt || 0).getTime();
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });
    return list;
  }, [papers, filterUploader, filterSubject, debouncedSearch, sortOrder]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);

  const pagedVideos = filteredVideos.slice((page - 1) * pageSize, page * pageSize);

  // open profile panel (assemble minimal profile from stored items)
  const openProfile = (uploader) => {
    if (!uploader) return;
    const items = [...videos, ...papers].filter(i => i.uploader === uploader);
    const subjects = Array.from(new Set(items.map(i => i.subject).filter(Boolean)));
    const bio = `Tutor of ${subjects.length ? subjects.join(', ') : 'various subjects'}. Uploaded ${items.length} item(s).`;
    setProfileData({ name: uploader, subjects, bio, items });
    setProfileOpen(true);
  };

  // play a video (lazy loads full player)
  const handlePlayClick = (globalIndex) => {
    setActiveVideo(globalIndex);
    setTimeout(() => {
      const el = document.querySelector(`[data-video-index="${globalIndex}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  // report item (save to local storage)
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

  const maybe = (v, fallback='') => v || fallback;

  return (
    <div className="upload-page" style={{ padding: 16 }}>
      <div className="upload-container" style={{ maxWidth: 1100 }}>
        <h1 className="upload-title">Tutorials & Papers</h1>

        {/* Controls */}
        <div className="search-row" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
            <label htmlFor="uploader" style={{ fontWeight: 700 }}>Tutor</label>
            <select id="uploader" value={filterUploader} onChange={(e) => { setFilterUploader(e.target.value); setPage(1); }} className="input-field" style={{ maxWidth: 220 }}>
              {uploaders.map((u, i) => <option key={i} value={u}>{u}</option>)}
            </select>

            <label htmlFor="subject" style={{ fontWeight: 700 }}>Subject</label>
            <select id="subject" value={filterSubject} onChange={(e) => { setFilterSubject(e.target.value); setPage(1); }} className="input-field" style={{ maxWidth: 180 }}>
              {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>

            <label htmlFor="sort" style={{ fontWeight: 700 }}>Sort</label>
            <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input-field" style={{ maxWidth: 160 }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            {/*<label htmlFor="pageSize" style={{ fontWeight: 700 }}>Per page</label>
            <select id="pageSize" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="input-field" style={{ maxWidth: 120 }}>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
            </select>*/}
          </div>

          <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
            <input aria-label="Search titles" type="search" placeholder="Search tutorials..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" style={{ width: 220 }} />
            <button onClick={resetFilters} className="upload-button" style={{ padding: '8px 10px', background: '#f3f4f6', color: '#111827', fontWeight: 700 }}>Reset</button>
          </div>
        </div>

        {/* Counts */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ color: '#6b7280' }}>{filteredVideos.length} tutorials</div>
          <div style={{ color: '#6b7280' }}>{filteredPapers.length} papers</div>
        </div>

        {/* Tutorials */}
        <h2 className="section-title" style={{ marginBottom: 8 }}>Tutorials</h2>
        {filteredVideos.length === 0 ? (
          <p className="muted" style={{ marginBottom: 12 }}>No tutorials found.</p>
        ) : (
          <>
            <div className="card-grid" style={{ marginBottom: 12 }}>
              {pagedVideos.map((vid, idx) => {
                const globalIndex = (page - 1) * pageSize + idx;
                return (
                  <div className="card" key={globalIndex} data-video-index={globalIndex}>
                    <div className="card-top">
                      <div>
                        <div className="card-title">{maybe(vid.title, 'Untitled')}</div>
                        <div className="card-time" style={{ marginTop: 4, fontSize: 13 }}>
                          <button onClick={() => openProfile(vid.uploader)} style={{ background: 'transparent', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0 }}>
                            {maybe(vid.uploader, 'Unknown')}
                          </button>
                          {' • '}
                          {vid.uploadedAt ? new Date(vid.uploadedAt).toLocaleString() : ''}
                          {vid.subject ? ` • ${vid.subject}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* thumbnail + play */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 160 }}>
                        {activeVideo === globalIndex ? (
                          <video controls src={vid.url} style={{ width: '100%', maxWidth: 320, borderRadius: 8 }} />
                        ) : (
                          <div style={{ position: 'relative', width: 260 }}>
                            {vid.thumbnail ? (
                              <img src={vid.thumbnail} alt={vid.title} style={{ width: '100%', borderRadius: 8 }} />
                            ) : (
                              <div style={{ width: '100%', height: 150, background: '#000', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <span>Thumbnail</span>
                              </div>
                            )}
                            <button onClick={() => handlePlayClick(globalIndex)} aria-label={`Play ${vid.title}`} style={{
                              position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
                              background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', padding: '10px 12px', borderRadius: 8, cursor: 'pointer'
                            }}>▶ Play</button>
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 8, color: '#374151' }}>{vid.description || ''}</div>

                        <div className="card-actions" style={{ marginTop: 6 }}>
                          <button className="link-button" onClick={() => window.open(vid.url, '_blank')}>Open</button>
                          <button className="link-button" onClick={() => { navigator.clipboard?.writeText(vid.url); }}>Copy Link</button>
                          <button className="link-button" onClick={() => reportItem({ type: 'video', item: vid, reason: 'Inappropriate content' })}>Report</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* pagination */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <button className="link-button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
              <div style={{ fontWeight: 700 }}>{page} / {totalPages}</div>
              <button className="link-button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
            </div>
          </>
        )}

        {/* Papers */}
        <h2 className="section-title" style={{ marginBottom: 8 }}>Papers</h2>
        {filteredPapers.length === 0 ? (
          <p className="muted">No papers found.</p>
        ) : (
          <div className="card-grid" style={{ marginBottom: 12 }}>
            {filteredPapers.map((paper, idx) => (
              <div className="card" key={idx}>
                <div className="card-top">
                  <div className="card-title">{maybe(paper.title, 'Untitled')}</div>
                  <div className="card-time">
                    <button onClick={() => openProfile(paper.uploader)} style={{ background: 'transparent', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: 0 }}>
                      {maybe(paper.uploader, 'Unknown')}
                    </button>
                    {' • '}
                    {paper.uploadedAt ? new Date(paper.uploadedAt).toLocaleString() : ''}
                    {paper.subject ? ` • ${paper.subject}` : ''}
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <a className="paper-link" href={paper.url} target="_blank" rel="noopener noreferrer">View Paper</a>
                </div>

                <div className="card-actions" style={{ marginTop: 8 }}>
                  <button className="link-button" onClick={() => window.open(paper.url, '_blank')}>Open</button>
                  <a className="link-button" href={paper.url} download>Download</a>
                  <button className="link-button" onClick={() => reportItem({ type: 'paper', item: paper })}>Report</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile modal */}
        {profileOpen && profileData && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setProfileOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">{profileData.name}</h3>
              <p className="modal-body">{profileData.bio}</p>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {profileData.subjects.length ? profileData.subjects.map((s, i) => <div key={i} style={{ background: '#eef2ff', padding: '6px 8px', borderRadius: 8, fontSize: 13 }}>{s}</div>) : <div style={{ color: '#9ca3af' }}>No subjects listed</div>}
              </div>

              <div style={{ maxHeight: 200, overflow: 'auto', marginBottom: 12 }}>
                <strong>Recent uploads</strong>
                <ul style={{ marginTop: 8 }}>
                  {profileData.items.slice(0, 50).map((it, i) => <li key={i} style={{ marginBottom: 6 }}>{it.title} — {it.uploadedAt ? new Date(it.uploadedAt).toLocaleDateString() : ''}</li>)}
                </ul>
              </div>

              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setProfileOpen(false)}>Close</button>
                <button className="modal-delete" onClick={() => { setFilterUploader(profileData.name); setProfileOpen(false); }}>View their uploads</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
