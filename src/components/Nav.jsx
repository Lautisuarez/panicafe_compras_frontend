import { ArrowLeftIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { VStack, IconButton, Divider, Icon } from "@chakra-ui/react";
import * as React from "react";
import { FiShoppingCart } from "react-icons/fi";

const Nav = () => {
  const IconoCarrito = () => {
    return <Icon as={FiShoppingCart} />;
  };

  return (
    <VStack bg="#5d6dde" position="absolute" h="100%" w="70px">
      <Divider />
      <IconButton icon={<IconoCarrito />} bg="#5d6dde" w="60px" h="60px" />
      <IconButton icon={<PlusSquareIcon />} bg="#5d6dde" w="60px" h="60px" />
      <IconButton icon={<ArrowLeftIcon />} bg="#5d6dde" w="60px" h="60px" />
    </VStack>
  );
};

export default Nav;
