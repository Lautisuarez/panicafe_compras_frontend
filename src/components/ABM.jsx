import { Button } from "@chakra-ui/button";
import { Box, Container, HStack, Spacer, VStack } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import * as React from "react";
import { useEffect } from "react";
import { Redirect } from "react-router";
import { logout } from "../protected/AuthService";
import  HeaderModel  from "./HeaderModel";
import CustomModal from './CustomModal'

const ABM = (props) => {
  const [redirect, handleRedirect] = React.useState(false);
  const [users, setUsers] = React.useState([])
  const getUsers = async () => {
    const response = await fetch("http://localhost:3001/getUsers", {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      }),
    });
    const data = await response.json();
    console.log(data)
    setUsers(data) 
  }
  const deleteUser = async (usuario) => {
    const response = await fetch("http://localhost:3001/deleteUser", {
      method: "DELETE",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      }),
      body:JSON.stringify({
        usuario
      })
    });
    const data = await response.json();
    console.log(data)
    getUsers()
  }

  React.useEffect(() => {
    getUsers();
  }, []);
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
            <CustomModal getUsers={getUsers}/>

            {/* <Button variant="whatsapp">Cambiar contraseña</Button> */}
            <Spacer />
            <Table>
              <Thead>
                <Tr>
                  <Th>Usuario</Th>
                  <Th>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                { users.length > 0 ?
                  
                users.map((user) => {
                  return (
                    <Tr>
                      <Td>{user}</Td>
                      <Td><Button variant="red" onClick={() => deleteUser(user)}>Eliminar usuario</Button></Td>
                    </Tr>
                  );
                })
                :
                null
              }
              </Tbody>
            </Table>
          </VStack>
        </Container>
      </Container>
    </Box>
  );
};

export default ABM;
