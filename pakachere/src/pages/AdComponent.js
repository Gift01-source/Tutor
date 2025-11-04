import React, { useEffect } from 'react';

function AdComponent() {
  useEffect(() => {
    try {
      // Load the ad once the component mounts
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  // ✅ This is the placeholder you want to show while the ad loads
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        background: '#f0f0f0',
        borderRadius: '10px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4804673329014740"
        data-ad-slot="1289869276"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <p style={{ color: '#888', fontSize: '14px', marginTop: '10px' }}>
        Loading Ad...
      </p>
    </div>
  );
}

export default AdComponent;
