import * as React from "react";
import {
  Box,
  HStack,
  IconButton,
  Input,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { ArrowRightIcon, CloseIcon } from "@chakra-ui/icons";
import { productAllowsPedidoCompras } from "../utils/productOrder";

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

  const handleProd = (producto, quantity) => {
    if (!productAllowsPedidoCompras(producto)) return;

    const product = producto.descripcion;
    const precio = producto.precio;
    const id = producto.id;
    const rubro = producto.rubro;

    if (quantity === undefined) {
      const itemIndex = getItemIndex(cart, product);
      const prodObj = {
        id: id,
        descripcion: product,
        precio: precio,
        rubro: rubro,
        show: true,
        permitePedidoCompras: producto.permitePedidoCompras,
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
        permitePedidoCompras: producto.permitePedidoCompras,
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
    return (
      obj.hasOwnProperty(prop) &&
      obj[prop] !== null &&
      obj[prop] !== undefined &&
      obj[prop] !== ""
    );
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
          {props.ready && props.prodList.length > 0 ? (
            cart.map((producto, index) => {
              const handleChange = (e, index) => {
                let newArr = values;
                newArr[index] = { value: e.target.value };
                handleValues(newArr);
              };

              const canOrder = productAllowsPedidoCompras(producto);

              return producto.show ? (
                <Tr
                  key={producto.id}
                  bgColor={
                    !canOrder
                      ? "gray.100"
                      : hasValidProperty(producto, "cantidad")
                      ? "gainsboro"
                      : "white"
                  }
                  color={!canOrder ? "gray.600" : undefined}
                  title={
                    !canOrder
                      ? "Este producto no está disponible para pedido en este momento"
                      : undefined
                  }
                >
                  <Td>
                    <Input
                      data-key={index}
                      placeholder="0"
                      onChange={(event) => handleChange(event, index)}
                      type="number"
                      isDisabled={!canOrder}
                      opacity={!canOrder ? 0.7 : 1}
                    />
                  </Td>
                  <Td>
                    <HStack>
                      {hasValidProperty(producto, "cantidad") && canOrder ? (
                        <IconButton
                          aria-label="Remover"
                          colorScheme="red"
                          icon={<CloseIcon />}
                          onClick={() => {
                            handleProd(producto);
                          }}
                        />
                      ) : null}
                      <Tooltip
                        label="No disponible para pedido"
                        isDisabled={canOrder}
                        placement="top"
                      >
                        <Box display="inline-block">
                          <IconButton
                            aria-label="Añadir"
                            colorScheme="whatsapp"
                            icon={<ArrowRightIcon />}
                            isDisabled={!canOrder}
                            onClick={() => {
                              if (!canOrder) return;
                              values[index]?.value > 0
                                ? handleProd(
                                    producto,
                                    values[index].value
                                  )
                                : console.error("Error de añadido.");
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </HStack>
                  </Td>
                  <Td>{producto.cantidad ? producto.cantidad : null}</Td>
                  <Td w="100%">
                    <Text as="span" fontWeight={!canOrder ? "medium" : "normal"}>
                      {capitalizeFirstLetter(producto.descripcion)}
                    </Text>
                    {!canOrder ? (
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        No disponible para pedido
                      </Text>
                    ) : null}
                  </Td>
                  <Td isNumeric>${producto.precio}</Td>
                </Tr>
              ) : null;
            })
          ) : (
            <Tr>
              <Td>No hay productos disponibles para este rubro</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  ) : null;
};

export default ProdTable;
