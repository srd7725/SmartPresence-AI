import React from 'react';
import { FiUser, FiMail, FiBook, FiAward, FiEdit2, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-32 h-32 rounded-full bg-dark border-4 border-dark overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FiUser className="text-5xl text-white" />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm">
              <FiEdit2 className="text-white text-xl" />
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-1">John Doe</h1>
              <p className="text-primary font-medium flex items-center justify-center md:justify-start gap-2">
                <FiBook /> Computer Science Major
              </p>
            </div>
            <button className="px-6 py-2 glass border border-white/10 hover:bg-white/5 transition-all rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <FiEdit2 /> Edit Profile
            </button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-gray-400 flex items-center gap-2">
              <FiMail /> john@university.edu
            </span>
            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-gray-400 flex items-center gap-2">
              <FiAward /> Enrollment: 2024CS001
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="md:col-span-1 space-y-8">
          <div className="glass p-6 rounded-[2rem] border border-white/5">
            <h3 className="text-lg font-bold mb-4">Biometric Status</h3>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <FiShield />
              </div>
              <div>
                <p className="font-bold text-sm text-green-400">Enrolled & Active</p>
                <p className="text-xs text-gray-400">Face data securely stored</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm text-primary font-bold hover:underline">
              Retake Biometrics
            </button>
          </div>

          <div className="glass p-6 rounded-[2rem] border border-white/5">
            <h3 className="text-lg font-bold mb-4">Account Settings</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-medium">
              <li className="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">Change Password</li>
              <li className="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">Notification Preferences</li>
              <li className="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">Privacy Settings</li>
            </ul>
          </div>
        </div>

        {/* Academic Details Column */}
        <div className="md:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-2xl font-bold mb-6">Academic Overview</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <p className="text-xs text-gray-400 mb-1">Current Semester</p>
              <p className="font-bold">Fall 2026</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <p className="text-xs text-gray-400 mb-1">Total Credits</p>
              <p className="font-bold">84 / 120</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <p className="text-xs text-gray-400 mb-1">Overall Attendance</p>
              <p className="font-bold text-accent">92%</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <p className="text-xs text-gray-400 mb-1">Academic Standing</p>
              <p className="font-bold text-primary">Good</p>
            </div>
          </div>

          <h4 className="text-lg font-bold mb-4">Enrolled Courses</h4>
          <div className="space-y-3">
            {[
              { code: 'CS-402', name: 'Deep Learning', prof: 'Dr. Alan Turing' },
              { code: 'ML-202', name: 'Machine Learning', prof: 'Dr. Andrew Ng' },
              { code: 'SEC-404', name: 'Cyber Security', prof: 'Prof. Alice' },
            ].map((course, i) => (
              <div key={i} className="flex justify-between items-center p-4 hover:bg-white/5 border border-white/5 rounded-xl transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-dark-lighter flex items-center justify-center font-bold text-gray-500 text-sm">
                    {course.code.split('-')[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{course.name}</p>
                    <p className="text-xs text-gray-400">{course.prof}</p>
                  </div>
                </div>
                <button className="text-primary text-sm font-semibold hover:underline">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
