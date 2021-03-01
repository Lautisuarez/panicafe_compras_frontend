import * as React from "react";
import {
  Flex,
  Container,
  CircularProgress,
  Button,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import HeaderModel from "./components/HeaderModel";
import TabContainer from "./components/TabContainer";
import { logout } from "./protected/AuthService";
import { Redirect } from "react-router-dom";

const Main = () => {
  const [renderReady, handleRender] = React.useState(false);
  const [redirect, handleRedirect] = React.useState(false);
  const [prodList, handleProdList] = React.useState([]);


  const getProductos = async () => {
    if (prodList !== []) {
      const response = await fetch("http://localhost:3001/productos",{
        headers: new Headers({
          'Authorization': 'Bearer '+localStorage.getItem('token'), 
          'Content-Type': 'application/json'
        }),
      });

      handleRender(true);
      const res = await response.json();
      res.map((prod) => (prod.show = true));
      handleProdList(res);
    }
  };

  const logoutHandler = () => {
    logout();
    handleRedirect(true);
  };

  React.useEffect(() => {
    getProductos();
  }, []);

  return redirect ? (
    <Redirect to="/" />
  ) : renderReady ? (
    <Container paddingLeft="150px">
      <Container>
        <HStack>
          <HeaderModel m="10px" text="Productos" />
          <Spacer />
          <Button onClick={logoutHandler}>Logout</Button>
        </HStack>
        <TabContainer ready={renderReady} prodList={prodList} />
      </Container>
    </Container>
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
        <CircularProgress isIndeterminate color="gray.300" size="100%" />
      </Flex>
    </Container>
  );
};

export default Main;
