import React, { useEffect, useState } from "react";
import { Button, Center, ChakraProvider, Flex, VStack, Image } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import Main from "./Main";
import Login from "./Login";
import { extendTheme } from "@chakra-ui/react";
import Fonts from "./Fonts";
import ProtectedRoute from "./protected/ProtectedRoute";
import ABM from "./components/ABM";
import AdminRoute from "./protected/AdminRoute";
/* import { isAdmin } from "./protected/AuthService"; */
import AdminABMButton from "./AdminABMButton";
import PedModal from "./components/PedModal";
import configData from "./config.json";

const theme = extendTheme({
  fonts: {
    heading: "Bitter",
    body: "Bitter",
  },
  styles: {
    global: {
      "html, body": {
        fontSize: "md",
        color: "#3a3937",
        lineHeight: "tall",
      },
    },
  },
});

const Routes = () => {
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
          handlePedidosDate(res);
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
    if(localStorage.getItem("pedidos")){
      handleChange(localStorage.getItem("pedidos"))
    }else{
      console.log("cancel")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <Router>
      <div style={{ flex: 1, padding: "10px" }}>
        <Switch>
          <Route
            path="/"
            exact
            children={
              <ChakraProvider theme={theme}>
                <Fonts />
                <Login
                  onSuccesLogin={handleChange} />
              </ChakraProvider>
            }
          />

          <ProtectedRoute
            path="/main"
            exact
            children={
              <Flex>
                <VStack
                  bgColor="#f7d4ab"
                  z-index="1"
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
                      <Link to="/main">Inicio</Link>
                    </Button>
                  </Center>
                  <Center>
                    <AdminABMButton />
                  </Center>
                  {mostrarBoton ? (
                    <Center>
                      <PedModal
                        pedidosDate={pedidosDate}/>
                    </Center>
                  ) : (
                    <Center>
                    </Center>
                  )
                  }
                </VStack>
                <ChakraProvider theme={theme}>
                  <Fonts />
                  <Main />
                </ChakraProvider>
              </Flex>
            }
          />
          <AdminRoute
            path="/abm"
            exact
            children={
              <Flex>
                <VStack
                  bgColor="#f7d4ab"
                  z-index="1"
                  position="fixed"
                  top="0"
                  left="0"
                  h="100%"
                >
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
                  <Center>
                    <AdminABMButton />
                  </Center>
                </VStack>
                <ChakraProvider theme={theme}>
                  <Fonts />
                  <ABM />
                </ChakraProvider>
              </Flex>
            }
          />
        </Switch>
      </div>
    </Router>
  );
};

export default Routes;
