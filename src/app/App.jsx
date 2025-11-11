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
import UserCoursesPage from '@/pages/user/UserCoursesPage';
import UserCourseDetailsPage from '@/pages/user/UserCoursedetailsPage';
import ExamPage from '@/pages/user/ExamPage';
import UserHistoryPage from '@/pages/user/UserHistoryPage';
import MyCoursesPage from '@/pages/user/MyCoursesPage';
import AttemptReviewPage from '@/pages/user/AttemptReviewPage';
import UserProfilePage from '@/pages/user/UserProfilePage';
import AdminStudentsPage from '@/pages/admin/AdminStudentsPage';
import AdminStudentDetailsPage from '@/pages/admin/AdminStudentDetailsPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage'; // Fixed: Capital P
import AdminUserFormPage from '@/pages/admin/AdminUserFormPage';
import AdminQuestionsPage from '@/pages/admin/AdminQuestionsPage';
import AdminQuestionFormPage from '@/pages/admin/AdminQuestionFormPage';

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

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/courses" element={<AdminCoursesPage />} />
                <Route path="/admin/courses/:id" element={<AdminCourseDetailsPage />} />
                <Route path="/admin/courses/:courseId/modules/:moduleId" element={<AdminModuleDetailsPage />} />
                <Route path="/admin/questions" element={<AdminQuestionsPage />} />
                <Route path="/admin/questions/create" element={<AdminQuestionFormPage />} />
                <Route path="/admin/questions/edit/:id" element={<AdminQuestionFormPage />} />
                <Route path="/admin/users" element={<AdminStudentsPage />} />
                <Route path="/admin/users/create" element={<AdminUserFormPage />} />
                <Route path="/admin/users/:id" element={<AdminStudentDetailsPage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} /> {/* Fixed: Now uses component */}
                <Route path="/admin/settings" element={<AdminSettingsPage />} />

                {/* User Routes */}
                <Route path="/user" element={<Navigate to="/user/courses" replace />} />
                <Route path="/admin/user/create" element={<AdminUserFormPage />} />
                <Route path="/user/courses" element={<UserCoursesPage />} />
                <Route path="/user/courses/:id" element={<UserCourseDetailsPage />} />
                <Route path="/user/exam/:id" element={<ExamPage />} />
                <Route path="/user/history" element={<UserHistoryPage />} />
                <Route path="/user/my-courses" element={<MyCoursesPage />} />
                <Route path="/user/attempt/:attemptId" element={<AttemptReviewPage />} />
                <Route path="/user/profile" element={<UserProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
