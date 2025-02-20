import React from 'react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import Spline with no SSR
const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div>Loading 3D model...</div>
});
// ... existing code ...

export default function Home() {
  const [formData, setFormData] = useState({
    founderName: '',
    email: '',
    xHandle: '',
  });
  const [showPitchInterface, setShowPitchInterface] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPitchInterface(true);
  };

  return (
    <>
      <Head>
        <link href="https://fonts.cdnfonts.com/css/basement-grotesque" rel="stylesheet" />
      </Head>
      
      <main style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        position: 'fixed',
        color: 'white',
        fontFamily: "'Basement Grotesque', sans-serif",
        background: !showPitchInterface ? 'linear-gradient(to bottom right, #1a1a1a, #000000)' : 'transparent'
      }}>
        {!showPitchInterface ? (
          <div style={{
            position: 'absolute',
            zIndex: 10,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: '90%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h1 style={{
              fontSize: '2rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase'
            }}>
              Pitch to Agentics
            </h1>
            <form onSubmit={handleContinue} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <input 
                type="text"
                name="founderName"
                placeholder="Your Name"
                value={formData.founderName}
                onChange={handleChange}
                required
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <input 
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <input 
                type="text"
                name="xHandle"
                placeholder="X/Twitter Handle"
                value={formData.xHandle}
                onChange={handleChange}
                required
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <button 
                type="submit"
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  fontWeight: 500
                }}
              >
                Continue to Pitch
              </button>
            </form>
          </div>
        ) : (
          <>
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
        scene="https://prod.spline.design/CVW3fUr23gE0ri6t/scene.splinecode" 
        style={{ 
                pointerEvents: 'none'
              }}
            />
          </>
        )}

        <div style={{
          position: 'fixed',
          bottom: '17px',
          right: '12px',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          padding: '8px 12px',
          borderRadius: '50px',
          fontSize: '12px',
          backdropFilter: 'blur(5px)',
          width: '150px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Built by Agentics
        </div>
      </main>
    </>
  );
}