// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const Privateroute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Privateroute;
