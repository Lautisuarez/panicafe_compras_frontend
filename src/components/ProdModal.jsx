import * as React from "react";
import {
  Button,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
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
    // Cambiar link
    const response = await fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(bd),
    });
    // Manejo de Modal
    if (response.status !== 201) {
      alert("error");
    }
    handleSent(true);
    // Espacio para manejar response
    // const myJson = await response.json();
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
      idCliente: 2,
      fecha: date,
      productos: props.prodList,
    };

    // Enviando pedido
    try {
      const prodFiltrado = pedido.productos.filter(
        (item) => item.hasOwnProperty("cantidad") && item.cantidad !== 0
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedido</ModalHeader>
          <ModalCloseButton />

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
                            <Td isNumeric>${totalUnitario}</Td>
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
                        {totalPedido > 0 ? `$${totalPedido}` : "$0"}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              ) : (
                <div>Parece que no sumaste ningun elemento al carrito aún.</div>
              )}
            </ModalBody>
          )}

          <ModalFooter>
            {sent ? (null):(
            <Button colorScheme="blue" mr={3} onClick={sendPedido}>
              Confirmar pedido
            </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProdModal;
