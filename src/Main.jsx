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
import configData from "./config.json";

const Main = () => {
  const [renderReady, handleRender] = React.useState(false);
  const [redirect, handleRedirect] = React.useState(false);
  const [prodList, handleProdList] = React.useState([]);

  const getProductos = async () => {
    if (prodList !== []) {
      fetch(configData.SERVER_URL + "/productos", {
        headers: new Headers({
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          res.map((prod) => (prod.show = true));
          handleProdList(res);
          // console.log("productos",res)
        })
        .then(() => handleRender(true))
        .catch((error) => console.error(error));
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
          <Button p="20px" onClick={logoutHandler}>
            Desconectarse
          </Button>
        </HStack>
        <TabContainer
          logout={logoutHandler}
          ready={renderReady}
          prodList={prodList}
        />
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
        <CircularProgress
          isIndeterminate
          color="#f7d4ab"
          size="50%"
          thickness="4px"
        />
      </Flex>
    </Container>
  );
};

export default Main;
