import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark text-white font-sans flex items-center justify-center relative overflow-hidden">
      {/* Global Background Accents for Auth */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      
      <div className="w-full h-full flex items-center justify-center z-10 relative">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
