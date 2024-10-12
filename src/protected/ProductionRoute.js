import { Redirect, Route } from "react-router-dom";
import { isProduction } from "./AuthService";
import * as React from "react";

const ProductionRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isProduction() == null ? (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        ) : isProduction() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/mainproduction", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default ProductionRoute;
