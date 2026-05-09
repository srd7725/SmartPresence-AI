import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiUserCheck } from 'react-icons/fi';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    enrollment_number: '',
    department: '',
    password: '',
    confirm_password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Backend integration here
      // For now, mock success and redirect
      setTimeout(() => {
        setLoading(false);
        if (formData.role === 'student') {
          navigate('/enrollment');
        } else {
          navigate('/teacher/dashboard');
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl glass p-8 md:p-12 rounded-[2.5rem] border border-white/10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Join SmartPresence AI</h2>
          <p className="text-gray-400">Create your account to start your journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
              <div className="relative group">
                <FiUserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="John Doe"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="john@university.edu"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Enrollment ID</label>
              <input
                name="enrollment_number"
                type="text"
                placeholder="2024CS001"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Role</label>
              <select
                name="role"
                onChange={handleChange}
                className="w-full bg-dark-lighter border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                />
              </div>
              {/* Password Strength Indicator (Mock) */}
              {formData.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        formData.password.length > 8 ? 'w-full bg-green-500' : 
                        formData.password.length > 5 ? 'w-2/3 bg-yellow-500' : 'w-1/3 bg-red-500'
                      }`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {formData.password.length > 8 ? 'Strong' : formData.password.length > 5 ? 'Medium' : 'Weak'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  name="confirm_password"
                  type="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Account...' : (
              <>
                Register Now <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
