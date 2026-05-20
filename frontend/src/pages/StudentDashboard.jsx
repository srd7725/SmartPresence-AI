import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiActivity, FiUser, FiAward, FiAlertTriangle, FiBookOpen } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuth from '../hooks/useAuth';

const data = [
  { name: 'Mon', attendance: 100, engagement: 85 },
  { name: 'Tue', attendance: 100, engagement: 92 },
  { name: 'Wed', attendance: 0, engagement: 0 },
  { name: 'Thu', attendance: 100, engagement: 78 },
  { name: 'Fri', attendance: 100, engagement: 95 },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  
  const displayName = user?.full_name || 'Student User';
  const displayDepartment = user?.department || 'Not Assigned';
  const displayEnrollment = user?.enrollment_number || 'N/A';

  return (
    <div className="space-y-8">
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-400">Welcome back, {displayName}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Attendance", value: "92%", icon: <FiCheckCircle className="text-accent"/>, color: "bg-accent/10" },
          { label: "Engagement", value: "88/100", icon: <FiActivity className="text-primary"/>, color: "bg-primary/10" },
          { label: "Classes Attended", value: "48", icon: <FiBookOpen className="text-secondary"/>, color: "bg-secondary/10" },
          { label: "Warnings", value: "2", icon: <FiAlertTriangle className="text-red-400"/>, color: "bg-red-400/10" }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-3xl border border-white/5"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Performance & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-xl font-bold mb-8">Weekly Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="engagement" stroke="#6366f1" fillOpacity={1} fill="url(#colorEngagement)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="glass p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-xl font-bold mb-6">Today's Schedule</h3>
          <div className="space-y-4">
            {[
              { time: "09:00 AM", subject: "Machine Learning", prof: "Dr. Smith", status: "Active" },
              { time: "11:30 AM", subject: "Computer Networks", prof: "Prof. Johnson", status: "Upcoming" },
              { time: "02:00 PM", subject: "Cyber Security", prof: "Dr. Brown", status: "Upcoming" }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-accent">{item.time}</span>
                  {item.status === 'Active' && <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] animate-pulse">LIVE</span>}
                </div>
                <h4 className="font-bold">{item.subject}</h4>
                <p className="text-xs text-gray-500">{item.prof}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FiCheckCircle = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default StudentDashboard;
