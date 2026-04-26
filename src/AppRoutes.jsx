import React, { useEffect, useState } from "react";
import { Button, Center, Flex, VStack, Image, Box } from "@chakra-ui/react";
import { Routes, Route, Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import Main from "./Main";
import Login from "./Login";
import ProtectedRoute from "./protected/ProtectedRoute";
import ABM from "./components/ABM";
import AdminProductosPedido from "./components/AdminProductosPedido";
import InvoiceScanner from "./components/InvoiceScanner";
import AdminRoute from "./protected/AdminRoute";
import ProductionRoute from "./protected/ProductionRoute";
import AdminABMButton from "./AdminABMButton";
import PedModal from "./components/PedModal";
import configData from "./config.json";
import MainProduction from "./MainProduction";

export default function AppRoutes() {
  const [pedidosDate, handlePedidosDate] = useState([]);
  const [mostrarBoton, handleMostrarBoton] = useState(false);

  const getPedidosDate = async () => {
    fetch(configData.SERVER_URL + "/mispedidos", {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.pedidos)
            ? res.pedidos
            : [];
        handlePedidosDate(list);
      })
      .catch((error) => console.error(error));
  };

  function handleChange(set) {
    if (set === "true") {
      set = true;
    }
    handleMostrarBoton(set);
    getPedidosDate();
  }

  useEffect(() => {
    if (localStorage.getItem("pedidos")) {
      handleChange(localStorage.getItem("pedidos"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <Routes>
        <Route path="/" element={<Login onSuccesLogin={handleChange} />} />

        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Flex>
                <VStack
                  bgColor="#f7d4ab"
                  zIndex="1"
                  position="fixed"
                  top="0"
                  left="0"
                  h="100%"
                  gap={4}
                >
                  <Center>
                    <Image
                      src="https://imgur.com/J9pzeqI.png"
                      width="50px"
                      alt="Panicafe Logo"
                      m="20px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Image
                      src="https://imgur.com/20VHT84.png"
                      width="170px"
                      alt="Panicafe Logo"
                      m="0px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Button
                      bgColor="#ebc699"
                      leftIcon={<MdHome />}
                      m="20px 10px 0px 10px"
                      width="90%"
                    >
                      <Link to="/main">Inicio</Link>
                    </Button>
                  </Center>
                  {mostrarBoton && (
                    <Center>
                      <PedModal pedidosDate={pedidosDate} />
                    </Center>
                  )}
                  <Box p={4}>
                    <Center>
                      <AdminABMButton />
                    </Center>
                  </Box>
                </VStack>
                <Main />
              </Flex>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mainproduction"
          element={
            <ProductionRoute>
              <Flex>
                <VStack
                  bgColor="#f7d4ab"
                  zIndex="1"
                  position="fixed"
                  top="0"
                  left="0"
                  h="100%"
                >
                  <Center>
                    <Image
                      src="https://imgur.com/J9pzeqI.png"
                      width="50px"
                      alt="Panicafe Logo"
                      m="20px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Image
                      src="https://imgur.com/20VHT84.png"
                      width="170px"
                      alt="Panicafe Logo"
                      m="0px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Button
                      bgColor="#ebc699"
                      leftIcon={<MdHome />}
                      m="20px 10px 0px 10px"
                      width="90%"
                    >
                      <Link to="/mainproduction">Inicio</Link>
                    </Button>
                  </Center>
                </VStack>
                <MainProduction />
              </Flex>
            </ProductionRoute>
          }
        />

        <Route
          path="/abm"
          element={
            <AdminRoute>
              <Flex>
                <VStack
                  bgColor="#f7d4ab"
                  zIndex="1"
                  position="fixed"
                  top="0"
                  left="0"
                  h="100%"
                  gap={4}
                >
                  <Center>
                    <Image
                      src="https://imgur.com/J9pzeqI.png"
                      width="50px"
                      alt="Panicafe Logo"
                      m="20px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Image
                      src="https://imgur.com/20VHT84.png"
                      width="170px"
                      alt="Panicafe Logo"
                      m="0px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Button
                      bgColor="#ebc699"
                      leftIcon={<MdHome />}
                      m="20px 10px 0px 10px"
                      width="90%"
                    >
                      <Link to="/main">Inicio</Link>
                    </Button>
                  </Center>
                  <Box p={4}>
                    <Center>
                      <AdminABMButton />
                    </Center>
                  </Box>
                </VStack>
                <ABM />
              </Flex>
            </AdminRoute>
          }
        />

        <Route
          path="/abm-productos"
          element={
            <AdminRoute productosPedido>
              <Flex>
                <VStack
                  bgColor="#f7d4ab"
                  zIndex="1"
                  position="fixed"
                  top="0"
                  left="0"
                  h="100%"
                  gap={4}
                >
                  <Center>
                    <Image
                      src="https://imgur.com/J9pzeqI.png"
                      width="50px"
                      alt="Panicafe Logo"
                      m="20px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Image
                      src="https://imgur.com/20VHT84.png"
                      width="170px"
                      alt="Panicafe Logo"
                      m="0px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Button
                      bgColor="#ebc699"
                      leftIcon={<MdHome />}
                      m="20px 10px 0px 10px"
                      width="90%"
                    >
                      <Link to="/main">Inicio</Link>
                    </Button>
                  </Center>
                  <Box p={4}>
                    <Center>
                      <AdminABMButton />
                    </Center>
                  </Box>
                </VStack>
                <AdminProductosPedido />
              </Flex>
            </AdminRoute>
          }
        />

        <Route
          path="/facturas"
          element={
            <AdminRoute>
              <Flex>
                <VStack
                  bgColor="#f7d4ab"
                  zIndex="1"
                  position="fixed"
                  top="0"
                  left="0"
                  h="100%"
                  gap={4}
                >
                  <Center>
                    <Image
                      src="https://imgur.com/J9pzeqI.png"
                      width="50px"
                      alt="Panicafe Logo"
                      m="20px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Image
                      src="https://imgur.com/20VHT84.png"
                      width="170px"
                      alt="Panicafe Logo"
                      m="0px 5px 0px 5px"
                    />
                  </Center>
                  <Center>
                    <Button
                      bgColor="#ebc699"
                      leftIcon={<MdHome />}
                      m="20px 10px 0px 10px"
                      width="90%"
                    >
                      <Link to="/main">Inicio</Link>
                    </Button>
                  </Center>
                  <Box p={4}>
                    <Center>
                      <AdminABMButton />
                    </Center>
                  </Box>
                </VStack>
                <InvoiceScanner />
              </Flex>
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}
