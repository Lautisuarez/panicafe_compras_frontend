import * as React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import configData from "../config.json";
import { jwtDecode } from "jwt-decode";
import { productAllowsPedidoCompras } from "../utils/productOrder";

const ProdModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sent, handleSent] = React.useState(false);
  const [orderErrorOpen, setOrderErrorOpen] = React.useState(false);
  const [orderErrorMessage, setOrderErrorMessage] = React.useState("");
  const toast = useToast();
  const cancelRef = React.useRef();

  const IconoCarrito = () => {
    return <Icon as={FiShoppingCart} />;
  };

  let totalPedido = 0;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const postPedido = async (bd) => {
    const response = await fetch(configData.SERVER_URL + "/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(bd),
    });
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
  };

  const handleRefreshCatalogAfterError = async () => {
    setOrderErrorOpen(false);
    if (typeof props.onRefreshCatalog === "function") {
      try {
        await props.onRefreshCatalog();
        toast({
          title: "Catálogo actualizado",
          description:
            "El carrito se alineó con los productos habilitados para pedido.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } catch (e) {
        toast({
          title: "No se pudo actualizar el catálogo",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    }
  };

  const sendPedido = async () => {
    const t = new Date();
    const z = t.getTimezoneOffset() * 60 * 1000;
    let tLocal = t - z;
    tLocal = new Date(tLocal);
    let date = tLocal.toISOString();
    date = date.slice(0, 19);
    date = date.replace("T", " ");

    let idCliente;
    try {
      idCliente = jwtDecode(localStorage.getItem("token")).id;
    } catch {
      toast({
        title: "Sesión inválida",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const pedido = {
      precioTotal: totalPedido,
      idCliente,
      fecha: date,
      productos: props.prodList,
    };

    try {
      const prodFiltrado = pedido.productos.filter(
        (item) =>
          productAllowsPedidoCompras(item) &&
          item.hasOwnProperty("cantidad") &&
          item.cantidad !== 0 &&
          item.cantidad !== undefined
      );
      const pedidoFiltrado = { ...pedido, productos: prodFiltrado };
      const { status, data } = await postPedido(pedidoFiltrado);

      if (status === 201) {
        handleSent(true);
        return;
      }

      const serverMsg =
        data.mensaje ||
        data.message ||
        "No se pudo completar el pedido. Intente nuevamente.";

      if (status === 400) {
        setOrderErrorMessage(serverMsg);
        setOrderErrorOpen(true);
        toast({
          title: "Pedido rechazado",
          description: serverMsg,
          status: "warning",
          duration: 6000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "Error al enviar el pedido",
        description: serverMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error de red",
        description: String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <IconButton icon={<IconoCarrito />} m="5px" onClick={onOpen} />

      <AlertDialog
        isOpen={orderErrorOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setOrderErrorOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Productos no habilitados
            </AlertDialogHeader>
            <AlertDialogBody>
              {orderErrorMessage}
              <br />
              <br />
              Puede actualizar el catálogo para quitar del carrito los artículos
              que ya no están permitidos.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setOrderErrorOpen(false)}>
                Cerrar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleRefreshCatalogAfterError}
                ml={3}
              >
                Actualizar catálogo y carrito
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="min(96vw, 960px)">
          <ModalHeader>Pedido</ModalHeader>

          {sent ? (
            <ModalBody>El pedido fue enviado con exito.</ModalBody>
          ) : (
            <ModalBody>
              {props.prodList.length > 0 ? (
                <TableContainer maxW="100%">
                  <Table
                    variant="simple"
                    size="sm"
                    sx={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <colgroup>
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "58%" }} />
                      <col style={{ width: "30%" }} />
                    </colgroup>
                    <Thead>
                      <Tr>
                        <Th textAlign="center">Cantidad</Th>
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
                              <Td textAlign="center">{producto.cantidad}</Td>
                              <Td minW={0} wordBreak="break-word">
                                {capitalizeFirstLetter(producto.descripcion)}
                              </Td>
                              <Td isNumeric whiteSpace="nowrap">
                                ${parseFloat(totalUnitario).toFixed(2)}
                              </Td>
                            </Tr>
                          );
                        }
                        return null;
                      })}
                      <Tr>
                        <Td
                          colSpan={2}
                          fontWeight="semibold"
                          verticalAlign="middle"
                          py={3}
                        >
                          <Text whiteSpace="nowrap">Total del pedido</Text>
                        </Td>
                        <Td
                          isNumeric
                          fontWeight="semibold"
                          verticalAlign="middle"
                          whiteSpace="nowrap"
                          py={3}
                        >
                          {totalPedido > 0
                            ? `$${parseFloat(totalPedido).toFixed(2)}`
                            : "$0"}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
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
