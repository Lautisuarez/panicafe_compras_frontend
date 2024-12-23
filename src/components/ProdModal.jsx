import * as React from "react";
import {
  Button,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import configData from "../config.json";
import jwt_decode from "jwt-decode";

const ProdModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sent, handleSent] = React.useState(false);

  const IconoCarrito = () => {
    return <Icon as={FiShoppingCart} />;
  };

  let totalPedido = 0;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAPICall = async (bd) => {
    const response = await fetch(configData.SERVER_URL + "/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(bd),
    });
    if (response.status !== 201) {
      alert("error");
    }
    if (response.status === 201) {
      handleSent(true);
    }
  };

  const sendPedido = async () => {
    // Definiendo Date

    const t = new Date();
    const z = t.getTimezoneOffset() * 60 * 1000;
    let tLocal = t - z;
    tLocal = new Date(tLocal);
    let date = tLocal.toISOString();
    date = date.slice(0, 19);
    date = date.replace("T", " ");

    // Armando objeto pedido
    const pedido = {
      precioTotal: totalPedido,
      idCliente: jwt_decode(localStorage.getItem("token")).id,
      fecha: date,
      productos: props.prodList,
    };

    // Enviando pedido
    try {
      const prodFiltrado = pedido.productos.filter(
        (item) => item.hasOwnProperty("cantidad") && item.cantidad !== 0 && item.cantidad !== undefined
      );
      const pedidoFiltrado = { ...pedido, productos: prodFiltrado };
      handleAPICall(pedidoFiltrado);
    } catch (error) {
      alert(`Parece que ha habido un error. ${error}`);
    }
  };

  return (
    <>
      <IconButton icon={<IconoCarrito />} m="5px" onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedido</ModalHeader>

          {sent ? (
            <ModalBody>El pedido fue enviado con exito.</ModalBody>
          ) : (
            <ModalBody>
              {props.prodList.length > 0 ? (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Cantidad</Th>
                      <Th>Producto</Th>
                      <Th isNumeric>Precio total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {props.prodList.map((producto, index) => {
                      const totalUnitario = producto.precio * producto.cantidad;
                      if (!Number.isNaN(totalUnitario)) {
                        totalPedido += totalUnitario;
                      }
                      if (
                        producto.cantidad !== 0 &&
                        !Number.isNaN(totalUnitario)
                      ) {
                        return (
                          <Tr key={index}>
                            <Td isNumeric>{producto.cantidad}</Td>
                            <Td w="100%">
                              {capitalizeFirstLetter(producto.descripcion)}
                            </Td>
                            <Td isNumeric>
                              ${parseFloat(totalUnitario).toFixed(2)}
                            </Td>
                          </Tr>
                        );
                      } else {
                        return null;
                      }
                    })}
                    <Tr>
                      <Th>Total del pedido</Th>
                      <Td></Td>
                      <Td isNumeric fontWeight="semibold">
                        {totalPedido > 0
                          ? `$${parseFloat(totalPedido).toFixed(2)}`
                          : "$0"}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              ) : (
                <div>Parece que no sumaste ningun elemento al carrito aún.</div>
              )}
            </ModalBody>
          )}

          {sent ? (
            <ModalFooter>
              <Button variant="ghost" onClick={props.logout}>
                Cerrar
              </Button>
            </ModalFooter>
          ) : (
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={sendPedido}>
                Confirmar pedido
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProdModal;
