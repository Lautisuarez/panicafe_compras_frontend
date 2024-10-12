import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import configData from "../config.json";
import { FaHistory } from "react-icons/fa";

const PedModal = (props) => {
  const [historialPedidos, handlehistorialPedidos] = useState(false);  
  const { isOpen, onOpen, onClose } = useDisclosure();
  let idPedido;
  let totalPedido = 0;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getPedidosByDate = async () => {
    if (historialPedidos !== []) {
      fetch(configData.SERVER_URL + "/mispedidosdetalle", {
        method: "POST",
        body: JSON.stringify(idPedido),
        headers: new Headers({
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          handlehistorialPedidos(res);
        })
        .catch((error) => console.error(error));
    }
  };

  function consultalPedidos(e)   {
    idPedido = props.pedidosDate[e.target.value];
    getPedidosByDate();
  };

  return (
    <div>
      <Button
        bgColor="#ebc699"
        m="0px 10px 0px 10px"
        width="90%" 
        onClick={onOpen}
        leftIcon={<FaHistory />}
      >
        Mis Pedidos
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Historial de pedidos</ModalHeader>
            <ModalBody>
              <Select placeholder="Fecha de pedido" onChange={consultalPedidos}>
                {props.pedidosDate.map((pedido, key) => (
                  <option key={key} value={key}>{pedido.fecha}		&emsp;	&emsp;	&emsp;	&emsp;	&emsp;   ${pedido.precioTotal}</option>
                ))}
              </Select>
              {historialPedidos ? (
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Cantidad</Th>
                        <Th>Producto</Th>
                        <Th isNumeric>Precio total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {historialPedidos.map((producto, index) => {
                        const totalUnitario = producto.preciounit * producto.cantidad;
                        if (!Number.isNaN(totalUnitario)) {
                          totalPedido += totalUnitario;
                        }
                        if ( producto.cantidad !== 0 && !Number.isNaN(totalUnitario)) {
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
                          <Td colSpan={2}>Total del pedido</Td>
                          <Td isNumeric fontWeight="semibold">
                            {totalPedido > 0
                              ? `$${parseFloat(totalPedido).toFixed(2)}`
                              : "$0"}
                          </Td>
                        </Tr>
                    </Tbody>
                  </Table>
                ) : (
                  <Table>

                  </Table>
                )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PedModal;
