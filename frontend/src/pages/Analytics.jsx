import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity, FiUsers, FiClock, FiFileText, FiDownload } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const attendanceData = [
  { name: 'Week 1', present: 88, absent: 12 },
  { name: 'Week 2', present: 92, absent: 8 },
  { name: 'Week 3', present: 85, absent: 15 },
  { name: 'Week 4', present: 95, absent: 5 },
];

const engagementData = [
  { time: '09:00', score: 85 },
  { time: '09:15', score: 88 },
  { time: '09:30', score: 75 },
  { time: '09:45', score: 82 },
  { time: '10:00', score: 90 },
];

const pieData = [
  { name: 'Present', value: 75, color: '#06b6d4' },
  { name: 'Late', value: 15, color: '#6366f1' },
  { name: 'Absent', value: 10, color: '#f87171' },
];

const Analytics = () => {
  return (
    <div className="min-h-screen bg-dark p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Platform Analytics</h1>
            <p className="text-gray-400">Deep insights into attendance and student behavior</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 glass border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-bold">
            <FiDownload /> Export Full Report
          </button>
        </div>

        {/* Global Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           {[
             { label: "Avg. Attendance", val: "91.2%", icon: <FiTrendingUp />, trend: "+2.4%" },
             { label: "Avg. Engagement", val: "84/100", icon: <FiActivity />, trend: "+1.8%" },
             { label: "Total Sessions", val: "154", icon: <FiClock />, trend: "+12" },
             { label: "Alerts Triggered", val: "28", icon: <FiFileText />, trend: "-5" }
           ].map((stat, i) => (
             <div key={i} className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{stat.icon}</div>
                   <span className="text-[10px] font-bold text-accent">{stat.trend}</span>
                </div>
                <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.val}</h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Attendance Trends */}
           <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-xl font-bold mb-8">Attendance Trends (Monthly)</h3>
              <div className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                       <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                       <Tooltip 
                         cursor={{fill: '#ffffff05'}}
                         contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                       />
                       <Bar dataKey="present" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                       <Bar dataKey="absent" fill="#f87171" radius={[10, 10, 0, 0]} barSize={40} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Distribution */}
           <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
              <h3 className="text-xl font-bold mb-8 w-full">Presence Distribution</h3>
              <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                       >
                          {pieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="w-full space-y-3 mt-4">
                 {pieData.map((item, i) => (
                   <div key={i} className="flex justify-between items-center px-4 py-2 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                         <span className="text-sm text-gray-400">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold">{item.value}%</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Live Engagement Line */}
           <div className="lg:col-span-3 glass p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-xl font-bold mb-8">Real-time Engagement Flow</h3>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                       <XAxis dataKey="time" stroke="#64748b" axisLine={false} tickLine={false} />
                       <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }}
                       />
                       <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={4} dot={{ r: 6, fill: '#06b6d4' }} activeDot={{ r: 8 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
