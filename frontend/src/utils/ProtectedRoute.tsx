import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!Cookies.get("user");
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to="/exclusive-login" state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
