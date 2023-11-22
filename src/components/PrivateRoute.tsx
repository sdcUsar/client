import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token: string | null = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
