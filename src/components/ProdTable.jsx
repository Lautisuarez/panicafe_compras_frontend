import * as React from "react";
import { Box, IconButton, Input } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";

const ProdTable = (props) => {
  const [cart, handleCart] = React.useState([]);
  const [values, handleValues] = React.useState(async () => {
    let array = [];
    const n = await props.prodList.length;
    for (let index = 0; index < n; index++) {
      array.push({ value: 0 });
    }
    console.log("LARGO", n);
    console.log("ARRAY", array);
    return array;
  });

  const getItemIndex = (arr, item) => {
    return arr.findIndex((e) => e.descripcion === item);
  };

  const handleProd = (product, quantity, precio,id) => {
    const itemIndex = getItemIndex(cart, product);
    const prodObj = {
      idProducto: id,
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
          {props.ready
            ? cart.map((producto, index) => {
                const handleChange = (e, index) => {
                  let newArr = values;
                  newArr[index] = { value: e.target.value };
                  handleValues(newArr);
                };

                return producto.show ? (
                  <Tr key={producto.id}>
                    <Td>
                      <Input
                        data-key={index}
                        defaultValue={0}
                        placeholder="..."
                        onChange={(event) => handleChange(event, index)}
                        type="number"
                      />
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Añadir"
                        colorScheme="whatsapp"
                        icon={<ArrowRightIcon />}
                        onClick={() => {
                          handleProd(
                            producto.descripcion,
                            values[index].value,
                            producto.precio,
                            producto.id
                          );
                        }}
                      />
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
