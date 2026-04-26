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
import configData from "./config.json";
import {
  login as persistAuthSession,
  setSessionTimeLeftForNewToken,
} from "./protected/AuthService";

const Signup = () => {
  const toast = useToast();
  const [response, handleResponse] = React.useState(false);
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClick = () => {
    signUp();
    handleResponse(false);
  };
  const signUp = async () => {
    try {
      const tokenHeader = localStorage.getItem("token");
      const response = await fetch(configData.SERVER_URL + "/adduser", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(tokenHeader ? { Authorization: `Bearer ${tokenHeader}` } : {}),
        },
        body: JSON.stringify({ usuario: user, pass: password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 201) {
        const token = typeof data === "object" && data?.token;
        if (token) {
          localStorage.setItem("token", token);
          setSessionTimeLeftForNewToken(token);
          persistAuthSession();
        }
        return handleResponse(true);
      }

      const msg =
        typeof data === "string"
          ? data
          : data?.mensaje ||
            "No se pudo crear el usuario. Verificá los datos o si el usuario ya existe.";
      toast({
        title: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error de conexión",
        description: "No se pudo contactar al servidor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return response ? (
    <Navigate to="/main" replace />
  ) : (
    <Center>
      <Spacer />
      <VStack>
        <Image src="https://imgur.com/20VHT84.png" w="50%" />

        <VStack>
          <Spacer />
          <Input
            placeholder="Ingrese el nuevo usuario"
            onChange={(event) => {
              setUser(event.target.value);
            }}
          />
          <PasswordInput
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            placeholder="Ingrese su contraseña"
          />
          <Button onClick={handleClick}>Crear Usuario</Button>
        </VStack>
      </VStack>
      <Spacer />
    </Center>
  );
};

export default Signup;
