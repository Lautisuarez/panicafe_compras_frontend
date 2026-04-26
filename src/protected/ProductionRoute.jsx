import { Navigate, useLocation } from "react-router-dom";
import { isProduction } from "./AuthService";
import * as React from "react";

/**
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 */
const ProductionRoute = ({ children }) => {
  const location = useLocation();
  const prod = isProduction();
  if (prod == null) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if (prod) {
    return children;
  }
  return (
    <Navigate to="/mainproduction" replace state={{ from: location }} />
  );
};

export default ProductionRoute;
