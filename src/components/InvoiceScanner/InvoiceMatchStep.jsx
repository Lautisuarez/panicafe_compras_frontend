import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { MdShoppingBasket } from "react-icons/md";
import { typeBadgeColor, formatArgCurrency } from "./invoiceFormat";
import ProductSelector from "./ProductSelector";

const InvoiceMatchStep = ({
  invoice,
  fileName,
  matchData,
  selections,
  selectionProducts,
  stockSaved,
  loading,
  allProductsAssigned,
  setStep,
  resetScanner,
  updateProductSelection,
  handleConfirmStock,
}) => (
  <VStack gap={4} align="stretch" pb={4}>
    <Box>
      <Heading size="sm" color="gray.700" mb={1}>
        Asignar productos
      </Heading>
      <Text fontSize="sm" color="gray.500">
        {fileName}
      </Text>
    </Box>

    <Flex
      justify="space-between"
      align="center"
      flexWrap="wrap"
      gap={4}
      py={1}
    >
      <HStack gap={4} flexWrap="wrap" align="center">
        <Button size="sm" variant="outline" onClick={() => setStep("edit")}>
          Volver a editar factura
        </Button>
        <Badge
          colorScheme={typeBadgeColor(invoice.comprobante?.tipo)}
          fontSize="md"
          px={2}
          py={1}
          borderRadius="md"
        >
          FACTURA {invoice.comprobante?.tipo || "?"}
        </Badge>
        <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
          {invoice.comprobante?.puntoVenta || "—"}-
          {invoice.comprobante?.numero || "—"}
        </Text>
      </HStack>
      <Button size="sm" variant="ghost" onClick={resetScanner}>
        Cargar otra factura
      </Button>
    </Flex>

    <Box
      bg="gray.50"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
      boxShadow="sm"
    >
      <Box
        bg="white"
        px={{ base: 4, md: 6 }}
        py={5}
        borderBottomWidth="1px"
        borderColor="gray.100"
      >
        <Heading size="md" mb={2} color="gray.800">
          Asignar productos del sistema
        </Heading>
        <Text fontSize="sm" color="gray.600" lineHeight="tall">
          Cada linea de la factura debe corresponder a un articulo del
          catalogo. Elegi una sugerencia o busca escribiendo al menos dos
          letras. La lista de resultados se abre en una ventana flotante
          para que puedas verla completa mientras revisas la tabla.
        </Text>
      </Box>

      <Box px={{ base: 2, md: 4 }} py={4} overflowX="auto">
        <Table size="md" variant="simple">
          <Thead>
            <Tr>
              <Th width="48px" color="gray.600">
                #
              </Th>
              <Th minW="160px" color="gray.600">
                Texto en factura
              </Th>
              <Th color="gray.600">Cant.</Th>
              <Th color="gray.600">P. unit.</Th>
              <Th minW="320px" w="100%" color="gray.600">
                Producto en sistema
              </Th>
              <Th width="40px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {(invoice.items || []).map((item, idx) => {
              const match = (matchData.matches || []).find(
                (m) => m.itemIndex === idx
              );
              const sugerencias = match ? match.sugerencias || [] : [];
              const selectedProduct = selectionProducts[idx];
              const ok = selections[idx] != null;

              return (
                <Tr
                  key={idx}
                  bg={ok ? "white" : "orange.50"}
                  _hover={{ bg: ok ? "gray.50" : "orange.50" }}
                >
                  <Td
                    verticalAlign="top"
                    pt={4}
                    fontWeight="medium"
                    color="gray.500"
                  >
                    {idx + 1}
                  </Td>
                  <Td verticalAlign="top" pt={4}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.800">
                      {item.producto}
                    </Text>
                  </Td>
                  <Td verticalAlign="top" pt={4} whiteSpace="nowrap">
                    {item.cantidad}
                  </Td>
                  <Td verticalAlign="top" pt={4} whiteSpace="nowrap">
                    {formatArgCurrency(item.precioUnitario)}
                  </Td>
                  <Td verticalAlign="top" py={3} minW="280px">
                    <ProductSelector
                      sugerencias={sugerencias}
                      value={selections[idx]}
                      selectedProduct={selectedProduct}
                      onChange={(codigo, producto) =>
                        updateProductSelection(idx, codigo, producto)
                      }
                    />
                  </Td>
                  <Td verticalAlign="top" pt={4} textAlign="center">
                    {ok ? (
                      <CheckIcon color="green.500" boxSize={5} />
                    ) : (
                      <Text fontSize="xs" color="orange.600">
                        Falta
                      </Text>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      <HStack
        flexWrap="wrap"
        gap={5}
        justify="flex-end"
        align="center"
        bg="gray.50"
        px={{ base: 4, md: 6 }}
        py={4}
        borderTopWidth="1px"
        borderColor="gray.200"
      >
        <Button variant="outline" size="md" onClick={resetScanner}>
          Descartar
        </Button>
        <Button
          colorScheme="green"
          size="md"
          leftIcon={<MdShoppingBasket />}
          onClick={handleConfirmStock}
          isLoading={loading}
          isDisabled={stockSaved || !allProductsAssigned}
          title={
            !stockSaved && !allProductsAssigned
              ? "Asigna un producto del catalogo a cada linea antes de confirmar"
              : undefined
          }
        >
          {stockSaved
            ? "Stock registrado"
            : "Confirmar ingreso de stock"}
        </Button>
      </HStack>
    </Box>
  </VStack>
);

export default InvoiceMatchStep;
