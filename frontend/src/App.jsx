import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen text-white bg-dark">
        <AppRoutes />
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass-dark border border-white/10 text-white font-medium rounded-2xl',
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
