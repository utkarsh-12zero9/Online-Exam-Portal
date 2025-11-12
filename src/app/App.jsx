import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from '@/features/auth/slices/authSlice';

//! Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

//! Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCoursesPage from '@/pages/admin/AdminCoursesPage';
import AdminCourseDetailsPage from '@/pages/admin/AdminCourseDetailsPage';
import AdminModuleDetailsPage from '@/pages/admin/AdminModuleDetailsPage';
import AdminQuestionsPage from '@/pages/admin/AdminQuestionsPage';
import AdminQuestionFormPage from '@/pages/admin/AdminQuestionFormPage';
import AdminStudentsPage from '@/pages/admin/AdminStudentsPage';
import AdminStudentDetailsPage from '@/pages/admin/AdminStudentDetailsPage';
import AdminUserFormPage from '@/pages/admin/AdminUserFormPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

//! User Pages
import UserCoursesPage from '@/pages/user/UserCoursesPage';
import UserCourseDetailsPage from '@/pages/user/UserCoursedetailsPage';
import ExamPage from '@/pages/user/ExamPage';
import UserHistoryPage from '@/pages/user/UserHistoryPage';
import MyCoursesPage from '@/pages/user/MyCoursesPage';
import AttemptReviewPage from '@/pages/user/AttemptReviewPage';
import UserProfilePage from '@/pages/user/UserProfilePage';

//! Protected Route Components
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import PublicRoute from '@/shared/components/PublicRoute';
import UserDashboardPage from '@/pages/user/UserDashboard';
import AdminCourseFormPage from '@/pages/admin/AdminCourseFormPage';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                {/* Root - Redirect based on auth status */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public Routes - Only accessible when NOT logged in */}
                <Route path="/login"
                    element={
                        <PublicRoute>
                            <   LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup" element={
                        <PublicRoute>
                            <SignupPage />
                        </PublicRoute>
                    }
                />

                {/* Admin Routes - Only accessible by admin role */}
                <Route
                    path="/admin" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminCoursesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses/create"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminCourseFormPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses/edit/:id"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminCourseFormPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses/:id" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminCourseDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses/:courseId/modules/:moduleId" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminModuleDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/questions" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminQuestionsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/questions/create" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminQuestionFormPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/questions/edit/:id" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminQuestionFormPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminStudentsPage /></ProtectedRoute>} />
                <Route path="/admin/users/create" element={<ProtectedRoute requiredRole="admin"><AdminUserFormPage /></ProtectedRoute>} />
                <Route path="/admin/users/edit/:id" element={<ProtectedRoute requiredRole="admin"><AdminUserFormPage /></ProtectedRoute>} />
                <Route path="/admin/users/:id" element={<ProtectedRoute requiredRole="admin"><AdminStudentDetailsPage /></ProtectedRoute>} />

                <Route
                    path="/admin/reports" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminReportsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/settings" element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminSettingsPage />
                        </ProtectedRoute>
                    }
                />

                {/* User Routes - Accessible by all authenticated users */}
                <Route
                    path="/user/dashboard" element={
                        <ProtectedRoute>
                            <UserDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user" element={
                        <ProtectedRoute>
                            <Navigate to="/user/dashboard" replace />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/courses" element={
                        <ProtectedRoute>
                            <UserCoursesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/courses/:id" element={
                        <ProtectedRoute>
                            <UserCourseDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/exam/:id" element={
                        <ProtectedRoute>
                            <ExamPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/history" element={
                        <ProtectedRoute>
                            <UserHistoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/my-courses" element={
                        <ProtectedRoute>
                            <MyCoursesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/attempt/:attemptId" element={
                        <ProtectedRoute>
                            <AttemptReviewPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/profile" element={
                        <ProtectedRoute>
                            <UserProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* 404 - Catch all */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
