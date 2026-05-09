import React, { useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="glass-dark border-b border-white/5 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left section: Mobile menu toggle & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden text-gray-300 hover:text-white transition-colors"
        >
          <FiMenu className="text-2xl" />
        </button>
        
        <div className="hidden md:flex items-center glass px-3 py-1.5 rounded-full border border-white/10 w-64 group focus-within:border-primary/50 transition-colors">
          <FiSearch className="text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search classes, students..." 
            className="bg-transparent border-none outline-none text-sm text-white ml-2 w-full placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right section: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5"
          >
            <FiBell className="text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Notifications Dropdown (Mock) */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 glass p-4 rounded-2xl border border-white/10 shadow-2xl">
              <h4 className="text-sm font-bold mb-3">Notifications</h4>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-white/5 text-sm">
                  <p className="font-semibold text-accent">New class started</p>
                  <p className="text-xs text-gray-400">CS-402 is now live</p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-sm">
                  <p className="font-semibold text-red-400">Alert: Multiple faces detected</p>
                  <p className="text-xs text-gray-400">In session ML-202</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-tight">Admin User</p>
            <p className="text-xs text-primary font-medium leading-tight">Administrator</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-white/10 hover:border-white/30 transition-all shadow-lg overflow-hidden relative">
            <FiUser className="text-white relative z-10" />
            <div className="absolute inset-0 bg-white/10 hover:bg-transparent transition-colors z-20"></div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
