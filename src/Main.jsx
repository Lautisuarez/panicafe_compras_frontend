import * as React from "react";
import { Flex, Container, CircularProgress } from "@chakra-ui/react";
import HeaderModel from "./components/HeaderModel";
import TabContainer from "./components/TabContainer";

const Main = () => {
  const [renderReady, handleRender] = React.useState(true);

  /* const getProductos = async () => {
    const response = await fetch("http://localhost:3000/getProductos");

    handleRender(true);
    return await response.json();
  }; */

  const getProductos = [
    {
      id: 1,
      descripcion: "papas fritas",
      cantidad: 0,
      precio: 500,
    },
    {
      id: 2,
      descripcion: "chocolate",
      cantidad: 0,
      precio: 42,
    },
    {
      id: 3,
      descripcion: "caramelo",
      cantidad: 0,
      precio: 5,
    },
  ];

  getProductos.map((prod) => (prod.show = true));

  return renderReady ? (
    <Container>
      <Container>
        <HeaderModel m="10px" text="Productos" />
        <TabContainer ready={renderReady} prodList={getProductos} />
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
