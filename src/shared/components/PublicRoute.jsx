import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // If already logged in, redirect based on role
    if (isAuthenticated && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/user/dashboard" replace />;
    }

    // Not logged in, show public page
    return children;
};

export default PublicRoute;