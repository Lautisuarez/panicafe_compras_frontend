import { Button, Center, Image, Input, Spacer, VStack } from "@chakra-ui/react";
import * as React from "react";
import PasswordInput from "./components/PasswordInput";
import { Redirect } from "react-router-dom";

const Login = () => {
  const [response, handleResponse] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClick = () => {
    login();
    handleResponse(false);
  };
  const login = async () => {
    
    const response = await fetch("http://localhost:3001/login", {
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
      //guardar token en localstorage (sessionstorage se cierra siempre, re molesto)
      localStorage.setItem("token", token);
      return handleResponse(true);
    }
    //Poner los else if que hay (usuario no existe, o contraseña incorrecta, comprobalos en el postman)
    else if (response.status === 404) {
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
          <Button onClick={handleClick}>Enviar</Button>
        </VStack>
      </VStack>
      <Spacer />
    </Center>
  );
};

export default Login;
