import * as React from "react";
import { Box, HStack, Input } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import styles from "../styles/List.css";

const ProdTable = (props) => {
  const [cart, handleCart] = React.useState([]);

  const getItemIndex = (arr, item) => {
    return arr.findIndex((e) => e.descripcion === item);
  };

  const handleProd = (product, quantity) => {
    const itemIndex = getItemIndex(cart, product);
    const prodObj = {
      descripcion: product,
      cantidad: quantity,
    };
    if (itemIndex === -1) {
      handleCart((prevArray) => [...prevArray, prodObj]);
      /* props.callback(cart); */
      return;
    }
    const newArr = [...cart];
    newArr[itemIndex] = prodObj;
    handleCart(newArr);
    /* props.callback(cart); */
  };

  React.useEffect(() => {
    props.callback(cart);
  });

  let counter = 0;
  const isReady = props.ready;

  return isReady ? (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th isNumeric>Cantidad</Th>
            <Th>Producto</Th>
            <Th isNumeric>Precio</Th>
          </Tr>
        </Thead>
        <Tbody>
          {true
            ? props.prodList.map((producto) => {
                counter++;
                return (
                  <Tr
                    className={
                      counter % 2 === 0 ? styles.oddRow : styles.evenRow
                    }
                    key={counter}
                  >
                    <Td>
                      {/* <HStack maxW={40}>
                         <Button onClick={handleIncDec(producto.descripcion, 0)}>
                          -
                        </Button> */}
                      <Input
                        onChange={(event) => {
                          handleProd(producto.descripcion, event.target.value);
                        }}
                        type="number"
                      />
                      {/* <Button onClick={handleIncDec(producto.descripcion, 1)}>
                          +
                        </Button>
                      </HStack>*/}
                    </Td>
                    <Td>{producto.descripcion}</Td>
                    <Td>${producto.precio}</Td>
                  </Tr>
                );
              })
            : null}
        </Tbody>
      </Table>
    </Box>
  ) : null;
};

export default ProdTable;
