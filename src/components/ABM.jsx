import { Button } from "@chakra-ui/button";
import { Box, Container, HStack, Spacer, VStack } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import * as React from "react";
import { Redirect } from "react-router";
import { logout } from "../protected/AuthService";
import { HeaderModel } from "./HeaderModel";

const ABM = (props) => {
  const [redirect, handleRedirect] = React.useState(false);
  const logoutHandler = () => {
    logout();
    handleRedirect(true);
  };
  return redirect ? (
    <Redirect to="/" />
  ) : (
    <Box>
      <Container paddingLeft="150px">
        <Container>
          <HStack>
            <HeaderModel text={"Modulo de Usuarios"} />
            <Spacer />
            <Button onClick={logoutHandler}>Desconectarse</Button>
          </HStack>
          <VStack>
            <Button variant="whatsapp">Cambiar contraseña</Button>
            <Spacer />
            <Table>
              <Thead>
                <Tr>
                  <Th>Usuario</Th>
                  <Th>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.userList.map((user) => {
                  return (
                    <Tr>
                      <Td>{<Button variant="red">Eliminar usuario</Button>}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </VStack>
        </Container>
      </Container>
    </Box>
  );
};

export default ABM;
