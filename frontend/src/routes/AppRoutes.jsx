import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import FaceEnrollment from '../pages/FaceEnrollment';
import StudentDashboard from '../pages/StudentDashboard';
import TeacherDashboard from '../pages/TeacherDashboard';
import LiveClassroom from '../pages/LiveClassroom';
import Analytics from '../pages/Analytics';
import AdminPanel from '../pages/AdminPanel';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Landing Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Enrollment (Standalone layout or AuthLayout depending on preference, using AuthLayout for now to have the animated background) */}
      <Route element={<AuthLayout />}>
        <Route path="/face-enrollment" element={<FaceEnrollment />} />
        <Route path="/enrollment" element={<FaceEnrollment />} /> {/* Redirect alias */}
      </Route>

      {/* Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/live-classroom" element={<LiveClassroom />} />
        <Route path="/classroom/:id" element={<LiveClassroom />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
