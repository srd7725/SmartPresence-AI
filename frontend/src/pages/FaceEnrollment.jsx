import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiCheck, FiRefreshCw, FiArrowRight, FiSmile } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const FaceEnrollment = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Intro, 1: Front, 2: Left, 3: Right, 4: Blink, 5: Success
  const [captures, setCaptures] = useState({
    front: null,
    left: null,
    right: null,
    blink: null
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    { title: "Let's Get Started", desc: "Position yourself in a well-lit area.", icon: <FiSmile /> },
    { title: "Look Straight", desc: "Align your face with the center guide.", angle: "front" },
    { title: "Turn Left", desc: "Slowly tilt your head to the left.", angle: "left" },
    { title: "Turn Right", desc: "Slowly tilt your head to the right.", angle: "right" },
    { title: "Blink Verification", desc: "Blink naturally for the camera.", angle: "blink" },
    { title: "Enrollment Complete", desc: "Your identity has been securely stored." }
  ];

  const capture = useCallback(() => {
    setIsCapturing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    // Simulate AI processing
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setCaptures(prev => ({ ...prev, [steps[step].angle]: imageSrc }));
        setIsCapturing(false);
        setProgress(0);
        setStep(prev => prev + 1);
      }
    }, 100);
  }, [webcamRef, step]);

  const handleComplete = () => {
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark pt-20 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-3xl font-bold text-gradient">{steps[step].title}</h1>
              <p className="text-gray-400">{steps[step].desc}</p>
           </div>
           <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= step ? 'bg-primary' : 'bg-white/10'}`}></div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 relative">
             <div className="aspect-[4/3] rounded-[2rem] overflow-hidden glass border-2 border-white/5 relative">
                {step > 0 && step < 5 ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                      videoConstraints={{ facingMode: "user" }}
                    />
                    {/* Face Guide Overlay */}
                    <div className="absolute inset-0 border-[40px] border-dark/60 pointer-events-none">
                       <div className="w-full h-full border-2 border-dashed border-primary/50 rounded-[3rem] flex items-center justify-center">
                          <div className="w-48 h-64 border-2 border-accent rounded-[10rem]"></div>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-dark-lighter flex items-center justify-center">
                     {step === 0 && <FiSmile className="text-8xl text-primary/50 animate-pulse" />}
                     {step === 5 && <FiCheck className="text-8xl text-accent animate-bounce" />}
                  </div>
                )}

                {isCapturing && (
                  <div className="absolute inset-0 bg-dark/80 flex items-center justify-center z-20">
                     <div className="text-center">
                        <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-accent"
                           />
                        </div>
                        <p className="text-sm font-mono text-accent animate-pulse">ANALYZING BIOMETRICS...</p>
                     </div>
                  </div>
                )}
             </div>

             <div className="mt-8 flex justify-center gap-4">
                {step === 0 && (
                  <button onClick={() => setStep(1)} className="px-10 py-4 btn-primary-custom rounded-2xl font-bold text-lg shadow-xl">Start Enrollment</button>
                )}
                {step > 0 && step < 5 && (
                  <button 
                    onClick={capture} 
                    disabled={isCapturing}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform group disabled:opacity-50"
                  >
                    <div className="w-16 h-16 border-4 border-dark rounded-full flex items-center justify-center">
                       <FiCamera className="text-dark text-3xl group-hover:scale-110 transition-transform" />
                    </div>
                  </button>
                )}
                {step === 5 && (
                  <button onClick={handleComplete} className="px-10 py-4 bg-accent text-dark rounded-2xl font-bold text-lg shadow-xl flex items-center gap-2">
                    Go to Dashboard <FiArrowRight />
                  </button>
                )}
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-bold mb-4">Verification Steps</h3>
             {steps.slice(1, 5).map((s, i) => (
               <div key={i} className={`p-4 rounded-2xl border ${step > i + 1 ? 'bg-accent/10 border-accent/30' : 'bg-white/5 border-white/5'} transition-all`}>
                  <div className="flex items-center justify-between">
                     <span className={`text-sm font-medium ${step > i + 1 ? 'text-accent' : 'text-gray-400'}`}>{s.title}</span>
                     {step > i + 1 ? <FiCheck className="text-accent" /> : <div className="w-4 h-4 rounded-full border-2 border-white/10" />}
                  </div>
               </div>
             ))}

             <div className="mt-8 p-6 glass rounded-2xl border border-primary/20">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your biometric data is encrypted and used only for attendance verification. We use industry-standard security protocols to protect your privacy.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceEnrollment;
