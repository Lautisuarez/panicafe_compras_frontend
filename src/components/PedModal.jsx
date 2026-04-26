import React, { useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import configData from "../config.json";
import { FaHistory } from "react-icons/fa";

const PedModal = (props) => {
  const [pedidoLines, setPedidoLines] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pedidosDates = Array.isArray(props.pedidosDate) ? props.pedidosDate : [];

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const totalPedido = useMemo(() => {
    if (!Array.isArray(pedidoLines)) return 0;
    return pedidoLines.reduce((sum, producto) => {
      const totalUnitario = producto.preciounit * producto.cantidad;
      if (
        producto.cantidad !== 0 &&
        !Number.isNaN(totalUnitario)
      ) {
        return sum + totalUnitario;
      }
      return sum;
    }, 0);
  }, [pedidoLines]);

  const loadPedidoDetail = async (idPedido) => {
    if (idPedido == null || idPedido === "") {
      setPedidoLines(null);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        configData.SERVER_URL + "/mispedidosdetalle",
        {
          method: "POST",
          body: JSON.stringify({ idPedido }),
          headers: new Headers({
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          }),
        }
      );
      const res = await response.json();
      setPedidoLines(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error(error);
      setPedidoLines([]);
    } finally {
      setLoading(false);
    }
  };

  const consultalPedidos = (e) => {
    const key = e.target.value;
    setSelectValue(key);
    if (key === "") {
      setPedidoLines(null);
      return;
    }
    const row = pedidosDates[parseInt(key, 10)];
    if (!row || row.idPedido == null) {
      setPedidoLines(null);
      return;
    }
    loadPedidoDetail(row.idPedido);
  };

  const handleClose = () => {
    setPedidoLines(null);
    setSelectValue("");
    onClose();
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

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        closeOnOverlayClick={false}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Historial de pedidos</ModalHeader>
          <ModalBody>
            <Select
              placeholder="Fecha de pedido"
              value={selectValue}
              onChange={consultalPedidos}
            >
              {pedidosDates.map((pedido, key) => (
                <option key={key} value={String(key)}>
                  {pedido.fecha}
                  {"     "}${pedido.precioTotal}
                </option>
              ))}
            </Select>
            {loading ? (
              <Spinner mt={4} />
            ) : pedidoLines ? (
              <TableContainer mt={4} maxW="100%">
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
                    {pedidoLines.map((producto, index) => {
                      const totalUnitario =
                        producto.preciounit * producto.cantidad;
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
                        <Text lineHeight="short" whiteSpace="nowrap">
                          Total del pedido
                        </Text>
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
              <Table mt={4} />
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={handleClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PedModal;
