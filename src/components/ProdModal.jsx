import * as React from "react";
import {
  Button,
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

const ProdModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button m="5px" onClick={onOpen}>
        Enviar
      </Button>

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
                    <Th isNumeric>Cantidad</Th>
                    <Th>Producto</Th>
                    <Th isNumeric>Precio</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {props.prodList.map((producto, index) => {
                    return (
                      <Tr key={index}>
                        <Td>{producto.cantidad}</Td>
                        <Td>{producto.descripcion}</Td>
                        <Td>${producto.precio}</Td>
                      </Tr>
                    );
                  })}
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
