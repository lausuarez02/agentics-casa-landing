import React, { useEffect, useRef, useState } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src="/music/background.mp3"  // You'll need to add this file
      />
      <button
        onClick={togglePlay}
        style={{
          position: 'fixed',
          bottom: '17px',
          left: '12px',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          padding: '8px 12px',
          borderRadius: '50px',
          fontSize: '12px',
          backdropFilter: 'blur(5px)',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          color: 'white'
        }}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </>
  );
}