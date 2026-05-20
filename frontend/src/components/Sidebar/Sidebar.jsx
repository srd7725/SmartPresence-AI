import { NavLink } from 'react-router-dom';
import { FiHome, FiVideo, FiActivity, FiUsers, FiSettings, FiX, FiCpu, FiCamera, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar, toggleSidebarCollapse }) => {
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
        className={`fixed md:static inset-y-0 left-0 z-50 ${isCollapsed ? 'w-64 md:w-20' : 'w-64'} glass-dark border-r border-white/5 flex flex-col md:translate-x-0 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className={`h-16 flex items-center justify-between border-b border-white/5 ${isCollapsed ? 'px-4' : 'px-6'}`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <FiCpu className="text-white text-sm" />
            </div>
            {!isCollapsed && <span className="text-lg font-bold text-gradient truncate">SmartPresence</span>}
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="hidden md:flex justify-end px-4 pt-4">
          <button
            onClick={toggleSidebarCollapse}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
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
                `group relative flex items-center ${isCollapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1 border border-transparent'
                }`
              }
              title={isCollapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-lg shadow-primary/40" />}
                  <span className="text-lg flex h-6 w-6 items-center justify-center shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/5 text-center">
          <div className="p-4 glass rounded-2xl border border-primary/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {!isCollapsed && <p className="text-xs text-gray-400 relative z-10">AI Monitoring Active</p>}
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
