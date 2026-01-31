import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: 'admin' | 'waiter';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (role && user.role !== role && user.role !== 'admin') {
        // Admin allows all, specific role restricts.
        // If required role is 'waiter', admin can also access usually.
        // But let's be strict if needed.
        // For now, simple check.
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
