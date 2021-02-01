import { Button, Center, Input, Spacer, VStack } from "@chakra-ui/react";
import * as React from "react";
import PasswordInput from "./components/PasswordInput";
import HeaderModel from "./components/HeaderModel";

const Login = () => {
  const [send, handleSend] = React.useState(false);
  const handleClick = () => handleSend(!send);

  /* const APICall = async () => {
    if (send) {
      await fetch;
    }
  }; */

  return (
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
