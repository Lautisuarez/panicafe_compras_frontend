import { Navigate, useLocation } from "react-router-dom";
import {
  isAdmin,
  isProductosPedidoAdmin,
  canAccessInvoiceScanner,
} from "./AuthService";
import * as React from "react";

/**
 * @param {object} props
 * @param {import("react").ReactNode} [props.children]
 * @param {import("react").ComponentType} [props.component]
 * @param {boolean} [props.productosPedido] - if true, allow isAdmin 1 or 3; else only 1
 * @param {boolean} [props.invoiceScanner] - if true, allow isAdmin 1 or 4
 */
const AdminRoute = ({
  component: Component,
  children,
  productosPedido,
  invoiceScanner,
}) => {
  const location = useLocation();
  const check = invoiceScanner
    ? canAccessInvoiceScanner
    : productosPedido
      ? isProductosPedidoAdmin
      : isAdmin;

  let allowed;
  try {
    allowed = check();
  } catch {
    allowed = null;
  }

  if (allowed == null) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if (!allowed) {
    return <Navigate to="/main" replace state={{ from: location }} />;
  }
  return Component ? <Component /> : children;
};

export default AdminRoute;
