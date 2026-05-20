import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMonitor, FiCamera, FiAlertTriangle, FiActivity, FiShield,
  FiUserCheck, FiMousePointer, FiLayers, FiMaximize2, FiMinimize2,
  FiLogOut, FiX, FiClock
} from 'react-icons/fi';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

// Severity → colour map (used in security log)
const SEVERITY_COLOR = {
  High:   'text-red-400',
  Medium: 'text-yellow-400',
  Low:    'text-blue-400',
};

// Pool of simulated AI-detection events
const SIMULATION_EVENTS = [
  { msg: 'Multiple faces detected in frame',   severity: 'High'   },
  { msg: 'No face detected — student absent?', severity: 'High'   },
  { msg: 'Tab switching detected',             severity: 'Medium' },
  { msg: 'Extended inactivity detected',       severity: 'Medium' },
  { msg: 'Head pose deviation (looking away)', severity: 'Low'    },
  { msg: 'Low engagement score drop',          severity: 'Low'    },
];

// ─── Component ────────────────────────────────────────────────────────────────
const LiveClassroom = () => {
  const webcamRef      = useRef(null);
  const containerRef   = useRef(null);
  const inactivityRef  = useRef(null);

  // ── State ──────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    engagement: 92,
    confidence: 98,
    status: 'Verified',
    alerts: [],
  });
  const [history, setHistory] = useState(
    Array(20).fill(0).map((_, i) => ({ time: i, val: 80 + Math.random() * 20 }))
  );
  const [tabSwitches,  setTabSwitches]  = useState(0);
  const [sessionSecs,  setSessionSecs]  = useState(0);      // live timer
  const [isFullscreen, setIsFullscreen] = useState(false);  // fullscreen toggle
  const [showLeaveModal, setShowLeaveModal] = useState(false); // leave confirmation
  const [cameraError,  setCameraError]  = useState(null);   // webcam permission
  const [multiFace,    setMultiFace]    = useState(false);   // integrity flags
  const [noFace,       setNoFace]       = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const addAlert = useCallback((msg, severity) => {
    const id        = Date.now();
    const timestamp = new Date().toLocaleTimeString();
    setStats(prev => ({
      ...prev,
      alerts: [{ id, msg, severity, timestamp }, ...prev.alerts].slice(0, 10),
    }));
    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        alerts: prev.alerts.filter(a => a.id !== id),
      }));
    }, 8000);
  }, []);

  // Reset inactivity timer on any user interaction
  const resetInactivity = useCallback(() => {
    clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      addAlert('Extended inactivity detected', 'Medium');
      toast('Inactivity detected — are you still there?', { icon: '⚠️' });
    }, 60_000); // 60 seconds of idle
  }, [addAlert]);

  // ── Effects ────────────────────────────────────────────────────────────────

  // 1. Session timer
  useEffect(() => {
    const tick = setInterval(() => setSessionSecs(s => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  // 2. AI monitoring simulation + engagement drift
  useEffect(() => {
    const interval = setInterval(() => {
      // Engagement drift ±5 points
      const newEng = Math.max(0, Math.min(100, stats.engagement + (Math.random() - 0.5) * 5));
      setStats(prev => ({
        ...prev,
        engagement: Math.round(newEng),
        confidence: Math.round(95 + Math.random() * 5),
      }));
      setHistory(prev => [...prev.slice(1), { time: prev.length, val: newEng }]);

      // Simulate random AI events (≈10% chance per cycle)
      if (Math.random() < 0.10) {
        const event = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
        addAlert(event.msg, event.severity);

        // Toggle face detection flags
        if (event.msg.includes('Multiple')) {
          setMultiFace(true);
          setTimeout(() => setMultiFace(false), 6000);
        }
        if (event.msg.includes('No face')) {
          setNoFace(true);
          setTimeout(() => setNoFace(false), 6000);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [stats.engagement, addAlert]);

  // 3. Tab-switch detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        addAlert('Tab switching detected', 'Medium');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [addAlert]);

  // 4. Inactivity tracking
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(e => document.addEventListener(e, resetInactivity));
    resetInactivity(); // start the idle timer immediately
    return () => {
      events.forEach(e => document.removeEventListener(e, resetInactivity));
      clearTimeout(inactivityRef.current);
    };
  }, [resetInactivity]);

  // 5. Fullscreen sync
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleLeaveConfirm = () => {
    setShowLeaveModal(false);
    toast.success('Session ended. Attendance recorded.');
    // Navigate back — defer to avoid state-update-during-render
    setTimeout(() => window.history.back(), 800);
  };

  const handleCameraError = (err) => {
    console.error('Webcam error:', err);
    setCameraError('Camera access denied or unavailable.');
    toast.error('Camera blocked — please grant permission and refresh.');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="min-h-screen bg-dark-lighter p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ── Main Feed Section ──────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-8">

          {/* Header */}
          <div className="glass p-6 rounded-3xl flex flex-wrap justify-between items-center gap-4 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <div>
                <h1 className="text-xl font-bold">Deep Learning CS-402: Live Session</h1>
                <p className="text-sm text-gray-500">Instructor: Dr. Alan Turing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Live session timer */}
              <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm font-mono flex items-center gap-2">
                <FiClock className="text-accent" />
                {formatTime(sessionSecs)}
              </span>
              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
              >
                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
              </button>
              {/* Leave Session */}
              <button
                onClick={() => setShowLeaveModal(true)}
                className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/30 transition-all flex items-center gap-2"
              >
                <FiLogOut className="text-sm" /> Leave Session
              </button>
            </div>
          </div>

          {/* Video & Side Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Webcam feed */}
            <div className="md:col-span-3 relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 group">
              {cameraError ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-dark-lightest">
                  <FiAlertTriangle className="text-6xl text-red-500 mb-4 animate-bounce" />
                  <p className="font-bold text-lg mb-1">Camera Unavailable</p>
                  <p className="text-sm text-gray-400">{cameraError}</p>
                </div>
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  className="w-full h-full object-cover"
                  onUserMediaError={handleCameraError}
                />
              )}

              {/* AI Scanning Line */}
              {!cameraError && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/30 shadow-[0_0_15px_#22d3ee] animate-[scan_4s_linear_infinite]" />
                </div>
              )}

              {/* Face Tracking Box — changes colour when anomaly detected */}
              {!cameraError && (
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 rounded-[4rem] transition-colors duration-500 ${
                  multiFace ? 'border-red-400/60'
                  : noFace   ? 'border-yellow-400/60'
                  : 'border-accent/20'
                }`}>
                  <div className={`absolute -top-10 left-1/2 -translate-x-1/2 text-dark text-[10px] font-bold px-2 py-0.5 rounded transition-colors duration-500 ${
                    multiFace ? 'bg-red-400'    :
                    noFace    ? 'bg-yellow-400' :
                    'bg-accent'
                  }`}>
                    {multiFace ? 'MULTI-FACE ALERT' : noFace ? 'NO FACE DETECTED' : 'IDENTITY VERIFIED'}
                  </div>
                </div>
              )}

              {/* HUD (hover) */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-4">
                  <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <FiCamera className="text-white" />
                  </button>
                  <button onClick={toggleFullscreen} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <FiMonitor className="text-white" />
                  </button>
                </div>
                <div className="glass px-4 py-2 rounded-2xl flex items-center gap-4 border border-white/10">
                  <div className="flex items-center gap-2">
                    <FiActivity className="text-accent" />
                    <span className="text-xs font-bold">ENG: {stats.engagement}%</span>
                  </div>
                  <div className="w-[1px] h-4 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <FiShield className={multiFace || noFace ? 'text-red-400' : 'text-primary'} />
                    <span className="text-xs font-bold">{multiFace || noFace ? 'ALERT' : 'SECURE'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Stats */}
            <div className="space-y-6">
              {/* Engagement chart */}
              <div className="glass p-6 rounded-3xl border border-white/5">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Engagement Score</p>
                <div className="flex items-end gap-2 mb-4">
                  <h2 className={`text-4xl font-black transition-colors ${
                    stats.engagement < 50 ? 'text-red-400' : stats.engagement < 75 ? 'text-yellow-400' : 'text-white'
                  }`}>{stats.engagement}</h2>
                  <span className="text-gray-500 mb-1">/100</span>
                </div>
                <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <Area type="monotone" dataKey="val" stroke="#06b6d4" fill="#06b6d420" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Session Integrity */}
              <div className="glass p-6 rounded-3xl border border-white/5">
                <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider font-bold">Session Integrity</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiUserCheck className="text-accent" /> Identity
                    </div>
                    <span className="text-xs font-bold text-accent">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiLayers className={multiFace ? 'text-red-400' : 'text-primary'} /> Multi-Face
                    </div>
                    <span className={`text-xs font-bold ${multiFace ? 'text-red-400' : 'text-gray-500'}`}>
                      {multiFace ? 'DETECTED' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiMousePointer className="text-secondary" /> Activity
                    </div>
                    <span className="text-xs font-bold text-gray-500">Normal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiMonitor className="text-yellow-400" /> Tab Switches
                    </div>
                    <span className={`text-xs font-bold ${tabSwitches > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {tabSwitches}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Security Logs + Participation ──────────────────── */}
        <div className="space-y-8">

          {/* Security Log */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <FiAlertTriangle className="text-yellow-400" /> Security Logs
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                stats.alerts.length > 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500'
              }`}>
                {tabSwitches + stats.alerts.length} Events
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <AnimatePresence>
                {stats.alerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className={`text-xs font-bold ${SEVERITY_COLOR[alert.severity] ?? 'text-gray-400'}`}>
                        {alert.severity} Severity
                      </p>
                      <span className="text-[10px] text-gray-600 font-mono">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300">{alert.msg}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {stats.alerts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-30">
                  <FiShield className="text-4xl mb-2" />
                  <p className="text-xs">System monitoring active...</p>
                </div>
              )}
            </div>
          </div>

          {/* Participation Grid */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="font-bold mb-6">Class Participation</h3>
            <div className="flex flex-wrap gap-2">
              {Array(12).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-bold text-gray-500">S{i + 1}</span>
                  {i % 4 === 0 && <div className="absolute bottom-1 right-1 w-2 h-2 bg-accent rounded-full" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Leave Session Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setShowLeaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass p-8 rounded-[2rem] border border-white/10 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <FiLogOut className="text-red-400 text-xl" />
                </div>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-2">Leave Session?</h2>
              <p className="text-gray-400 mb-2">
                You have been in session for <span className="text-white font-mono font-bold">{formatTime(sessionSecs)}</span>.
              </p>
              <p className="text-gray-500 text-sm mb-8">
                Your attendance and engagement data will be saved automatically.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 py-3 glass border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all"
                >
                  Stay in Session
                </button>
                <button
                  onClick={handleLeaveConfirm}
                  className="flex-1 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/30 transition-all"
                >
                  Leave Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan animation keyframe */}
      <style>{`
        @keyframes scan {
          0%   { top: 0; }
          50%  { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default LiveClassroom;
