import React from "react";
import { Button, ChakraProvider, Flex, VStack } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import Main from "./Main";
import Login from "./Login";
import { extendTheme } from "@chakra-ui/react";
import Fonts from "./Fonts";
import ProtectedRoute from "./protected/ProtectedRoute";

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
                  <Button bgColor="#ebc699" leftIcon={<MdHome />} m="10px">
                    <Link to="/main">Inicio</Link>
                  </Button>
                </VStack>
                <ChakraProvider theme={theme}>
                  <Fonts />
                  <Main />
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
