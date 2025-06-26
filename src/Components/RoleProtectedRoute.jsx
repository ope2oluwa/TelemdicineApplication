// Components/RoleProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ user, requiredRole, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.role || user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;

