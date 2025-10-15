/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaDownload, FaPrint } from 'react-icons/fa';
import './pages.css'; // make sure your global styles match other pages

// Helper: build fallback link from current user
const getCurrentUser = () => ({
  id: localStorage.getItem('user_id') || null,
  name: localStorage.getItem('user_name') || null,
  email: localStorage.getItem('user_email') || null
});

function buildFallbackLink() {
  const u = getCurrentUser();
  const id = u.id || (u.email ? u.email : 'demo_user');
  return `${window.location.origin}/register?ref=${encodeURIComponent(id)}`;
}

// QR API generator
function qrApiUrl(data, size = 360) {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=png`;
}

export default function ReferralQR({ signedLink = null, size = 300 }) {
  const fallbackLink = useMemo(() => buildFallbackLink(), []);
  const referralLink = signedLink || fallbackLink;

  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [qrSrc, setQrSrc] = useState(() => qrApiUrl(referralLink, size));
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setQrSrc(qrApiUrl(referralLink, size));
  }, [referralLink, size]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy link.');
    }
  };

  const prepareDownload = async (targetSize = 1024) => {
    setLoadingDownload(true);
    setError(null);
    try {
      const res = await fetch(qrApiUrl(referralLink, targetSize));
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `referral-qr-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError('Could not prepare download.');
    } finally {
      setLoadingDownload(false);
    }
  };

  const handlePrint = () => {
    const w = window.open('', '_blank', 'noopener');
    if (!w) return setError('Unable to open print window.');
    w.document.write(`
      <html>
        <head>
          <title>Print QR</title>
          <style>
            body { display:flex; justify-content:center; align-items:center; height:100vh; margin:0; }
            img { max-width:90vw; max-height:90vh; }
          </style>
        </head>
        <body>
          <img src="${qrApiUrl(referralLink, 1024)}" alt="QR code" />
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  return (
    <div className="landing-container" style={{ padding: 12 }}>
      <div className="card-wrapper" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 className="page-title">Referral QR</h2>
        <p className="page-subtitle">Share your referral link and QR to invite friends!</p>

        <div className="flex-mobile" style={{ flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
          <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
            <img
              src={qrSrc}
              alt="Referral QR"
              width={size}
              height={size}
              style={{ borderRadius: 12, boxShadow: '0 4px 14px rgba(16,24,40,0.06)', cursor: 'pointer', maxWidth: '100%' }}
              onClick={() => setPreviewOpen(true)}
            />
          </div>

          <div style={{ flex: '1 1 220px' }}>
            <label style={{ fontWeight: 600 }}>Your Referral Link</label>
            <input readOnly value={referralLink} className="input-field" style={{ width: '100%', marginTop: 8 }} />

            <div className="flex-gap" style={{ flexWrap: 'wrap', marginTop: 8 }}>
              <button className="primary-btn" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Link'}</button>
              <button className="social-btn whatsapp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(referralLink)}`, '_blank')}><FaWhatsapp /> WhatsApp</button>
              <button className="social-btn facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')}><FaFacebookF /> Facebook</button>
              <button className="social-btn twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Join me! ' + referralLink)}`, '_blank')}><FaTwitter /> Twitter</button>
            </div>

            <div className="flex-gap" style={{ marginTop: 10 }}>
              <button className="primary-btn" onClick={() => prepareDownload(1024)} disabled={loadingDownload}>
                <FaDownload /> {loadingDownload ? 'Preparing...' : 'Download PNG'}
              </button>
              <button className="primary-btn" onClick={handlePrint}><FaPrint /> Print</button>
            </div>

            {error && <div style={{ marginTop: 8, color: '#b91c1c' }}>{error}</div>}
            <div style={{ marginTop: 12, padding: 12, background: '#eef2ff', borderRadius: 8, color: '#1e3a8a' }}>
              Share this link to get rewards when friends register!
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewOpen && (
          <div className="modal-backdrop" onClick={() => setPreviewOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
              <h3 className="modal-title">Referral QR Preview</h3>
              <img src={qrApiUrl(referralLink, 1024)} alt="Large QR" style={{ width: '100%', borderRadius: 12, marginTop: 12 }} />
              <button className="modal-cancel" onClick={() => setPreviewOpen(false)} style={{ marginTop: 12 }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
