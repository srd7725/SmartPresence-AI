// ===========================================
// ProtectedRoute — Role-based Route Guard
// ===========================================
// Redirects unauthenticated users to /login.
// Optionally restricts access by user role.
// Shows a loading spinner while auth is resolving.
//
// Usage:
//   <ProtectedRoute />                         → any authenticated user
//   <ProtectedRoute allowedRoles={['admin']} /> → admin only
// ===========================================

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // While the auth state is being initialized (token validation), show spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Animated spinner using Tailwind */}
          <div className="w-14 h-14 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role check — if allowedRoles specified, verify user's role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user?.role)) {
      // Redirect to their appropriate dashboard instead of 403
      const rolePaths = {
        student: '/student-dashboard',
        teacher: '/teacher-dashboard',
        admin: '/admin',
      };
      const fallback = rolePaths[user?.role] || '/';
      return <Navigate to={fallback} replace />;
    }
  }

  // Authorized — render child routes
  return <Outlet />;
};

export default ProtectedRoute;
