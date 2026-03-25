import * as React from "react";
import {
  Flex,
  Container,
  CircularProgress,
  Button,
  Box
} from "@chakra-ui/react";
import HeaderModel from "./components/HeaderModel";
import TabContainer from "./components/TabContainer";
import CountdownTimer from "./components/CountDownTimer";
import { logout } from "./protected/AuthService";
import { Redirect, useHistory } from "react-router-dom";
import { isProduction } from "./protected/AuthService";
import { fetchProductosCatalogo } from "./api/products";
import { productAllowsPedidoCompras } from "./utils/productOrder";

const Main = () => {
  const [renderReady, handleRender] = React.useState(false);
  const [redirect, handleRedirect] = React.useState(false);
  const [prodList, handleProdList] = React.useState([]);
  const history = useHistory();

  const loadProductos = React.useCallback(async () => {
    try {
      const res = await fetchProductosCatalogo();
      res.forEach((prod) => {
        prod.show = true;
        prod.permitePedidoCompras = productAllowsPedidoCompras(prod);
      });
      handleProdList(res);
    } catch (error) {
      console.error(error);
    } finally {
      handleRender(true);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('timeLeft');
    logout();
    handleRedirect(true);
  };

  React.useEffect(() => {
    if(isProduction()) {
      history.push("/mainproduction")
      return;
    }
    loadProductos();
  }, [history, loadProductos]);

  return redirect ? (
    <Redirect to="/" />
  ) : renderReady ? (
    <Box w="100%">
      <Flex align="center" justify="space-between" w="100%" paddingLeft="190px" paddingRight="30px" marginTop="20px">
        <CountdownTimer initialMinutes={20} logoutFunction={logoutHandler} />
        <HeaderModel text="Productos" />
        <Button p="20px" onClick={logoutHandler}>
          Desconectarse
        </Button>
      </Flex>
      <Container paddingLeft="150px">
        <TabContainer
          logout={logoutHandler}
          ready={renderReady}
          prodList={prodList}
          onRefreshCatalog={loadProductos}
        />
      </Container>
    </Box>
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
