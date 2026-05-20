// ===========================================
// useAuth — Custom hook to consume AuthContext
// ===========================================
// Provides a clean, simple API to access auth
// state anywhere in the component tree.
// Usage: const { user, login, logout } = useAuth();
// ===========================================

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;
