import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import * as React from "react";
const Searchbar = () => {
  return (
    <Box>
      <InputGroup>
        <Input placeholder="Busqueda" />
        <InputRightElement>
          <IconButton
            h="1.7rem"
            size="sm"
            aria-label="Buscar Producto"
            icon={<SearchIcon />}
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default Searchbar;
