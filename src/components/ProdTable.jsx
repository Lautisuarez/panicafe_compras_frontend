import * as React from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const ProdTable = (props) => {
  const [cart, handleCart] = React.useState([]);

  const getItemIndex = (arr, item) => {
    return arr.findIndex((e) => e.descripcion === item);
  };

  const handleProd = (product, quantity, precio) => {
    const itemIndex = getItemIndex(cart, product);
    const prodObj = {
      descripcion: product,
      cantidad: +quantity,
      precio: precio,
      show: true,
    };
    if (itemIndex === -1) {
      handleCart((prevArray) => [...prevArray, prodObj]);
      return;
    }
    const newArr = [...cart];
    newArr[itemIndex] = prodObj;
    handleCart(newArr);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  React.useEffect(() => {
    handleCart(props.prodList);
  }, [props.prodList]);

  React.useEffect(() => {
    props.callback(cart);
  });

  const isReady = props.ready;

  return isReady ? (
    <Box>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Cantidad</Th>
            <Th></Th>
            <Th>Total de unidades</Th>
            <Th>Producto</Th>
            <Th isNumeric>Precio unitario</Th>
          </Tr>
        </Thead>
        <Tbody>
          {true
            ? cart.map((producto) => {
                let inputValue = 0;
                const handleChange = (e) => {
                  inputValue = e.target.value;
                };

                return producto.show ? (
                  <Tr key={producto.id}>
                    <Td>
                      <Input
                        w="200%"
                        onChange={(event) => handleChange(event)}
                        type="number"
                      />
                    </Td>
                    <Td>
                      <Button
                        colorScheme="whatsapp"
                        onClick={() => {
                          handleProd(
                            producto.descripcion,
                            inputValue,
                            producto.precio
                          );
                        }}
                      >
                        >>
                      </Button>
                    </Td>
                    <Td>{producto.cantidad}</Td>
                    <Td w="100%">
                      {capitalizeFirstLetter(producto.descripcion)}
                    </Td>
                    <Td isNumeric>${producto.precio}</Td>
                  </Tr>
                ) : null;
              })
            : null}
        </Tbody>
      </Table>
    </Box>
  ) : null;
};

export default ProdTable;
