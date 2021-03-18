import { Button, ButtonGroup } from "@chakra-ui/button";
import { Container, HStack, Spacer, VStack } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import * as React from "react";
import { Redirect } from "react-router";
import { logout } from "../protected/AuthService";
import HeaderModel from "./HeaderModel";
import AbmModal from "./AbmModal";
import { useToken } from "@chakra-ui/system";
import jwt_decode from "jwt-decode";
import configData from "../config.json";

const ABM = (props) => {
  const [token, setToken] = React.useState({});
  const [redirect, handleRedirect] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const getUsers = async () => {
    const response = await fetch(configData.SERVER_URL + "/getUsers", {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      }),
    });
    const data = await response.json();
    console.log(data);
    setUsers(data);
  };
  const deleteUser = async (usuario) => {
    const response = await fetch(configData.SERVER_URL + "/deleteUser", {
      method: "DELETE",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        usuario,
      }),
    });
    const data = await response.json();
    console.log(data);
    getUsers();
  };

  React.useEffect(() => {
    getUsers();
    setToken(jwt_decode(localStorage.getItem("token")));
  }, []);
  const logoutHandler = () => {
    logout();
    handleRedirect(true);
  };
  return !redirect ? (
    <Redirect to="/" />
  ) : token.isAdmin === 1 ? (
    <Container paddingLeft="150px">
      <HStack>
        <HeaderModel text={"Modulo de Usuarios"} />
        <Spacer />
        <Button p="20px" onClick={logoutHandler}>
          Desconectarse
        </Button>
      </HStack>
      <VStack>
        <AbmModal getUsers={getUsers} />
        <Spacer />
        <Table>
          <Thead>
            <Tr>
              <Th>Usuario</Th>
              <Th>Opciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.length > 0
              ? users.map((user) => {
                  return (
                    <Tr>
                      <Td>{user}</Td>
                      <Td>
                        <ButtonGroup>
                          <Button
                            variant="red"
                            onClick={() => deleteUser(user)}
                          >
                            Eliminar usuario
                          </Button>
                          {/* <Button variant="whatsapp">Cambiar contraseña</Button> */}
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  );
                })
              : null}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  ) : null;
};

export default ABM;
