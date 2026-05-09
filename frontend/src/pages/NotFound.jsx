import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-6">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20"
        >
          <FiAlertCircle className="text-6xl text-red-500" />
        </motion.div>
        
        <h1 className="text-9xl font-black text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">404</h1>
        
        <h2 className="text-4xl font-bold mb-4">Oops! Page Lost in Space</h2>
        <p className="text-gray-400 mb-10">The page you're looking for doesn't exist or has been moved to another dimension.</p>
        
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 btn-primary-custom rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform">
          <FiHome /> Back to Reality
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
