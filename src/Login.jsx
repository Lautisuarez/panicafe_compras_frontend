import {
  Button,
  Center,
  Image,
  Input,
  Spacer,
  useToast,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import PasswordInput from "./components/PasswordInput";
import { Navigate } from "react-router-dom";
import {
  isProduction,
  isInvoiceScanOnly,
  login as persistAuthSession,
  setSessionTimeLeftForNewToken,
} from "./protected/AuthService";

import configData from "./config.json";

const Login = (props) => {
  const toast = useToast();
  const [response, handleResponse] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClick = () => {
    login();
    handleResponse(false);
  };

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) handleClick();
  };

  const passwordHandler = (event) => {
    if (event.keyCode !== 13) {
      setPassword(event.target.value);
    } else {
      handleKeyPress(event);
    }
  };

  const login = async () => {
    const response = await fetch(configData.SERVER_URL + "/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario: user, pass: password }),
    });

    if (response.status === 200) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
      setSessionTimeLeftForNewToken(token);
      localStorage.setItem("pedidos", true);
      persistAuthSession();
      props.onSuccesLogin(true);
      return handleResponse(true);
    } else if (response.status === 401) {
      toast({
        title: "Usuario o contraseña incorrectos",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return response ? (
    <Navigate
      to={
        isProduction()
          ? "/mainproduction"
          : isInvoiceScanOnly()
            ? "/facturas"
            : "/main"
      }
      replace
    />
  ) : (
    <Center>
      <Spacer />
      <VStack>
        <Image src="https://imgur.com/20VHT84.png" w="50%" />

        <VStack>
          <Spacer />
          <Input
            placeholder="Ingrese su usuario"
            onChange={(event) => {
              setUser(event.target.value);
            }}
            onKeyDown={(event) => handleKeyPress(event)}
            tabIndex="0"
          />

          <PasswordInput
            onChange={(event) => passwordHandler(event)}
            placeholder={"Ingrese su contraseña"}
            onKeyDown={(event) => handleKeyPress(event)}
            tabIndex="0"
          />
          <Button
            onClick={handleClick}
            onKeyDown={(event) => handleKeyPress(event)}
            tabIndex="0"
          >
            Enviar
          </Button>
        </VStack>
      </VStack>
      <Spacer />
    </Center>
  );
};

export default Login;
