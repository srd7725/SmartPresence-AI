// ===========================================
// Login Page — Fully integrated with backend
// ===========================================
// POST /auth/login (x-www-form-urlencoded)
// Saves JWT, user data, redirects by role.
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiCpu, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { loginUser, getCurrentUser } from '../services/authService';
import useAuth from '../hooks/useAuth';

// Role → dashboard path mapping
const ROLE_ROUTES = {
  student: '/student-dashboard',
  teacher: '/teacher-dashboard',
  admin: '/admin',
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Call login API (sends form-urlencoded)
      const data = await loginUser(formData.email, formData.password);

      // Extract token and user info from response
      const token = data.access_token;
      
      // Temporarily store token so interceptor can use it
      localStorage.setItem('access_token', token);
      const meResponse = await getCurrentUser();
      const userData = meResponse.data;

      // Commit to AuthContext state
      login(token, userData);

      toast.success(`Welcome back, ${userData.full_name}! 🎉`);

      // Role-based redirect
      const redirectPath = ROLE_ROUTES[userData.role] || '/student-dashboard';
      setTimeout(() => navigate(redirectPath, { replace: true }), 500);

    } catch (err) {
      // Handle different error scenarios
      if (!err.response) {
        toast.error('Cannot connect to server. Please check your connection.');
      } else if (err.response?.status === 401) {
        toast.error('Invalid email or password. Please try again.');
      } else if (err.response?.status === 422) {
        toast.error('Invalid input. Please check your email and password.');
      } else {
        const message = err.response?.data?.detail || 'Login failed. Please try again.';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[180px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl glass p-8 sm:p-10 md:px-16 md:py-14 rounded-[2.5rem] border border-white/10 relative"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
            <FiCpu className="text-white text-3xl" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-2 text-gradient">Welcome Back</h2>
          <p className="text-gray-400">Continue your AI-powered learning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                name="email"
                type="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-accent rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>Sign In <FiArrowRight /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-full bg-white/10" />
          <span className="text-xs text-gray-500 uppercase font-bold whitespace-nowrap">Or continue with</span>
          <div className="h-px w-full bg-white/10" />
        </div>

        {/* Social buttons (UI only) */}
        <div className="mt-6 flex gap-4 justify-center">
          <button className="flex-1 py-3 glass border border-white/10 hover:bg-white/5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
            Google
          </button>
          <button className="flex-1 py-3 glass border border-white/10 hover:bg-white/5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </button>
        </div>

        <p className="text-center mt-10 text-gray-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-accent font-semibold hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
