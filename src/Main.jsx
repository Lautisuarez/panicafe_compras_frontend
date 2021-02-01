import * as React from "react";
import {
  Flex,
  Container,
  Divider,
  HStack,
  Spacer,
  CircularProgress,
} from "@chakra-ui/react";
import HeaderModel from "./components/HeaderModel";
import Nav from "./components/Nav";
import ProdModal from "./components/ProdModal";
import Searchbar from "./components/Searchbar";
import TabContainer from "./components/TabContainer";

const Main = () => {
  const [renderReady, handleRender] = React.useState(false);

  /* const getProductos = async () => {
    const response = await fetch("http://localhost:3000/getProductos");

    handleRender(true);
    return await response.json();
  }; */

  const getProductos = [
    {
      id: 1,
      descripcion: "papas fritas",
      precio: 500,
    },
    {
      id: 2,
      descripcion: "chocolate",
      precio: 42,
    },
  ];

  return renderReady ? (
    <Flex h="100%">
      <Nav />
      <Container>
        <Divider h="50px" />
        <HStack>
          <HeaderModel text="Productos" />
          <Spacer />
          <ProdModal />
        </HStack>
        <Divider h="25px" />
        <Searchbar />
        <Divider h="25px" />
        <TabContainer ready={renderReady} prodList={getProductos} />
      </Container>
    </Flex>
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
