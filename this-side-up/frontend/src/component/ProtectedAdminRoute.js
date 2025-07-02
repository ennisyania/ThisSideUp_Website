// src/component/ProtectedAdminRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function ProtectedAdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // Logged in but not admin
    return <Navigate to="/" replace />; // Or redirect to an unauthorized page
  }

  // User is admin, allow access
  return children;
}
