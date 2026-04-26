import { Button } from "@chakra-ui/react";
import * as React from "react";
import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { login } from "./AuthService";

const NotifyLoginComponent = () => {
  const [redirect, handleRedirect] = React.useState(false);
  const location = useLocation();

  const loginHandler = () => {
    login();
    handleRedirect(true);
  };

  const from = location.state?.from || { pathname: "/" };

  return redirect ? (
    <Navigate to={from} replace />
  ) : (
    <Fragment>
      <h1>Identifiquese para continuar.</h1>
      <div>
        <Button onClick={loginHandler}>Login</Button>
      </div>
    </Fragment>
  );
};

export default NotifyLoginComponent;
