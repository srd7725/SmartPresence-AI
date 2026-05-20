import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDatabase,
  FiEdit3,
  FiMoreVertical,
  FiSearch,
  FiServer,
  FiShield,
  FiSlash,
  FiTrash2,
  FiUsers,
  FiWifi,
  FiXCircle,
} from 'react-icons/fi';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const baseSystemData = [
  { time: '00:00', load: 30, requests: 120, memory: 38 },
  { time: '04:00', load: 20, requests: 80, memory: 34 },
  { time: '08:00', load: 60, requests: 450, memory: 58 },
  { time: '12:00', load: 85, requests: 800, memory: 72 },
  { time: '16:00', load: 70, requests: 650, memory: 64 },
  { time: '20:00', load: 40, requests: 200, memory: 46 },
];

const seedUsers = [
  { id: '1', name: 'John Doe', email: 'john@uni.edu', role: 'Student', status: 'Active', lastLogin: '2 mins ago', devices: 1 },
  { id: '2', name: 'Jane Smith', email: 'jane@uni.edu', role: 'Teacher', status: 'Active', lastLogin: '1 hour ago', devices: 2 },
  { id: '3', name: 'Alice Johnson', email: 'alice@uni.edu', role: 'Student', status: 'Suspended', lastLogin: '2 days ago', devices: 1 },
  { id: '4', name: 'Dr. Alan Turing', email: 'turing@uni.edu', role: 'Admin', status: 'Active', lastLogin: 'Just now', devices: 3 },
  { id: '5', name: 'Grace Hopper', email: 'grace@uni.edu', role: 'Teacher', status: 'Active', lastLogin: '12 mins ago', devices: 1 },
  { id: '6', name: 'Katherine Johnson', email: 'katherine@uni.edu', role: 'Student', status: 'Pending', lastLogin: '4 hours ago', devices: 2 },
  { id: '7', name: 'Ada Lovelace', email: 'ada@uni.edu', role: 'Admin', status: 'Active', lastLogin: '28 mins ago', devices: 1 },
  { id: '8', name: 'Claude Shannon', email: 'claude@uni.edu', role: 'Teacher', status: 'Suspended', lastLogin: '5 days ago', devices: 1 },
];

const securityAlerts = [
  { title: 'Suspicious login attempt', detail: 'Blocked admin login from new region', tone: 'text-red-400', time: '2 mins ago' },
  { title: 'Multiple device detection', detail: 'Jane Smith active on 2 devices', tone: 'text-accent', time: '14 mins ago' },
  { title: 'Face mismatch alert', detail: 'CS-402 attendance verification failed', tone: 'text-red-400', time: '31 mins ago' },
];

const loginHistory = [
  { user: 'Dr. Alan Turing', device: 'Chrome / Windows', status: 'Verified', time: 'Just now' },
  { user: 'Jane Smith', device: 'Safari / iPad', status: 'Multiple devices', time: '14 mins ago' },
  { user: 'John Doe', device: 'Edge / Windows', status: 'Verified', time: '2 mins ago' },
  { user: 'Unknown session', device: 'Firefox / Linux', status: 'Blocked', time: '39 mins ago' },
];

const roleOptions = ['All', 'Admin', 'Teacher', 'Student'];
const statusOptions = ['All', 'Active', 'Suspended', 'Pending'];
const rowsPerPage = 5;

const StatSkeleton = () => (
  <div className="glass p-6 rounded-[2rem] border border-white/5 animate-pulse">
    <div className="w-12 h-12 rounded-2xl bg-white/10 mb-4" />
    <div className="h-3 w-24 bg-white/10 rounded mb-3" />
    <div className="h-7 w-20 bg-white/10 rounded" />
  </div>
);

const StatusIcon = ({ status }) => {
  if (status === 'Active' || status === 'Verified') return <FiCheckCircle className="text-green-400" />;
  if (status === 'Suspended' || status === 'Blocked') return <FiXCircle className="text-red-400" />;
  return <FiAlertTriangle className="text-accent" />;
};

