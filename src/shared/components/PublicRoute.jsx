import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (isAuthenticated && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/user/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;