// ===========================================
// Navbar — with real user data + logout button
// ===========================================

import { useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New class started', detail: 'CS-402 is now live', tone: 'text-accent', unread: true },
    { id: 2, title: 'Alert: Multiple faces detected', detail: 'In session ML-202', tone: 'text-red-400', unread: true },
    { id: 3, title: 'Database backup complete', detail: 'Automated backup finished successfully', tone: 'text-green-400', unread: false },
  ]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  // Handle logout — clears auth state and redirects to login
  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const markNotificationsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
    toast.success('Notifications marked as read');
  };

  // Get display name and role label from real user data
  const displayName = user?.full_name || 'User';
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : '';
  // First initials for avatar fallback
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <nav className="glass-dark border-b border-white/5 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Mobile menu toggle & Search */}
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

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5"
          >
            <FiBell className="text-xl" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 glass p-4 rounded-2xl border border-white/10 shadow-2xl z-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold">Notifications</h4>
                <button onClick={markNotificationsRead} className="text-xs text-primary hover:text-primary-light transition-colors">
                  Mark read
                </button>
              </div>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => {
                      setNotifications((current) => current.map((item) => (
                        item.id === notification.id ? { ...item, unread: false } : item
                      )));
                      toast.success(notification.title);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-semibold ${notification.tone}`}>{notification.title}</p>
                      {notification.unread && <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400">{notification.detail}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="text-right hidden sm:block">
            {/* Real user data from AuthContext */}
            <p className="text-sm font-bold leading-tight">{displayName}</p>
            <p className="text-xs text-primary font-medium leading-tight">{roleLabel}</p>
          </div>

          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-white/10 hover:border-white/30 transition-all shadow-lg text-xs font-bold">
              {initials || <FiUser className="text-white" />}
            </div>
            <FiChevronDown className={`text-gray-400 text-xs transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile dropdown menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-14 w-52 glass p-2 rounded-2xl border border-white/10 shadow-2xl z-50">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-sm font-bold truncate">{displayName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium"
              >
                <FiLogOut />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setShowNotifications(false); setShowProfileMenu(false); }}
        />
      )}
    </nav>
  );
};

export default Navbar;
