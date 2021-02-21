import { Button, Center, Input, Spacer, VStack } from "@chakra-ui/react";
import * as React from "react";
import PasswordInput from "./components/PasswordInput";
import HeaderModel from "./components/HeaderModel";
import { login } from "./protected/AuthService";
import { Redirect } from "react-router-dom";

const Login = () => {
  const [response, handleResponse] = React.useState(false);
  const handleClick = () => {
    login();
    handleResponse(true);
  };
  /* const APICall = async () => {
    if (send) {
      await fetch;
    }
  }; */

  return response ? (
    <Redirect to="/main" />
  ) : (
    <Center>
      <VStack>
        <Spacer />
        <HeaderModel text="Identifiquese" />
        <Spacer />
        <Input placeholder="Ingrese su usuario" />
        <PasswordInput />
        <Button onClick={handleClick}>Enviar</Button>
      </VStack>
    </Center>
  );
};

export default Login;
