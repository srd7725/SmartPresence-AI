import React, { useState } from 'react';
import { FiBell, FiShield, FiMonitor, FiMoon, FiGlobe, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
            { id: 'security', label: 'Security & Privacy', icon: <FiShield /> },
            { id: 'appearance', label: 'Appearance', icon: <FiMoon /> },
            { id: 'system', label: 'System Preferences', icon: <FiMonitor /> },
            { id: 'language', label: 'Language & Region', icon: <FiGlobe /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 glass p-8 rounded-[2.5rem] border border-white/5 min-h-[500px]">
          
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { title: "Email Notifications", desc: "Receive updates via email", active: true },
                  { title: "Push Notifications", desc: "Receive push notifications in browser", active: false },
                  { title: "Class Alerts", desc: "Get notified when a class starts", active: true },
                  { title: "Security Alerts", desc: "Get notified on suspicious activity", active: true },
                  { title: "Weekly Reports", desc: "Receive weekly attendance summaries", active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.active ? 'bg-primary' : 'bg-gray-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Security & Privacy</h3>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6">
                <p className="text-sm text-yellow-200">Your biometric data is encrypted and never shared with third parties.</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <h4 className="font-bold text-sm mb-2">Change Password</h4>
                  <p className="text-xs text-gray-400 mb-4">Update your account password</p>
                  <button className="px-4 py-2 glass border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                    Update Password
                  </button>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm mb-1">Two-Factor Authentication</h4>
                    <p className="text-xs text-gray-400">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20">
                    Enable
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== 'notifications' && activeTab !== 'security' && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
              <FiMonitor className="text-5xl mb-4" />
              <p>Settings panel under construction</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-4">
            <button className="px-6 py-2 glass border border-white/10 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 btn-primary-custom rounded-xl font-bold text-sm flex items-center gap-2">
              <FiSave /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
