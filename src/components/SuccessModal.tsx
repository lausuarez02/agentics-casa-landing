"use client";

import React from 'react';
import { WarpBackground } from "./magicui/warp-background";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  const handleContinue = () => {
    window.open('https://twitter.com/swarmfun', '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <WarpBackground
        className="max-w-md w-[90%] text-white"
        beamsPerSide={4}
        beamDuration={4}
        perspective={150}
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            🚀 Pitch Received!
          </h2>
          <p className="text-base leading-relaxed mb-6 opacity-90">
            Thanks for sharing your vision with SwarmFund. Our AI agents are already analyzing your pitch. Follow us on Twitter for updates!
          </p>
          <button 
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-lg text-sm uppercase tracking-wider hover:bg-white/30 transition-all duration-300"
          >
            Continue to Twitter
          </button>
        </div>
      </WarpBackground>
    </div>
  );
} 