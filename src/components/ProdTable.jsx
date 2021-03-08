import * as React from "react";
import { Box, HStack, IconButton, Input } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { ArrowRightIcon, CloseIcon } from "@chakra-ui/icons";

const ProdTable = (props) => {
  const [cart, handleCart] = React.useState([]);
  const [values, handleValues] = React.useState(async () => {
    let array = [];
    const n = await props.prodList.length;
    for (let index = 0; index < n; index++) {
      array.push({ value: 0 });
    }
    return array;
  });

  const [addedValues, handleAddedValues] = React.useState(() => {
    let array = [];
    const n = props.prodList.length;
    for (let index = 0; index < n; index++) {
      array.push({ added: false });
    }
    return array;
  });

  const getItemIndex = (arr, item) => {
    return arr.findIndex((e) => e.descripcion === item);
  };

  const handleProd = (product, precio, id, quantity) => {
    if (quantity === undefined) {
      const itemIndex = getItemIndex(cart, product);
      const prodObj = {
        id: id,
        descripcion: product,
        precio: precio,
        show: true,
      };
      addedValuesHandler(itemIndex, 0);
      const newArr = [...cart];
      newArr[itemIndex] = prodObj;
      handleCart(newArr);
    } else {
      const itemIndex = getItemIndex(cart, product);
      const prodObj = {
        id: id,
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
      addedValuesHandler(itemIndex, 1);
    }
  };

  const addedValuesHandler = (index, condition) => {
    if (condition === 1) {
      let newArr = addedValues;
      newArr[index] = { added: true };
      handleAddedValues(newArr);
    } else if (condition === 0) {
      let newArr = addedValues;
      newArr[index] = { added: false };
      handleAddedValues(newArr);
    }
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

  return props.ready ? (
    <Box>
      <Table variant="simple">
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
                  <Tr
                    key={producto.id}
                    bgColor={addedValues[index].added ? "gainsboro" : "white"}
                  >
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
                      <HStack>
                        {addedValues[index].added ? (
                          <IconButton
                            aria-label="Remover"
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={() => {
                              handleProd(
                                producto.descripcion,
                                producto.precio,
                                producto.id
                              );
                            }}
                          />
                        ) : null}
                        <IconButton
                          aria-label="Añadir"
                          colorScheme="whatsapp"
                          icon={<ArrowRightIcon />}
                          onClick={() => {
                            values[index]?.value > 0 ? 
                            handleProd(
                              producto.descripcion,
                              producto.precio,
                              producto.id,
                              values[index].value
                            )
                            :
                            console.log("1");
                          }}
                        />
                      </HStack>
                    </Td>
                    <Td>{producto.cantidad ? producto.cantidad : null}</Td>
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
