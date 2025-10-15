import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaEnvelope } from 'react-icons/fa';
import QrScanner from 'react-qr-scanner';

function useLocalUserId() {
  const [id] = useState(() => localStorage.getItem('user_id') || (() => {
    const demoId = 'demo-' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('user_id', demoId);
    return demoId;
  })());
  return id;
}

function ReferralProgram() {
  const userId = useLocalUserId();
  const [referrals, setReferrals] = useState(() => JSON.parse(localStorage.getItem('referral_history') || '[]'));
  const [copied, setCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedLink, setScannedLink] = useState('');

  const referralLink = `${window.location.origin}/register?ref=${encodeURIComponent(userId)}`;

  useEffect(() => {
    localStorage.setItem('referral_history', JSON.stringify(referrals));
  }, [referrals]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addDemoReferral = () => {
    const newRef = {
      id: Math.random().toString(36).slice(2, 9),
      name: 'Friend ' + (referrals.length + 1),
      email: `friend${referrals.length + 1}@example.com`,
      date: new Date().toISOString(),
      rewarded: Math.random() < 0.5,
    };
    setReferrals([newRef, ...referrals]);
  };

  const markRewarded = (id) => {
    setReferrals(referrals.map(r => r.id === id ? { ...r, rewarded: true } : r));
  };

  const totalReferrals = referrals.length;
  const totalRewards = referrals.filter(r => r.rewarded).length;
  const pendingRewards = totalReferrals - totalRewards;

  const qrSvgUrl = (link) => `https://chart.googleapis.com/chart?cht=qr&chs=120x120&chl=${encodeURIComponent(link)}&choe=UTF-8`;

  const share = (platform, link) => {
    const encoded = encodeURIComponent(link);
    let url = '';
    switch (platform) {
      case 'whatsapp': url = `https://wa.me/?text=${encoded}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`; break;
      case 'twitter': url = `https://twitter.com/intent/tweet?text=Join me! ${encoded}`; break;
      case 'email': url = `mailto:?subject=Join me!&body=${encoded}`; break;
    }
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  return (
    <div className="referral-container" style={containerStyle}>
      <div className="referral-card-container" style={cardContainerStyle}>
        <h1 style={titleStyle}>Referral Program</h1>
        <p style={subtitleStyle}>Invite your friends and earn rewards! Share your referral link via social media or email.</p>

        {/* Stats */}
        <div style={statsContainerStyle}>
          <StatCard title="Total Referrals" value={totalReferrals} color="#2563eb" />
          <StatCard title="Rewards Earned" value={totalRewards} color="#16a34a" />
          <StatCard title="Pending Rewards" value={pendingRewards} color="#facc15" />
        </div>

        {/* Referral Link & QR */}
        <div style={flexMobile}>
          <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input readOnly value={referralLink} style={inputStyle} />
            <button onClick={handleCopy} style={copyButtonStyle}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={qrCardStyle}>
            <img src={qrSvgUrl(referralLink)} alt="QR Code" style={{ padding: '0.5rem' }} />
            <button
              style={{ marginTop: 6, fontSize: '0.75rem', cursor: 'pointer', color: '#2563eb', background: 'none', border: 'none' }}
              onClick={() => setShowScanner(true)}
            >
              Scan QR
            </button>
          </div>
        </div>

        {/* Social Buttons */}
        <div style={socialContainerStyle}>
          <SocialButton color="#25D366" icon={<FaWhatsapp />} text="WhatsApp" onClick={() => share('whatsapp', referralLink)} />
          <SocialButton color="#4267B2" icon={<FaFacebookF />} text="Facebook" onClick={() => share('facebook', referralLink)} />
          <SocialButton color="#1DA1F2" icon={<FaTwitter />} text="Twitter" onClick={() => share('twitter', referralLink)} />
          <SocialButton color="#9CA3AF" icon={<FaEnvelope />} text="Email" onClick={() => share('email', referralLink)} />
        </div>

        {/* Invite Button */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={addDemoReferral} style={inviteButtonStyle}>Invite a Friend</button>
        </div>

        {/* Referral History */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ ...subtitleStyle, textAlign: 'left' }}>Referral History</h2>
          {referrals.length === 0 && <div style={emptyTextStyle}>No referrals yet</div>}
          {referrals.map(r => {
            const link = `${window.location.origin}/register?ref=${r.id}`;
            return (
              <div key={r.id} style={referralCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{r.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{r.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(r.date).toLocaleString()}</div>
                  </div>
                  {/* Small QR Preview */}
                  <img src={qrSvgUrl(link)} alt="QR Preview" style={{ width: 60, height: 60, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ padding: '2px 6px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', color: r.rewarded ? '#166534' : '#92400E', background: r.rewarded ? '#DCFCE7' : '#FEF3C7' }}>
                    {r.rewarded ? 'Rewarded' : 'Pending'}
                  </div>
                  {!r.rewarded && <button onClick={() => markRewarded(r.id)} style={markButtonStyle}>Mark Rewarded</button>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div style={scannerModalBackdrop} onClick={() => setShowScanner(false)}>
          <div style={scannerModal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ textAlign: 'center', marginBottom: 12 }}>Scan QR Code</h3>
            <QrScanner
              onScan={(data) => { if (data) setScannedLink(data); }}
              onError={(err) => console.error(err)}
              style={{ width: '100%' }}
            />
            {scannedLink && (
              <div style={{ marginTop: 12, padding: 8, background: '#eef2ff', borderRadius: 8, wordBreak: 'break-all' }}>
                Scanned Link: {scannedLink}
              </div>
            )}
            <button onClick={() => setShowScanner(false)} style={{ ...inviteButtonStyle, marginTop: 12 }}>Close Scanner</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----- Styles ----- */
const containerStyle = { background: '#f9fafb', minHeight: '100vh', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' };
const cardContainerStyle = { background: '#fff', borderRadius: '18px', boxShadow: '0 2px 12px rgba(37,99,235,0.10)', padding: '2rem', maxWidth: '480px', width: '100%' };
const titleStyle = { fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem', textAlign: 'center' };
const subtitleStyle = { color: '#2563eb', marginBottom: '1rem', fontSize: '0.95rem' };
const statsContainerStyle = { display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' };
const inputStyle = { flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' };
const copyButtonStyle = { padding: '10px 16px', borderRadius: '24px', background: '#2563eb', color: '#fff', fontWeight: '600', cursor: 'pointer' };
const qrCardStyle = { width: '110px', height: '130px', borderRadius: '16px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.1)' };
const socialContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' };
const inviteButtonStyle = { padding: '12px 24px', borderRadius: '32px', background: '#2563eb', color: '#fff', fontWeight: 'bold', boxShadow: '0 4px 24px rgba(37,99,235,0.18)', cursor: 'pointer', fontSize: '1rem' };
const referralCardStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.8rem', marginTop: '0.5rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', background: '#fefefe' };
const markButtonStyle = { padding: '4px 10px', borderRadius: '12px', background: '#2563eb', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' };
const emptyTextStyle = { textAlign: 'center', color: '#9CA3AF', marginTop: '1rem' };
const flexMobile = { display: 'flex', flexDirection: 'row', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' };
const scannerModalBackdrop = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const scannerModal = { background: '#fff', borderRadius: 12, padding: '1rem', maxWidth: 360, width: '90%' };

const StatCard = ({ title, value, color }) => (
  <div style={{ flex: '1 0 45%', padding: '0.8rem', background: '#fff', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color }}>{value}</div>
    <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.2rem' }}>{title}</div>
  </div>
);

const SocialButton = ({ color, icon, text, onClick }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '8px 12px', borderRadius: '16px', background: color, color: '#fff', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', flex: '1 0 45%' }}>
    {icon} {text}
  </button>
);

export default ReferralProgram;
