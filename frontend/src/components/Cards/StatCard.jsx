import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, trend, colorClass = "text-primary", bgClass = "bg-primary/10" }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl ${bgClass} flex items-center justify-center text-xl ${colorClass}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1 relative z-10">{label}</p>
      <h3 className="text-2xl font-bold relative z-10">{value}</h3>
      
      {/* Hover glow effect */}
      <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-${colorClass.replace('text-', '')}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    </motion.div>
  );
};

export default StatCard;
