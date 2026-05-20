import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { FiCamera, FiCheck, FiRefreshCw, FiArrowRight, FiSmile, FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

// Helper to convert base64 image capture to a File object for multipart upload
const base64ToFile = (base64String, filename) => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

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
  const [cameraError, setCameraError] = useState(null);

  const steps = [
    { title: "Let's Get Started", desc: "Position yourself in a well-lit area.", icon: <FiSmile /> },
    { title: "Look Straight", desc: "Align your face with the center guide.", angle: "front" },
    { title: "Turn Left", desc: "Slowly tilt your head to the left.", angle: "left" },
    { title: "Turn Right", desc: "Slowly tilt your head to the right.", angle: "right" },
    { title: "Blink Verification", desc: "Blink naturally for the camera.", angle: "blink" },
    { title: "Enrollment Complete", desc: "Your identity has been securely stored." }
  ];

  const handleUserMedia = () => {
    setCameraError(null);
  };

  const handleUserMediaError = (error) => {
    console.error("Camera connection failed:", error);
    setCameraError("Camera access denied or unavailable. Please grant permission in browser settings.");
    toast.error("Camera access failed. Check browser permissions.");
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setIsCapturing(true);
    setProgress(15);
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Could not capture image from webcam feed.");
      }

      const currentAngle = steps[step].angle;
      setProgress(40);

      // Save temporarily in state
      setCaptures(prev => ({ ...prev, [currentAngle]: imageSrc }));

      // Convert to file and prepare multipart form data
      const file = base64ToFile(imageSrc, `${currentAngle}.jpg`);
      const formData = new FormData();
      formData.append("angle", currentAngle);
      formData.append("file", file);

      setProgress(75);

      // Call API
      await api.post('/ai/face-enroll', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProgress(100);
      toast.success(`${currentAngle.charAt(0).toUpperCase() + currentAngle.slice(1)} angle enrolled!`);

      setTimeout(() => {
        setIsCapturing(false);
        setProgress(0);
        setStep(prev => prev + 1);
      }, 400);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to upload face capture. Please retry.");
      setIsCapturing(false);
      setProgress(0);
    }
  }, [webcamRef, step]);

  const handleComplete = () => {
    // Redirect to student-dashboard on success
    navigate('/student-dashboard');
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
                    {cameraError ? (
                      <div className="w-full h-full bg-dark-lightest flex flex-col items-center justify-center p-6 text-center">
                        <FiAlertTriangle className="text-6xl text-red-500 mb-4 animate-bounce" />
                        <h4 className="text-lg font-bold text-white mb-2">Camera Access Error</h4>
                        <p className="text-sm text-gray-400 max-w-xs">{cameraError}</p>
                        <button 
                          onClick={() => setCameraError(null)}
                          className="mt-6 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs transition-all flex items-center gap-2 font-semibold"
                        >
                          <FiRefreshCw /> Retry Camera Access
                        </button>
                      </div>
                    ) : (
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        onUserMedia={handleUserMedia}
                        onUserMediaError={handleUserMediaError}
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: "user" }}
                      />
                    )}
                    {/* Face Guide Overlay */}
                    {!cameraError && (
                      <div className="absolute inset-0 border-[40px] border-dark/60 pointer-events-none">
                         <div className="w-full h-full border-2 border-dashed border-primary/50 rounded-[3rem] flex items-center justify-center">
                            <div className="w-48 h-64 border-2 border-accent rounded-[10rem]"></div>
                         </div>
                      </div>
                    )}
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
