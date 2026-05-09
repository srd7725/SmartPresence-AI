import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close sidebar by default on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background glow effects for dashboard */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
