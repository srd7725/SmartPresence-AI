import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMonitor, FiAlertCircle, FiSettings, FiBarChart2, FiPlus, FiArrowUpRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'CS101', attendance: 85, engagement: 78 },
  { name: 'ML202', attendance: 92, engagement: 88 },
  { name: 'NT303', attendance: 65, engagement: 55 },
  { name: 'SEC404', attendance: 78, engagement: 82 },
];

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row">
      {/* Sidebar - Placeholder */}
      <div className="w-full md:w-64 glass-dark border-r border-white/5 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">SP</div>
          <span className="font-bold text-lg">SmartPresence</span>
        </div>
        <nav className="flex flex-col gap-2">
           <button className="flex items-center gap-3 p-3 bg-secondary/10 text-secondary rounded-xl font-medium"><FiMonitor /> Classes</button>
           <button className="flex items-center gap-3 p-3 hover:bg-white/5 text-gray-400 rounded-xl font-medium transition-all"><FiUsers /> Students</button>
           <button className="flex items-center gap-3 p-3 hover:bg-white/5 text-gray-400 rounded-xl font-medium transition-all"><FiBarChart2 /> Reports</button>
           <button className="flex items-center gap-3 p-3 hover:bg-white/5 text-gray-400 rounded-xl font-medium transition-all"><FiSettings /> Settings</button>
        </nav>
      </div>

      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Instructor Console</h1>
            <p className="text-gray-400">Monitoring 4 active sessions</p>
          </div>
          <button className="px-6 py-3 btn-primary-custom rounded-xl font-bold flex items-center gap-2 shadow-lg">
             <FiPlus /> New Class
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
           <div className="glass p-8 rounded-[2rem] border-l-4 border-accent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><FiUsers className="text-6xl"/></div>
              <p className="text-gray-400 text-sm mb-1">Total Students</p>
              <h2 className="text-4xl font-bold mb-4">1,248</h2>
              <div className="flex items-center text-accent text-sm font-bold gap-1">
                 <FiArrowUpRight /> +12% from last month
              </div>
           </div>
           <div className="glass p-8 rounded-[2rem] border-l-4 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><FiMonitor className="text-6xl"/></div>
              <p className="text-gray-400 text-sm mb-1">Live Classes</p>
              <h2 className="text-4xl font-bold mb-4">04</h2>
              <div className="flex items-center text-primary text-sm font-bold gap-1">
                 <FiActivity className="animate-pulse" /> 182 students online
              </div>
           </div>
           <div className="glass p-8 rounded-[2rem] border-l-4 border-red-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><FiAlertCircle className="text-6xl"/></div>
              <p className="text-gray-400 text-sm mb-1">Suspicious Activity</p>
              <h2 className="text-4xl font-bold mb-4 text-red-400">03</h2>
              <div className="flex items-center text-red-400 text-sm font-bold gap-1">
                 Requires immediate attention
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
           {/* Analytics */}
           <div className="glass p-8 rounded-[2.5rem]">
              <h3 className="text-xl font-bold mb-8">Classroom Engagement</h3>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="name" stroke="#64748b" />
                       <YAxis stroke="#64748b" />
                       <Tooltip 
                         cursor={{fill: '#ffffff05'}}
                         contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                       />
                       <Bar dataKey="engagement" radius={[8, 8, 0, 0]}>
                          {data.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 2 ? '#f87171' : '#6366f1'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Live Monitoring */}
           <div className="glass p-8 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold">Active Sessions</h3>
                 <span className="text-xs text-accent font-mono animate-pulse">● LIVE UPDATES</span>
              </div>
              <div className="space-y-4">
                 {[
                   { name: "Intro to ML", id: "ML-202", count: 42, alerts: 0, health: 95 },
                   { name: "Cyber Security", id: "CS-404", count: 38, alerts: 2, health: 78 },
                   { name: "Data Structures", id: "DS-101", count: 56, alerts: 1, health: 88 }
                 ].map((session, i) => (
                   <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-dark-lightest rounded-2xl flex items-center justify-center font-bold text-gray-400">
                            {session.id.split('-')[0]}
                         </div>
                         <div>
                            <h4 className="font-bold">{session.name}</h4>
                            <p className="text-xs text-gray-500">{session.count} Students Connected</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-sm font-bold ${session.alerts > 0 ? 'text-red-400' : 'text-accent'}`}>
                            {session.alerts > 0 ? `${session.alerts} Alerts` : 'Secure'}
                         </p>
                         <div className="w-24 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${session.health}%` }}></div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const FiActivity = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);

export default TeacherDashboard;
