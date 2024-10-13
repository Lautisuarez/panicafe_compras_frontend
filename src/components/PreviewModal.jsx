import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Tfoot,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { getOrdersDetail } from "../api/orders";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PreviewModal({ ordersID, username, dateFrom, dateTo }) {
  const [products, setProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let totalPedido = 0;

  useEffect(() => {
    const fetchData = async () => {
      if (ordersID.length > 0) {
        setProducts(await getOrdersDetail(ordersID));
      } else {
        setProducts([]);
      }
    };
    fetchData();
  }, [ordersID]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const exportToPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const title = "Detalle de Pedidos";
    const headers = [["Cantidad", "Rubro", "Producto"]];
    const data = products.map((producto) => [
        producto.cantidad,
        producto.r_descrip.trim(),
        capitalizeFirstLetter(producto.descripcion),
      ]
    );
    
    let pageWidth = 14
    let startY = 10;
    doc.text(title, pageWidth, startY);
    startY += 10;

    doc.setFontSize(12);
    doc.text(`Usuario: ${username}`, pageWidth, startY);
    doc.text(`Fecha Desde: ${dateFrom}`, pageWidth + 60, startY);
    doc.text(`Fecha Hasta: ${dateTo}`, pageWidth + 132, startY);
    startY += 2;

    let totalPagesExp = "{total_pages_count_string}";

    const pageContent = function (data) {
        // FOOTER
        let str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }
        doc.setFontSize(10);
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight  - 10);
    };

    doc.autoTable({
        head: headers,
        body: data,
        startY: startY,
        didDrawPage: pageContent,
        theme:"grid",
        styles: {
            cellWidth: "auto",
        },
        headStyles: {
            fillColor: '#ebc699'
        }
    });
    
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    const dateNow = new Date()
    doc.save(`Pedidos_${username}_${dateNow.toLocaleDateString()}_${dateNow.toLocaleTimeString()}.pdf`);
  };

  return (
    <>
      <Button
        colorScheme="gray"
        onClick={onOpen}
        disabled={products.length <= 0}
      >
        Previsualizar
      </Button>
      <Button colorScheme="red" onClick={exportToPDF} mb={4} disabled={products.length <= 0}>
        Exportar a PDF
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalle de los pedidos seleccionados:</ModalHeader>
          <ModalBody>
            {products.length > 0 ? (
              <Table id="preview-table">
                <Thead display="block">
                  <Tr
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Th>Cantidad</Th>
                    <Th>Rubro</Th>
                    <Th w="100%">Producto</Th>
                    <Th isNumeric>Precio total</Th>
                  </Tr>
                </Thead>
                <Tbody maxH="550px" overflowY="auto" display="block">
                  {products.map((producto, index) => {
                    const totalUnitario =
                      producto.preciounit * producto.cantidad;
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
                          <Td isNumeric>{producto.r_descrip.trim()}</Td>
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
                </Tbody>
                <Tfoot display="block">
                  <Tr
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Th colSpan={2}>Total del pedido</Th>
                    <Th isNumeric fontWeight="semibold">
                      {totalPedido > 0
                        ? `$${parseFloat(totalPedido).toFixed(2)}`
                        : "$0"}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            ) : (
              <Table></Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={exportToPDF} mr={4}>
              Exportar a PDF
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
