import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { token, user, initialized } = useSelector((s) => s.auth);

  if (!initialized) {
    // Defensive loading spinner (in normal use, initialized is always true
    // because rehydration is synchronous)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
