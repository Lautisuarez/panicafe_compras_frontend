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

  const getItemIndex = (arr, item) => {
    return arr.findIndex((e) => e.descripcion === item);
  };

  const handleProd = (product, precio, id, rubro, quantity) => {
    if (quantity === undefined) {
      const itemIndex = getItemIndex(cart, product);
      const prodObj = {
        id: id,
        descripcion: product,
        precio: precio,
        rubro: rubro,
        show: true,
      };
      props.handleQuantity(prodObj);
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
        rubro: rubro,
        show: true,
      };
      props.handleQuantity(prodObj);
      if (itemIndex === -1) {
        handleCart((prevArray) => [...prevArray, prodObj]);
        return;
      }
      const newArr = [...cart];
      newArr[itemIndex] = prodObj;
      handleCart(newArr);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const hasValidProperty = (obj, prop) => {
    return obj.hasOwnProperty(prop) && obj[prop] !== null && obj[prop] !== undefined && obj[prop] !== '';
  };

  React.useEffect(() => {
    handleCart(props.prodList);
  }, [props.prodList]);

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
          {props.ready && props.prodList.length > 0
            ? cart.map((producto, index) => {
                const handleChange = (e, index) => {
                  let newArr = values;
                  newArr[index] = { value: e.target.value };
                  handleValues(newArr);
                };

                return producto.show ? (
                  <Tr
                    key={producto.id}
                    bgColor={hasValidProperty(producto, 'cantidad') ? "gainsboro" : "white"}
                  >
                    <Td>
                      <Input
                        data-key={index}
                        placeholder="0"
                        onChange={(event) => handleChange(event, index)}
                        type="number"
                      />
                    </Td>
                    <Td>
                      <HStack>
                        {hasValidProperty(producto, 'cantidad') ? (
                          <IconButton
                            aria-label="Remover"
                            colorScheme="red"
                            icon={<CloseIcon />}
                            onClick={() => {
                              handleProd(
                                producto.descripcion,
                                producto.precio,
                                producto.id,
                                producto.rubro
                              );
                            }}
                          />
                        ) : null}
                        <IconButton
                          aria-label="Añadir"
                          colorScheme="whatsapp"
                          icon={<ArrowRightIcon />}
                          onClick={() => {
                            values[index]?.value > 0
                              ? handleProd(
                                  producto.descripcion,
                                  producto.precio,
                                  producto.id,
                                  producto.rubro,
                                  values[index].value
                                )
                              : console.error("Error de añadido.");
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
            : <Tr>
                <Td>No hay productos disponibles para este rubro</Td>
              </Tr>}
        </Tbody>
      </Table>
    </Box>
  ) : null;
};

export default ProdTable;
