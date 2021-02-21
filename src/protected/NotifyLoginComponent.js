import { Button } from "@chakra-ui/react";
import * as React from "react";
import { Fragment } from "react";
import { Redirect } from "react-router-dom";
import { login, isAuthenticated, logout } from "./AuthService";

const NotifyLoginComponent = (props) => {
  const [redirect, handleRedirect] = React.useState(false);

  const loginHandler = () => {
    login();
    handleRedirect(true);
  };

  let { from } = props.location.state || { from: { pathname: "/" } };

  return redirect ? (
    <Redirect to={from} />
  ) : (
    <Fragment>
      <h1>Identifiquese para continuar.</h1>
      <div>
        <Button onClick={loginHandler}>Login</Button>
      </div>
    </Fragment>
  );
};
