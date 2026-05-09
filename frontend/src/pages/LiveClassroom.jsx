import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMonitor, FiCamera, FiAlertTriangle, FiActivity, FiShield, FiUserCheck, FiMousePointer, FiLayers } from 'react-icons/fi';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const LiveClassroom = () => {
  const webcamRef = useRef(null);
  const [stats, setStats] = useState({
    engagement: 92,
    confidence: 98,
    status: 'Verified',
    alerts: []
  });
  const [history, setHistory] = useState(Array(20).fill(0).map((_, i) => ({ time: i, val: 80 + Math.random() * 20 })));
  const [tabSwitches, setTabSwitches] = useState(0);

  // Simulate AI Processing Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const newEng = Math.max(0, Math.min(100, stats.engagement + (Math.random() - 0.5) * 5));
      setStats(prev => ({
        ...prev,
        engagement: Math.round(newEng),
        confidence: Math.round(95 + Math.random() * 5)
      }));
      setHistory(prev => [...prev.slice(1), { time: prev.length, val: newEng }]);
    }, 2000);

    // Tab Visibility Detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        addAlert("Tab Switching Detected!", "Medium");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stats.engagement]);

  const addAlert = (msg, severity) => {
    const id = Date.now();
    setStats(prev => ({
      ...prev,
      alerts: [{ id, msg, severity }, ...prev.alerts].slice(0, 5)
    }));
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        alerts: prev.alerts.filter(a => a.id !== id)
      }));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-dark-lighter p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Feed Section */}
        <div className="lg:col-span-3 space-y-8">
           {/* Header */}
           <div className="glass p-6 rounded-3xl flex justify-between items-center border border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                 <div>
                    <h1 className="text-xl font-bold">Deep Learning CS-402: Live Session</h1>
                    <p className="text-sm text-gray-500">Instructor: Dr. Alan Turing | Started 42m ago</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm font-mono">00:42:15</span>
                 <button className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/30 transition-all">Leave Session</button>
              </div>
           </div>

           {/* Video & Controls */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-3 relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 group">
                 <Webcam
                    audio={false}
                    ref={webcamRef}
                    className="w-full h-full object-cover"
                 />
                 
                 {/* AI Scanning Effect */}
                 <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/30 shadow-[0_0_15px_#22d3ee] animate-[scan_4s_linear_infinite]"></div>
                 </div>

                 {/* Face Tracking Mock */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-accent/20 rounded-[4rem]">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-accent text-dark text-[10px] font-bold px-2 py-0.5 rounded">
                       IDENTITY VERIFIED
                    </div>
                 </div>

                 {/* Floating Hud */}
                 <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-4">
                       <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"><FiCamera className="text-white"/></button>
                       <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"><FiMonitor className="text-white"/></button>
                    </div>
                    <div className="glass px-4 py-2 rounded-2xl flex items-center gap-4 border border-white/10">
                       <div className="flex items-center gap-2">
                          <FiActivity className="text-accent"/>
                          <span className="text-xs font-bold">ENG: {stats.engagement}%</span>
                       </div>
                       <div className="w-[1px] h-4 bg-white/10"></div>
                       <div className="flex items-center gap-2">
                          <FiShield className="text-primary"/>
                          <span className="text-xs font-bold">SECURE</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Side Stats */}
              <div className="space-y-6">
                 <div className="glass p-6 rounded-3xl border border-white/5">
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">Engagement Score</p>
                    <div className="flex items-end gap-2 mb-4">
                       <h2 className="text-4xl font-black">{stats.engagement}</h2>
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
                             <FiLayers className="text-primary" /> Multi-Face
                          </div>
                          <span className="text-xs font-bold text-gray-500">None</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                             <FiMousePointer className="text-secondary" /> Activity
                          </div>
                          <span className="text-xs font-bold text-gray-500">Normal</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Alerts & Participation */}
        <div className="space-y-8">
           <div className="glass p-8 rounded-[2.5rem] border border-white/5 h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold flex items-center gap-2"><FiAlertTriangle className="text-yellow-400"/> Security Logs</h3>
                 <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{tabSwitches} Events</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                 <AnimatePresence>
                    {stats.alerts.map(alert => (
                       <motion.div 
                          key={alert.id}
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 rounded-2xl bg-white/5 border border-white/5"
                       >
                          <p className="text-xs font-bold text-yellow-400 mb-1">{alert.severity} Severity</p>
                          <p className="text-sm text-gray-300">{alert.msg}</p>
                       </motion.div>
                    ))}
                 </AnimatePresence>
                 {stats.alerts.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-30">
                      <FiShield className="text-4xl mb-2"/>
                      <p className="text-xs">System monitoring active...</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="font-bold mb-6">Class Participation</h3>
              <div className="flex flex-wrap gap-2">
                 {Array(12).fill(0).map((_, i) => (
                   <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-[10px] font-bold text-gray-500">S{i+1}</span>
                      {i % 4 === 0 && <div className="absolute bottom-1 right-1 w-2 h-2 bg-accent rounded-full"></div>}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default LiveClassroom;
