import React from "react";
import { Button, ChakraProvider, VStack } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import Main from "./Main";
import Login from "./Login";
import { extendTheme } from "@chakra-ui/react";
import Fonts from "./Fonts";

const theme = extendTheme({
  fonts: {
    heading: "Bitter",
    body: "Bitter",
  },
  styles: {
    global: {
      "html, body": {
        fontSize: "md",
        color: "gray.600",
        bgColor: "#e3e3e3",
        lineHeight: "tall",
      },
    },
  },
});

const routes = [
  {
    path: "/",
    exact: true,
    main: () => {
      return (
        <ChakraProvider theme={theme}>
          <Fonts />
          <Login />
        </ChakraProvider>
      );
    },
  },
  {
    path: "/main",
    exact: true,
    main: () => {
      return (
        <ChakraProvider theme={theme}>
          <Fonts />
          <Main />
        </ChakraProvider>
      );
    },
  },
];

const Routes = () => {
  return (
    <Router>
      <VStack h="100%" position="absolute" bgColor="#f7d4ab">
        <Button bgColor="#ebc699" leftIcon={<MdHome />} m="10px">
          <Link to="/main">Inicio</Link>
        </Button>
      </VStack>

      <Switch>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} exact={route.exact} />
        ))}
      </Switch>

      <div style={{ flex: 1, padding: "10px" }}>
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={<route.main />}
            />
          ))}
        </Switch>
      </div>
    </Router>
  );
};

export default Routes;
