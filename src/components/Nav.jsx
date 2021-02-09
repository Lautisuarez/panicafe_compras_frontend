import { ArrowLeftIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Divider, Icon } from "@chakra-ui/react";
import * as React from "react";
import { FiShoppingCart } from "react-icons/fi";

const Nav = () => {
  const IconoCarrito = () => {
    return <Icon as={FiShoppingCart} />;
  };

  return (
    <HStack h="100%" w="70px">
      <Divider />
      <IconButton icon={<IconoCarrito />} w="60px" h="60px" />
    </HStack>
  );
};

export default Nav;
