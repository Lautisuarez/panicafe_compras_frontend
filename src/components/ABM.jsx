import { Button, ButtonGroup } from "@chakra-ui/button";
import { Container, HStack, Spacer, VStack } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import * as React from "react";
import { Redirect } from "react-router";
import { logout } from "../protected/AuthService";
import HeaderModel from "./HeaderModel";
import AbmModal from "./AbmModal";
import jwt_decode from "jwt-decode";
import { DeleteIcon } from "@chakra-ui/icons";
import { getUsers, deleteUser } from "../api/users";

const ABM = (props) => {
  const [token, setToken] = React.useState({});
  const [redirect, handleRedirect] = React.useState(false);
  const [users, setUsers] = React.useState([]);


  React.useEffect(async() => {
    setUsers(await getUsers());
    setToken(jwt_decode(localStorage.getItem("token")));
  }, []);
  const logoutHandler = () => {
    logout();
    handleRedirect(true);
  };

  const confirmation = async (user) => {
    const result = window.confirm(
      "¿Está seguro de que desea eliminar este usuario)?"
    );
    if(result){
      await deleteUser(user);
      setUsers(await getUsers());
    } 
  };

  return redirect ? (
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
        <AbmModal getUsers={async() => setUsers(await getUsers())} />
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
                  if (user === null) return null;
                  return (
                    <Tr key={user}>
                      <Td>{user}</Td>
                      <Td>
                        <ButtonGroup>
                          <Button
                            colorScheme="red"
                            onClick={() => confirmation(user)}
                            leftIcon={<DeleteIcon />}
                          >
                            Eliminar usuario
                          </Button>
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