const RoleBadge = ({ role }) => (
  <span className={`px-2 py-1 rounded text-xs font-bold ${
    role === 'Admin' ? 'bg-accent/20 text-accent' :
    role === 'Teacher' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
  }`}>
    {role}
  </span>
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(seedUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveStats, setLiveStats] = useState({
    totalUsers: 15248,
    servers: 12,
    alerts: 14,
    uptime: '99.98%',
    apiResponse: 126,
    memory: 64,
  });
  const [systemData, setSystemData] = useState(baseSystemData);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((current) => ({
        ...current,
        totalUsers: current.totalUsers + Math.floor(Math.random() * 4),
        alerts: Math.max(6, current.alerts + Math.floor(Math.random() * 3) - 1),
        apiResponse: Math.max(92, current.apiResponse + Math.floor(Math.random() * 13) - 6),
        memory: Math.min(82, Math.max(42, current.memory + Math.floor(Math.random() * 7) - 3)),
      }));
      setSystemData((current) => current.map((point) => ({
        ...point,
        load: Math.min(92, Math.max(18, point.load + Math.floor(Math.random() * 9) - 4)),
        memory: Math.min(86, Math.max(30, point.memory + Math.floor(Math.random() * 7) - 3)),
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return users
      .filter((user) => {
        const matchesSearch = [user.name, user.email, user.role, user.status]
          .some((value) => value.toLowerCase().includes(normalizedSearch));
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        const first = a[sortConfig.key].toLowerCase();
        const second = b[sortConfig.key].toLowerCase();
        if (first === second) return 0;
        const order = first > second ? 1 : -1;
        return sortConfig.direction === 'asc' ? order : -order;
      });
  }, [roleFilter, searchTerm, sortConfig, statusFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const requestSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleUserAction = (action, user) => {
    setOpenMenu(null);

    if (action === 'Delete') {
      setUsers((current) => current.filter((item) => item.id !== user.id));
      toast.success(`${user.name} deleted`);
      return;
    }

    if (action === 'Suspend') {
      setUsers((current) => current.map((item) => (
        item.id === user.id ? { ...item, status: item.status === 'Suspended' ? 'Active' : 'Suspended' } : item
      )));
      toast.success(`${user.name} status updated`);
      return;
    }

    if (action === 'Edit') {
      toast.success(`Edit panel opened for ${user.name}`);
      return;
    }

    const nextRole = user.role === 'Student' ? 'Teacher' : user.role === 'Teacher' ? 'Admin' : 'Student';
    setUsers((current) => current.map((item) => (
      item.id === user.id ? { ...item, role: nextRole } : item
    )));
    toast.success(`${user.name} changed to ${nextRole}`);
  };

  const stats = [
    { label: 'Total Users', val: liveStats.totalUsers.toLocaleString(), icon: <FiUsers />, color: 'text-primary' },
    { label: 'Active Servers', val: liveStats.servers, icon: <FiServer />, color: 'text-accent' },
    { label: 'Security Status', val: 'Optimal', icon: <FiShield />, color: 'text-green-400' },
    { label: 'Pending Alerts', val: liveStats.alerts, icon: <FiAlertTriangle />, color: 'text-red-400' },
  ];

  const systemCards = [
    { label: 'Server Uptime', val: liveStats.uptime, icon: <FiWifi />, color: 'text-green-400' },
    { label: 'Database Health', val: 'Healthy', icon: <FiDatabase />, color: 'text-accent' },
    { label: 'API Response', val: `${liveStats.apiResponse}ms`, icon: <FiActivity />, color: 'text-primary' },
    { label: 'Memory Usage', val: `${liveStats.memory}%`, icon: <FiServer />, color: 'text-secondary' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-gray-400">System management and platform configuration</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast.success('Logs export queued')} className="px-4 py-2 glass border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/5 transition-all">
            Download Logs
          </button>
          <button onClick={() => toast.success('System update scan started')} className="px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-xl text-sm font-semibold shadow-lg shadow-primary/20">
            System Updates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading ? stats.map((_, i) => <StatSkeleton key={i} />) : stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-[680px]">
          <div className="p-6 border-b border-white/5 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl overflow-x-auto">
              {['users', 'security', 'reports'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                    activeTab === tab ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 text-white w-full md:w-64"
                />
              </div>
              <select value={roleFilter} onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }} className="bg-dark border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary/50 text-white">
                {roleOptions.map((role) => <option key={role}>{role}</option>)}
              </select>
              <select value={statusFilter} onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }} className="bg-dark border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary/50 text-white">
                {statusOptions.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-0">
            {activeTab === 'users' && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur">
                  <tr>
                    {[
                      ['name', 'Name'],
                      ['role', 'Role'],
                      ['status', 'Status'],
                      ['lastLogin', 'Last Login'],
                    ].map(([key, label]) => (
                      <th key={key} onClick={() => requestSort(key)} className={`p-4 text-sm font-bold text-gray-400 border-b border-white/5 cursor-pointer select-none ${key === 'role' ? 'hidden md:table-cell' : ''} ${key === 'lastLogin' ? 'hidden sm:table-cell' : ''}`}>
                        {label} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </th>
                    ))}
                    <th className="p-4 text-sm font-bold text-gray-400 border-b border-white/5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="p-4">
                        <div className="font-bold">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="p-4 hidden md:table-cell"><RoleBadge role={user.role} /></td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon status={user.status} />
                          <span className="text-sm">{user.status}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-400 hidden sm:table-cell">{user.lastLogin}</td>
                      <td className="p-4 text-center relative">
                        <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <FiMoreVertical className="text-gray-400" />
                        </button>
                        {openMenu === user.id && (
                          <div className="absolute right-4 top-12 z-20 w-44 glass p-2 rounded-2xl border border-white/10 shadow-2xl text-left">
                            {[
                              ['Edit', <FiEdit3 />],
                              ['Change Role', <FiUsers />],
                              ['Suspend', <FiSlash />],
                              ['Delete', <FiTrash2 />],
                            ].map(([action, icon]) => (
                              <button key={action} onClick={() => handleUserAction(action, user)} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all ${action === 'Delete' ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-white/5'}`}>
                                {icon}
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'security' && (
              <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold">Security Alerts</h3>
                  {securityAlerts.map((alert) => (
                    <div key={alert.title} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <FiAlertTriangle className={`${alert.tone} mt-1`} />
                        <div>
                          <p className="font-semibold">{alert.title}</p>
                          <p className="text-sm text-gray-400">{alert.detail}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold">Login History</h3>
                  {loginHistory.map((entry) => (
                    <div key={`${entry.user}-${entry.time}`} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{entry.user}</p>
                          <p className="text-sm text-gray-400">{entry.device}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <StatusIcon status={entry.status} />
                            <span>{entry.status}</span>
                          </div>
                          <p className="text-xs text-gray-500">{entry.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="h-full flex items-center justify-center text-gray-500 flex-col gap-4">
                <FiServer className="text-4xl opacity-50" />
                <p>Data available for specific modules</p>
              </div>
            )}
          </div>

          {activeTab === 'users' && (
            <div className="p-4 border-t border-white/5 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-400">Showing {visibleUsers.length} of {filteredUsers.length} users</p>
              <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="p-2 glass border border-white/10 rounded-xl disabled:opacity-40 hover:bg-white/5 transition-all">
                  <FiChevronLeft />
                </button>
                <span className="text-sm text-gray-400">{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="p-2 glass border border-white/10 rounded-xl disabled:opacity-40 hover:bg-white/5 transition-all">
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 h-[350px] flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold">System Load Monitoring</h3>
              <p className="text-xs text-gray-400">Server CPU usage vs API Requests</p>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={systemData}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={30} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                  <Area isAnimationActive animationDuration={900} type="monotone" dataKey="load" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {systemCards.map((card) => (
              <div key={card.label} className="glass p-4 rounded-[2rem] border border-white/5">
                <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-3 ${card.color}`}>{card.icon}</div>
                <p className="text-xs text-gray-400">{card.label}</p>
                <h3 className="text-xl font-bold">{card.val}</h3>
              </div>
            ))}
          </div>

          <div className="glass p-6 rounded-[2.5rem] border border-white/5 h-[240px] flex flex-col">
            <h3 className="font-bold mb-4">Memory Usage Graph</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                  <Line isAnimationActive animationDuration={900} type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-6 rounded-[2.5rem] border border-white/5">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => toast.success('Master report generation started')} className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors">
                <span className="text-sm font-semibold">Generate Master Report</span>
                <FiServer className="text-primary" />
              </button>
              <button onClick={() => toast.success('System cache cleared')} className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors">
                <span className="text-sm font-semibold">Clear System Cache</span>
                <FiAlertTriangle className="text-accent" />
              </button>
              <button onClick={() => toast.error('Emergency halt requires secondary approval')} className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors">
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
