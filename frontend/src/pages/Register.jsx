// ===========================================
// Register Page — Fully integrated with backend
// ===========================================
// POST /auth/register (JSON body)
// All required fields, validation, toast, redirect to login.
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiUserCheck, FiBookOpen, FiUsers, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { registerUser } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    enrollment_number: '',
    department: '',
    password: '',
    confirm_password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Client-side validation before hitting backend
  const validate = () => {
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Build the payload — exclude confirm_password (not a backend field)
      const { confirm_password, ...payload } = formData;

      // Only send optional fields if they have values
      if (!payload.enrollment_number) delete payload.enrollment_number;
      if (!payload.department) delete payload.department;

      await registerUser(payload);

      toast.success('Account created successfully! Please sign in.');
      // Redirect to login after short delay so user sees the toast
      setTimeout(() => navigate('/login'), 1200);

    } catch (err) {
      if (!err.response) {
        toast.error('Cannot connect to server. Please check your connection.');
      } else if (err.response?.status === 400) {
        const detail = err.response?.data?.detail;
        toast.error(detail || 'Email already registered. Please use a different email.');
      } else if (err.response?.status === 422) {
        // Pydantic validation error — extract message
        const errors = err.response?.data?.detail;
        if (Array.isArray(errors) && errors.length > 0) {
          toast.error(errors[0]?.msg || 'Validation error. Please check your inputs.');
        } else {
          toast.error('Invalid data. Please check your inputs.');
        }
      } else {
        toast.error(err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return null;
    if (len > 8) return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    if (len > 5) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
    return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
  };
  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl glass p-8 md:p-12 rounded-[2.5rem] border border-white/10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Join SmartPresence AI</h2>
          <p className="text-gray-400">Create your account to start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name + Email */}
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
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white disabled:opacity-50"
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
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Enrollment + Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Enrollment ID</label>
              <div className="relative group">
                <FiBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  name="enrollment_number"
                  type="text"
                  placeholder="2024CS001 (optional)"
                  value={formData.enrollment_number}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Role</label>
              <div className="relative group">
                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors pointer-events-none z-10" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white disabled:opacity-50 appearance-none cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Department</label>
            <input
              name="department"
              type="text"
              placeholder="e.g. Computer Science (optional)"
              value={formData.department}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white disabled:opacity-50"
            />
          </div>

          {/* Password + Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {/* Password strength */}
              {strength && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strength.width} ${strength.color}`} />
                  </div>
                  <span className="text-[10px] text-gray-400">{strength.label}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  name="confirm_password"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {/* Match indicator */}
              {formData.confirm_password && (
                <p className={`text-[10px] mt-1 ml-1 ${formData.password === formData.confirm_password ? 'text-green-400' : 'text-red-400'}`}>
                  {formData.password === formData.confirm_password ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>Register Now <FiArrowRight /></>
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
