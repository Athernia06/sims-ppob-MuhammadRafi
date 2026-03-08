// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  // Ambil token dari state Redux
  const token = useSelector((state) => state.auth.token);

  // Jika tidak ada token, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, render komponen (halaman) yang diminta
  return children;
};

export default ProtectedRoute;