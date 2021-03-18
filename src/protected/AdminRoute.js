import { Redirect, Route } from "react-router-dom";
import { isAdmin } from "./AuthService";
import * as React from "react";

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAdmin() == null ? (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        ) : isAdmin() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/main", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default AdminRoute;
