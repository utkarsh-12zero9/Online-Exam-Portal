import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from '@/features/auth/slices/authSlice';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCoursesPage from '@/pages/admin/AdminCoursesPage';
import AdminCourseDetailsPage from '@/pages/admin/AdminCourseDetailsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminModuleDetailsPage from '@/pages/admin/AdminModuleDetailsPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/courses" element={<AdminCoursesPage />} />
        <Route path="/admin/courses/:id" element={<AdminCourseDetailsPage />} />
        <Route path="/admin/questions" element={<div className="p-8">Questions Management (Coming Soon)</div>} />
        <Route path="/admin/reports" element={<div className="p-8">Reports (Coming Soon)</div>} />
        <Route path="/admin/users" element={<div className="p-8">Users Management (Coming Soon)</div>} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/courses/:courseId/modules/:moduleId" element={<AdminModuleDetailsPage />} />
        <Route path="/user" element={<div className="p-8">User Dashboard (Coming Soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
