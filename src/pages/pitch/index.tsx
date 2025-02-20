import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div>Loading 3D model...</div>
});

export default function Pitch() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div>Loading...</div>;

  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      position: 'fixed',
      color: 'white',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      <div style={{
        position: 'absolute',
        zIndex: 10,
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <button style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50px',
          color: 'white',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}>
          🎤 Start Your Pitch
        </button>
        <p style={{
          marginTop: '1rem',
          opacity: 0.7,
          fontSize: '0.9rem'
        }}>
          Press to start recording your pitch
        </p>
      </div>

      <SplineComponent
        scene="https://prod.spline.design/RrmpLi5Gw9Ak9NFB/scene.splinecode"
        style={{ 
          pointerEvents: 'none'
        }}
      />
    </main>
  );
}