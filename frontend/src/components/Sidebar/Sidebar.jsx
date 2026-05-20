import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiVideo, FiActivity, FiUsers, FiSettings, FiX, FiCpu, FiCamera } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  // Define navigation items with role restrictions if applicable
  const allNavItems = [
    { 
      name: 'Student Dashboard', 
      path: '/student-dashboard', 
      icon: <FiHome />,
      roles: ['student']
    },
    { 
      name: 'Teacher Dashboard', 
      path: '/teacher-dashboard', 
      icon: <FiUsers />,
      roles: ['teacher']
    },
    { 
      name: 'Admin Panel', 
      path: '/admin', 
      icon: <FiSettings />,
      roles: ['admin']
    },
    { 
      name: 'Live Classroom', 
      path: '/live-classroom', 
      icon: <FiVideo />,
      roles: ['student', 'teacher', 'admin']
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: <FiActivity />,
      roles: ['student', 'teacher', 'admin']
    },
    {
      name: 'Face Enrollment',
      path: '/face-enrollment',
      icon: <FiCamera />,
      roles: ['student'] // Students enroll their faces
    }
  ];

  // Filter navigation items based on current user's role
  const navItems = allNavItems.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 glass-dark border-r border-white/5 flex flex-col md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <FiCpu className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold text-gradient">SmartPresence</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/5 text-center">
          <div className="p-4 glass rounded-2xl border border-primary/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-xs text-gray-400 relative z-10">AI Monitoring Active</p>
            <div className="flex justify-center mt-2 space-x-1 relative z-10">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
