import { Box, Input, InputGroup } from "@chakra-ui/react";
import * as React from "react";

const Searchbar = (props) => {
  const [search, setSearch] = React.useState("");

  const dynamicSearch = () => {
    props.callback(
      props.prodList.map((item) =>
        item.descripcion.toLowerCase().includes(search.toLowerCase())
          ? (item.show = true)
          : (item.show = false)
      )
    );
  };

  React.useEffect(() => {
    dynamicSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <Box w="90%">
      <InputGroup>
        <Input
          id="input"
          placeholder="Busqueda"
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          colorScheme="blue"
        />
      </InputGroup>
    </Box>
  );
};

export default Searchbar;
