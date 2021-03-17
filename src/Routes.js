import React from "react";
import { Button, Center, ChakraProvider, Flex, VStack } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MdAccountBox, MdHome } from "react-icons/md";
import Main from "./Main";
import Login from "./Login";
import { extendTheme } from "@chakra-ui/react";
import Fonts from "./Fonts";
import ProtectedRoute from "./protected/ProtectedRoute";
import ABM from "./components/ABM";

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
  return (
    <Router>
      <Switch>
        <Route path="/" exact />
        <Route path="/main" exact />
        <Route path="/abm" exact />
      </Switch>

      <div style={{ flex: 1, padding: "10px" }}>
        <Switch>
          <Route
            path="/"
            exact
            children={
              <ChakraProvider theme={theme}>
                <Fonts />
                <Login />
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
                    <Button
                      bgColor="#ebc699"
                      leftIcon={<MdAccountBox />}
                      isFullWidth="true"
                      m="10px 10px 0px 10px"
                      width="90%"
                    >
                      <Link to="/abm">ABM</Link>
                    </Button>
                  </Center>
                </VStack>
                <ChakraProvider theme={theme}>
                  <Fonts />
                  <Main />
                </ChakraProvider>
              </Flex>
            }
          />
          <ProtectedRoute
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
                    <Button
                      bgColor="#ebc699"
                      leftIcon={<MdAccountBox />}
                      isFullWidth="true"
                      m="10px 10px 0px 10px"
                      width="90%"
                    >
                      <Link to="/abm">ABM</Link>
                    </Button>
                  </Center>
                </VStack>
                <ChakraProvider theme={theme}>
                  <Fonts />
                  <ABM />
                </ChakraProvider>
              </Flex>
            }
          />
          <Route
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
                  <Button bgColor="#ebc699" leftIcon={<MdHome />} m="10px">
                    <Link to="/main">Inicio</Link>
                  </Button>
                  <Button
                    bgColor="#ebc699"
                    leftIcon={<MdAccountBox />}
                    m="10px"
                  >
                    <Link to="/main">ABM</Link>
                  </Button>
                </VStack>
                <ChakraProvider theme={theme}>
                  <Fonts />
                  <Main />
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
