import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiServer, FiShield, FiAlertTriangle, FiSearch, FiMoreVertical, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockSystemData = [
  { time: '00:00', load: 30, requests: 120 },
  { time: '04:00', load: 20, requests: 80 },
  { time: '08:00', load: 60, requests: 450 },
  { time: '12:00', load: 85, requests: 800 },
  { time: '16:00', load: 70, requests: 650 },
  { time: '20:00', load: 40, requests: 200 },
];

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@uni.edu', role: 'Student', status: 'Active', lastLogin: '2 mins ago' },
  { id: '2', name: 'Jane Smith', email: 'jane@uni.edu', role: 'Teacher', status: 'Active', lastLogin: '1 hour ago' },
  { id: '3', name: 'Alice Johnson', email: 'alice@uni.edu', role: 'Student', status: 'Suspended', lastLogin: '2 days ago' },
  { id: '4', name: 'Dr. Alan Turing', email: 'turing@uni.edu', role: 'Admin', status: 'Active', lastLogin: 'Just now' },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-gray-400">System management and platform configuration</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 glass border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/5 transition-all">
            Download Logs
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-xl text-sm font-semibold shadow-lg shadow-primary/20">
            System Updates
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", val: "15,248", icon: <FiUsers />, color: "text-primary" },
          { label: "Active Servers", val: "12", icon: <FiServer />, color: "text-accent" },
          { label: "Security Status", val: "Optimal", icon: <FiShield />, color: "text-green-400" },
          { label: "Pending Alerts", val: "14", icon: <FiAlertTriangle />, color: "text-red-400" }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-[2rem] border border-white/5"
          >
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.val}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Management Tables */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              {['users', 'classes', 'reports'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                    activeTab === tab ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 text-white w-full md:w-64"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            {activeTab === 'users' && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 sticky top-0">
                  <tr>
                    <th className="p-4 text-sm font-bold text-gray-400 border-b border-white/5">Name</th>
                    <th className="p-4 text-sm font-bold text-gray-400 border-b border-white/5 hidden md:table-cell">Role</th>
                    <th className="p-4 text-sm font-bold text-gray-400 border-b border-white/5">Status</th>
                    <th className="p-4 text-sm font-bold text-gray-400 border-b border-white/5 hidden sm:table-cell">Last Login</th>
                    <th className="p-4 text-sm font-bold text-gray-400 border-b border-white/5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.role === 'Admin' ? 'bg-accent/20 text-accent' : 
                          user.role === 'Teacher' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {user.status === 'Active' ? <FiCheckCircle className="text-green-400" /> : <FiXCircle className="text-red-400" />}
                          <span className="text-sm">{user.status}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-400 hidden sm:table-cell">{user.lastLogin}</td>
                      <td className="p-4 text-center">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <FiMoreVertical className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {activeTab !== 'users' && (
              <div className="h-full flex items-center justify-center text-gray-500 flex-col gap-4">
                <FiServer className="text-4xl opacity-50" />
                <p>Data available for specific modules</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: System Load Chart */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 h-[350px] flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold">System Load Monitoring</h3>
              <p className="text-xs text-gray-400">Server CPU usage vs API Requests</p>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSystemData}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="load" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-6 rounded-[2.5rem] border border-white/5">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors">
                <span className="text-sm font-semibold">Generate Master Report</span>
                <FiServer className="text-primary" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors">
                <span className="text-sm font-semibold">Clear System Cache</span>
                <FiAlertTriangle className="text-accent" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors">
                <span className="text-sm font-semibold">Emergency Platform Halt</span>
                <FiShield />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
