"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { SuccessModal } from '@/components/SuccessModal';

const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div>Loading 3D model...</div>
});

export default function Form() {
  const [formData, setFormData] = useState({
    founderName: '',
    projectName: '',
    email: '',
    xHandle: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setShowSuccessModal(true);
        setFormData({
          founderName: '',
          projectName: '',
          email: '',
          xHandle: '',
          description: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
        fontFamily: "'Basement Grotesque', sans-serif"
      }}>
        {!showSuccessModal && (
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
              Pitch to SwarmFund
            </h1>
            <form onSubmit={handleSubmit} style={{
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
                type="text"
                name="projectName"
                placeholder="Project Name"
                value={formData.projectName}
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
              <textarea 
                name="description"
                placeholder="Tell us about your project"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'none'
                }}
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
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
                {isSubmitting ? 'Submitting...' : 'Submit Pitch'}
              </button>
              
              {submitStatus === 'success' && (
                <p style={{ color: '#4ade80', marginTop: '1rem', textAlign: 'center' }}>
                  Thanks! We'll be in touch soon.
                </p>
              )}
              {submitStatus === 'error' && (
                <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center' }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        )}

        <div style={{
          position: 'fixed',
          bottom: '8px',
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
          Built by SwarmFund
        </div>

        <SplineComponent
          scene="https://prod.spline.design/T5PkQxXsLO5s-Jgh/scene.splinecode"
          style={{ 
            pointerEvents: 'none'
          }}
        />
      </main>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </>
  );
}