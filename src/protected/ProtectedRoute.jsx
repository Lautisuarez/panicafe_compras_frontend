import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./AuthService";
import * as React from "react";

/**
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
