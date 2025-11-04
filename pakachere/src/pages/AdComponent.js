import React, { useEffect } from 'react';

function AdComponent() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-4804673329014740"
      data-ad-slot="1289869276"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

export default AdComponent;
        
