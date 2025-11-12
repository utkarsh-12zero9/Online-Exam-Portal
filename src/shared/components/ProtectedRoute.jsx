import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // Not logged in - redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (requiredRole && user.role !== requiredRole) {
        // If admin required but user is not admin, redirect to user dashboard
        if (requiredRole === 'admin' && user.role === 'user') {
            return <Navigate to="/user/courses" replace />;
        }
        // If user required but role is admin, allow (admins can access user pages)
        return <Navigate to="/login" replace />;
    }

    // User is authenticated and has correct role
    return children;
};

export default ProtectedRoute;