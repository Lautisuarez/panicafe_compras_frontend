import { Button, Center, Image, Input, Spacer, VStack } from "@chakra-ui/react";
import * as React from "react";
import PasswordInput from "./components/PasswordInput";
import { Redirect } from "react-router-dom";

import configData from "./config.json";
import { DeleteIcon } from "@chakra-ui/icons";

const Login = () => {
  const [response, handleResponse] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClick = () => {
    login();
    handleResponse(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleClick();
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
      return handleResponse(true);
    } else if (response.status === 404) {
      return alert("Error usuario inexistente");
    } else if (response.status === 401) {
      return alert("Contraseña Incorrecta");
    }
  };

  return response ? (
    <Redirect to="/main" />
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
          />

          <PasswordInput
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            placeholder={"Ingrese su contraseña"}
          />
          <Button onClick={handleClick} onKeyPress={handleKeyPress}>
            Enviar
          </Button>
        </VStack>
      </VStack>
      <Spacer />
    </Center>
  );
};

export default Login;
