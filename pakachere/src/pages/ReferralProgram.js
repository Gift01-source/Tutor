import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaEnvelope } from 'react-icons/fa';
import QrScanner from 'react-qr-scanner';

function useLocalUserId() {
  const [id] = useState(() => {
    let stored = localStorage.getItem('user_id');
    if (!stored) {
      stored = 'demo-' + Math.random().toString(36).slice(2, 9);
      localStorage.setItem('user_id', stored);
    }
    return stored;
  });
  return id;
}

function ReferralProgram() {
  const userId = useLocalUserId();
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedLink, setScannedLink] = useState('');

  const referralLink = `${window.location.origin}/register?ref=${encodeURIComponent(userId)}`;
  const API_URL = 'https://tutorbackend-tr3q.onrender.com/api/referrals'; // Update your backend URL

  // Fetch referrals from backend
  const fetchReferrals = async () => {
    try {
      const res = await fetch(`${API_URL}/${userId}`);
      const data = await res.json();
      setReferrals(data.referrals || []);
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add new referral
  const addReferral = async () => {
    const newRef = {
      userId,
      name: 'Friend ' + (referrals.length + 1),
      email: `friend${referrals.length + 1}@example.com`
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRef),
      });
      const data = await res.json();
      if (res.ok) setReferrals(prev => [data.referral, ...prev]);
    } catch (err) {
      console.error('Failed to add referral:', err);
    }
  };

  // Mark referral as rewarded manually
  const markRewarded = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/reward`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) setReferrals(prev => prev.map(r => r.id === id ? data.referral : r));
    } catch (err) {
      console.error('Failed to mark rewarded:', err);
    }
  };

  // **New: Make a payment and auto-mark referral as rewarded**
  const makePayment = async (amount = 2000, method = 'bank') => {
    try {
      const res = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, method }),
      });
      const data = await res.json();

      // Update referral list if a referral got rewarded
      if (data.rewarded_referral) {
        setReferrals(prev => prev.map(r => r.id === data.rewarded_referral.id ? data.rewarded_referral : r));
      }

      alert(`Payment successful: $${amount}`);
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    }
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
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 2px 12px rgba(37,99,235,0.10)', padding: '2rem', maxWidth: '480px', width: '100%' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem', textAlign: 'center' }}>Referral Program</h1>
        <p style={{ color: '#2563eb', marginBottom: '1rem', fontSize: '0.95rem' }}>Invite your friends and earn rewards!</p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <StatCard title="Total Referrals" value={totalReferrals} color="#2563eb" />
          <StatCard title="Rewards Earned" value={totalRewards} color="#16a34a" />
          <StatCard title="Pending Rewards" value={pendingRewards} color="#facc15" />
        </div>

        {/* Referral Link & QR */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input readOnly value={referralLink} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
          <button onClick={handleCopy} style={{ padding: '10px 16px', borderRadius: '24px', background: '#2563eb', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <div style={{ width: '110px', height: '130px', borderRadius: '16px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.1)' }}>
            <img src={qrSvgUrl(referralLink)} alt="QR Code" style={{ padding: '0.5rem' }} />
            <button style={{ marginTop: 6, fontSize: '0.75rem', cursor: 'pointer', color: '#2563eb', background: 'none', border: 'none' }} onClick={() => setShowScanner(true)}>Scan QR</button>
          </div>
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          <SocialButton color="#25D366" icon={<FaWhatsapp />} text="WhatsApp" onClick={() => share('whatsapp', referralLink)} />
          <SocialButton color="#4267B2" icon={<FaFacebookF />} text="Facebook" onClick={() => share('facebook', referralLink)} />
          <SocialButton color="#1DA1F2" icon={<FaTwitter />} text="Twitter" onClick={() => share('twitter', referralLink)} />
          <SocialButton color="#9CA3AF" icon={<FaEnvelope />} text="Email" onClick={() => share('email', referralLink)} />
        </div>

        {/* Invite & Payment Button */}
        <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={addReferral} style={inviteButtonStyle}>Invite a Friend</button>
          <button onClick={() => makePayment(2000, 'bank')} style={{ ...inviteButtonStyle, background: '#16a34a' }}>Make Payment & Reward Referral</button>
        </div>

        {/* Referral History */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#2563eb', fontSize: '0.95rem', marginBottom: '0.5rem', textAlign: 'left' }}>Referral History</h2>
          {referrals.length === 0 && <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '1rem' }}>No referrals yet</div>}
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
                  <img src={qrSvgUrl(link)} alt="QR Preview" style={{ width: 60, height: 60, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ padding: '2px 6px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', color: r.rewarded ? '#166534' : '#92400E', background: r.rewarded ? '#DCFCE7' : '#FEF3C7' }}>
                    {r.rewarded ? 'Rewarded' : 'Pending'}
                  </div>
                  {!r.rewarded && <button onClick={() => markRewarded(r.id)} style={markRewardedButtonStyle}>Mark Rewarded</button>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scanner Modal */}
        {showScanner && (
          <div style={scannerModalStyle} onClick={() => setShowScanner(false)}>
            <div style={scannerContentStyle} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ textAlign: 'center', marginBottom: 12 }}>Scan QR Code</h3>
              <QrScanner onScan={(data) => data && setScannedLink(data)} onError={(err) => console.error(err)} style={{ width: '100%' }} />
              {scannedLink && <div style={{ marginTop: 12, padding: 8, background: '#eef2ff', borderRadius: 8, wordBreak: 'break-all' }}>Scanned Link: {scannedLink}</div>}
              <button onClick={() => setShowScanner(false)} style={{ ...inviteButtonStyle, marginTop: 12 }}>Close Scanner</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----- Styles ----- */
const inviteButtonStyle = { padding: '12px 24px', borderRadius: '32px', background: '#2563eb', color: '#fff', fontWeight: 'bold', boxShadow: '0 4px 24px rgba(37,99,235,0.18)', cursor: 'pointer', fontSize: '1rem' };
const markRewardedButtonStyle = { padding: '4px 10px', borderRadius: '12px', background: '#2563eb', color: '#fff', fontSize: '0.75rem', cursor: 'pointer' };
const referralCardStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.8rem', marginTop: '0.5rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', background: '#fefefe' };
const scannerModalStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const scannerContentStyle = { background: '#fff', borderRadius: 12, padding: '1rem', maxWidth: 360, width: '90%' };

/* ----- Helper Components ----- */
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
