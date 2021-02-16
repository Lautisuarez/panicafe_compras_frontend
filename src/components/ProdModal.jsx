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

  const IconoCarrito = () => {
    return <Icon as={FiShoppingCart} />;
  };

  let totalPedido = 0;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <IconButton icon={<IconoCarrito />} m="5px" onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedido</ModalHeader>
          <ModalCloseButton />
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
                    totalPedido += totalUnitario;
                    if (producto.cantidad !== 0) {
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
                      ${totalPedido}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            ) : (
              <div>Parece que no sumaste ningun elemento al carrito aún.</div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Confirmar pedido
            </Button>
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
