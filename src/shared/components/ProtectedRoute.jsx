import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        
        if (requiredRole === 'admin' && user.role === 'user') {
            return <Navigate to="/user/courses" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;