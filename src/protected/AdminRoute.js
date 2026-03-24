import { Redirect, Route } from "react-router-dom";
import { isAdmin, isProductosPedidoAdmin } from "./AuthService";
import * as React from "react";

/**
 * @param {object} props
 * @param {import("react").ReactNode} [props.children]
 * @param {import("react").ComponentType} [props.component]
 * @param {boolean} [props.productosPedido] - if true, allow isAdmin 1 or 3; else only 1
 */
const AdminRoute = ({
  component: Component,
  children,
  productosPedido,
  ...rest
}) => {
  const check = productosPedido ? isProductosPedidoAdmin : isAdmin;

  return (
    <Route
      {...rest}
      render={(props) => {
        const allowed = check();
        return allowed == null ? (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        ) : allowed ? (
          Component ? (
            <Component {...props} />
          ) : (
            children
          )
        ) : (
          <Redirect
            to={{ pathname: "/main", state: { from: props.location } }}
          />
        );
      }}
    />
  );
};

export default AdminRoute;
