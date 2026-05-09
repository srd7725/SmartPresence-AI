import React from 'react';
import { Outlet } from 'react-router-dom';
// import Navbar from '../components/Navbar/Navbar'; // We will create this later
// import Footer from '../components/Footer/Footer'; // Or keep footer in landing

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-dark text-white font-sans flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
