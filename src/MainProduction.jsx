import HeaderModel from "./components/HeaderModel";
import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  FormControl,
  FormLabel,
  Input,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Grid,
  GridItem,
  Checkbox,
  Flex,
  Container,
  Box,
  CircularProgress
} from "@chakra-ui/react";
import { isProduction } from "./protected/AuthService";
import { getUsers } from "./api/users";
import { getOrdersByUser } from "./api/orders";
import CountdownTimer from "./components/CountDownTimer";
import PreviewModal from "./components/PreviewModal";
import { logout } from "./protected/AuthService";
import { Redirect, useHistory } from "react-router-dom";

const MainProduction = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFistTime, setIsFistTime] = useState(true);
  const [redirect, handleRedirect] = React.useState(false);
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("timeLeft");
    logout();
    handleRedirect(true);
  };

  useEffect(() => {
    if (isProduction()) {
      const getUsersProduction = async () => {
        setUsers(await getUsers());
      }
      getUsersProduction();
    } else {
      history.push("/main")
    }
  }, []);

  const handleSearch = async () => {
    if (selectedUser && dateFrom && dateTo) {
      setSelectedOrders([])
      setIsLoading(true);
      let resp = await getOrdersByUser(selectedUser, dateFrom, dateTo);
      setOrders(resp);
      setIsFistTime(false);
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders(prevSelected => {
      if (prevSelected.includes(orderId)) {
        return prevSelected.filter(id => id !== orderId);
      } else {
        return [...prevSelected, orderId];
      }
    });
  };

  return redirect ? (
    <Redirect to="/" />
  ) : (
    <Box w="100%">
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        paddingLeft="190px"
        paddingRight="30px"
        marginTop="20px"
      >
        <CountdownTimer initialMinutes={20} logoutFunction={logoutHandler} />
        <HeaderModel text="Productos" />
        <Button p="20px" onClick={logoutHandler}>
          Desconectarse
        </Button>
      </Flex>
      <Container maxW="90%" paddingLeft="200px" marginTop="40px">
        <Grid
          templateColumns={{ base: "1fr", md: "2fr 2fr 2fr 1fr" }}
          alignItems="end"
          gap={4}
          mb={4}
        >
          <GridItem>
            <FormControl>
              <FormLabel htmlFor="user">Seleccionar Usuario</FormLabel>
              {users.length > 0 && (
                <Select
                  id="user"
                  placeholder="Selecciona un usuario"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {users.map(
                    (user) =>
                      user != null && (
                        <option key={user} value={user}>
                          {user}
                        </option>
                      )
                  )}
                </Select>
              )}
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel htmlFor="dateFrom">Desde</FormLabel>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel htmlFor="dateTo">Hasta</FormLabel>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <Button colorScheme="blue" disabled={!selectedUser || !dateFrom || !dateTo} onClick={handleSearch}>
              Buscar
            </Button>
          </GridItem>
        </Grid>
        {!isLoading ?
          orders.length > 0 ? (
            <Table mt={4}>
              <Thead>
                <Tr>
                  <Th style={{ textAlign: "center" }}>Seleccionar</Th>
                  <Th style={{ width: '100%' }}>Fecha</Th>
                  <Th>Total</Th>
                  <Th style={{ display: 'flex', gap:5, width: 'fit-content' }}>
                    <PreviewModal ordersID={selectedOrders} username={selectedUser} dateFrom={dateFrom} dateTo={dateTo} />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order, index) => (
                  <Tr key={index}>
                    <Td style={{ textAlign: "center" }}>
                      <Checkbox 
                          isChecked={selectedOrders.includes(order.idPedido)}
                          onChange={() => handleCheckboxChange(order.idPedido)}
                      />
                    </Td>
                    <Td>{order.fecha}</Td>
                    <Td>{order.precioTotal}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
        ) : !isFistTime && (
          <Text align="center" marginTop="20">No hay pedidos para estos filtros.</Text>
        ) : (
          <Container centerContent>
            <Flex
              align="center"
              justify={{ base: "center", md: "space-around", xl: "space-between" }}
              direction={{ base: "column-reverse", md: "row" }}
              wrap="no-wrap"
              minH="70vh"
              px={8}
              mb={16}
            >
              <CircularProgress
                isIndeterminate
                color="#f7d4ab"
                size="50%"
                thickness="4px"
              />
            </Flex>
          </Container>
        )}
      </Container>
    </Box>
  );
};

export default MainProduction;
