// ===========================================
// AuthContext — Global Authentication State
// ===========================================
// Provides: user, isAuthenticated, loading,
//           login(), logout(), refreshUser()
// Persists auth across page refreshes via
// localStorage token + GET /auth/me validation.
// ===========================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true on initial load to check stored token

  // Derived state
  const isAuthenticated = !!user;

  // ----- LOGIN -----
  // Called after a successful login API call
  // Stores the token and user data, then updates context state
  const login = useCallback((token, userData) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // ----- LOGOUT -----
  // Clears all auth state and storage
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // ----- REFRESH USER -----
  // Re-fetches user profile from backend using stored token
  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch {
      // Token invalid or expired — clear everything
      logout();
      return null;
    }
  }, [logout]);

  // ----- ON APP LOAD / REFRESH -----
  // Check if a token exists and validate it with the backend
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (token) {
        try {
          // Validate the stored token by fetching user profile
          const response = await getCurrentUser();
          const userData = response.data;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } catch {
          // Token is expired or invalid — clean up
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
