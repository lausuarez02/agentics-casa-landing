import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Vapi from "@vapi-ai/web";

// Dynamically import Spline with no SSR
const SplineComponent = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div>Loading 3D model...</div>
});

export default function Home() {
  const [formData, setFormData] = useState({
    founderName: '',
    email: '',
    xHandle: '',
  });
  const [showPitchInterface, setShowPitchInterface] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [vapi, setVapi] = useState<any>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showAttemptsModal, setShowAttemptsModal] = useState(false);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [transcriptMessages, setTranscriptMessages] = useState<Array<{role: string, content: string}>>([]);

  useEffect(() => {
    if (showPitchInterface) {
      const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");
      
      vapiInstance.on("call-start", () => {
        console.log("Call started");
        setIsRecording(true);
        setTranscriptMessages([]); // Reset transcript for new call
        
        // Set 3-minute timer
        const timer = setTimeout(() => {
          vapiInstance.say("Time's up! Let's wrap this up. Thanks for pitching!", true);
          handleStopPitch();
        }, 180000); // 3 minutes in milliseconds
        
        setCallTimer(timer);
      });

      vapiInstance.on("message", (message) => {
        if (message.type === "transcript") {
          setTranscriptMessages(prev => [...prev, {
            role: message.transcript.speaker === "assistant" ? "assistant" : "user",
            content: message.transcript.text
          }]);
        }
      });

      vapiInstance.on("call-end", async () => {
        console.log("Call ended");
        setIsRecording(false);
        if (callTimer) clearTimeout(callTimer);
        setAttemptsLeft(prev => prev - 1);
        
        // Generate Farza's summary
        try {
          const response = await fetch('/api/generate-summary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: transcriptMessages,
              founderInfo: formData,
            }),
          });

          if (response.ok) {
            const summary = await response.json();
            console.log("Farza's Summary:", summary);
            // Here you could store the summary in your database
            // or display it in a modal/new page
          }
        } catch (error) {
          console.error("Error generating summary:", error);
        }

        if (attemptsLeft <= 1) {
          setShowWarningModal(true);
        }
      });

      vapiInstance.on("error", (error) => {
        console.error("Vapi error:", error);
        setIsRecording(false);
        if (callTimer) clearTimeout(callTimer);
      });

      setVapi(vapiInstance);

      return () => {
        vapiInstance.stop();
        if (callTimer) clearTimeout(callTimer);
      };
    }
  }, [showPitchInterface]);

  const handleStartPitch = async () => {
    if (attemptsLeft <= 0) {
      setShowWarningModal(true);
      return;
    }

    try {
      await vapi.start({
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are Farza, the founder of Buildspace, but for Agentics.casa, a hacker house for real builders. Your goal is to find founders who actually ship, not just talk. You're casual, fun, and no-BS. You cut through fluff and look for execution, hustle, and proof of work. You ask founders direct, spicy questions to see if they actually build or just tweet about building.

When evaluating someone, you prioritize:
- Shipped Projects – What have they actually launched?
- Velocity – How fast do they execute?
- Grit – Have they built through setbacks, or do they give up easily?
- Hunger – Are they obsessed with learning and shipping?
- Impact – Are they solving a real problem, or just building for hype?

You challenge founders to prove themselves. You cut out the BS and push them to show real work. Your style is witty, blunt, and energetic. Default to short, direct answers. Use humor and memes when needed, but always push them to stop talking and start doing.

If someone is all talk, call them out. If someone is legit, hype them up. If they're unsure, push them to execute first and come back later.

Start by saying: "Yo ${formData.founderName}! I'm Farza from Agentics.casa 🚀 Skip the fancy pitch - tell me what you've actually shipped. What have you built that's live right now? Let's get real!"`,
            },
          ],
        },
        voice: {
          provider: "11labs",
          voiceId: "5vFiIBxuWvAjXeNTbL11",
        },
        name: "Farza from Agentics.casa",
      });
    } catch (error) {
      console.error("Error starting pitch:", error);
    }
  };

  const handleStopPitch = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAttemptsModal(true);
  };

  const WarningModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(15px)',
        padding: '2rem',
        borderRadius: '24px',
        maxWidth: '90%',
        width: '400px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#ff4444' }}>No More Attempts!</h2>
        <p style={{ marginBottom: '1.5rem', color: 'white' }}>
          You've used all your pitch attempts. Come back when you've shipped something new! 🚀
        </p>
        <button
          onClick={() => setShowWarningModal(false)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );

  const AttemptsModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(15px)',
        padding: '2rem',
        borderRadius: '24px',
        maxWidth: '90%',
        width: '400px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        <h2 style={{ marginBottom: '1rem', color: 'white' }}>Important Info</h2>
        <p style={{ marginBottom: '1.5rem', color: 'white' }}>
          You have 2 chances to pitch to Farza. Each pitch is limited to 3 minutes.
          Make it count! 🎯
        </p>
        <button
          onClick={() => {
            setShowAttemptsModal(false);
            setShowPitchInterface(true);
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Let's Go!
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <link href="https://fonts.cdnfonts.com/css/basement-grotesque" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style jsx>{`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  .neon-text {
    font-family: 'Orbitron', sans-serif;
    text-transform: uppercase;
    text-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff;
  }
`}</style>

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
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              fontWeight: '700',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Agentics
            </div>
        {!showPitchInterface ? (
          <div style={{
            position: 'absolute',
            zIndex: 10,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: '90%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 5vw, 2.5rem)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}>

            <h1 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
              textAlign: 'center',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'white',
              background: 'none',
              WebkitBackgroundClip: 'unset',
              WebkitTextFillColor: 'unset'
            }}>
              Pitch to Agentics
            </h1>
            <form onSubmit={handleContinue} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.8rem, 2vw, 1rem)'
            }}>
              <input 
                type="text"
                name="founderName"
                placeholder="Your Name"
                value={formData.founderName}
                onChange={handleChange}
                required
                style={{
                  padding: 'clamp(0.8rem, 2vw, 1rem)',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
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
                  padding: 'clamp(0.8rem, 2vw, 1rem)',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
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
                  padding: 'clamp(0.8rem, 2vw, 1rem)',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
              <button 
                type="submit"
                style={{
                  padding: 'clamp(0.8rem, 2vw, 1rem)',
                  background: 'linear-gradient(135deg, #1a1a1a, #333)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  marginTop: 'clamp(0.5rem, 2vw, 1rem)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              padding: '1rem',
              width: '100%',
              maxWidth: '90vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button 
                onClick={isRecording ? handleStopPitch : handleStartPitch}
                style={{
                  padding: '1rem 2rem',
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                  backgroundColor: isRecording ? 'rgba(255, 50, 50, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${isRecording ? 'rgba(255, 50, 50, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                {isRecording ? '⏹️ Stop Recording' : '🎤 Start Your Pitch'}
              </button>
              <p style={{
                opacity: 0.7,
                fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
              }}>
                {isRecording 
                  ? "AI interviewer is listening to your pitch..."
                  : "Press to start recording your pitch"}
              </p>
            </div>

            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1
            }}>
              <SplineComponent
        scene="https://prod.spline.design/CVW3fUr23gE0ri6t/scene.splinecode" 
        style={{ 
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </>
        )}

        <div style={{
          position: 'fixed',
          bottom: '8px',
          right: '12px',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          padding: '8px 12px',
          borderRadius: '50px',
          fontSize: 'clamp(10px, 3vw, 12px)',
          backdropFilter: 'blur(5px)',
          width: 'clamp(120px, 30vw, 150px)',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Built by Agentics.casa
        </div>
      </main>
      {showWarningModal && <WarningModal />}
      {showAttemptsModal && <AttemptsModal />}
      
      {showPitchInterface && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          color: 'white',
          fontSize: '0.9rem'
        }}>
          Attempts left: {attemptsLeft}
        </div>
      )}
    </>
  );
}