import React from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { typeBadgeColor } from "./invoiceFormat";

const InvoiceEditStep = ({
  invoice,
  fileName,
  loading,
  updateField,
  updateItem,
  addItem,
  removeItem,
  goToMatchStep,
  resetScanner,
}) => (
  <VStack gap={6} align="stretch">
    <HStack>
      <Badge
        colorScheme={typeBadgeColor(invoice.comprobante?.tipo)}
        fontSize="lg"
        px={3}
        py={1}
        borderRadius="md"
      >
        FACTURA {invoice.comprobante?.tipo || "?"}
      </Badge>
      <Text ml={3} color="gray.500">
        {fileName}
      </Text>
      <Spacer />
      <Button size="sm" variant="ghost" onClick={resetScanner}>
        Cargar otra factura
      </Button>
    </HStack>

    <Box>
      <Heading size="sm" mb={3}>
        Comprobante
      </Heading>
      <SimpleGrid
        minChildWidth="140px"
        spacingX={4}
        spacingY={8}
        alignItems="start"
      >
        <FormControl maxW="100px">
          <FormLabel fontSize="xs" mb={1}>
            Tipo
          </FormLabel>
          <Input
            size="sm"
            value={invoice.comprobante?.tipo || ""}
            onChange={(e) => updateField("comprobante", "tipo", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="100px">
          <FormLabel fontSize="xs" mb={1}>
            Codigo
          </FormLabel>
          <Input
            size="sm"
            value={invoice.comprobante?.codigo || ""}
            onChange={(e) => updateField("comprobante", "codigo", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="120px">
          <FormLabel fontSize="xs" mb={1}>
            Pto. Venta
          </FormLabel>
          <Input
            size="sm"
            value={invoice.comprobante?.puntoVenta || ""}
            onChange={(e) =>
              updateField("comprobante", "puntoVenta", e.target.value)
            }
          />
        </FormControl>
        <FormControl maxW="150px">
          <FormLabel fontSize="xs" mb={1}>
            Numero
          </FormLabel>
          <Input
            size="sm"
            value={invoice.comprobante?.numero || ""}
            onChange={(e) => updateField("comprobante", "numero", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="160px">
          <FormLabel fontSize="xs" mb={1}>
            Fecha Emision
          </FormLabel>
          <Input
            size="sm"
            value={invoice.comprobante?.fechaEmision || ""}
            onChange={(e) =>
              updateField("comprobante", "fechaEmision", e.target.value)
            }
          />
        </FormControl>
      </SimpleGrid>
    </Box>

    <Divider />

    <Box>
      <Heading size="sm" mb={3}>
        Emisor
      </Heading>
      <SimpleGrid
        minChildWidth="220px"
        spacingX={4}
        spacingY={8}
        alignItems="start"
      >
        <FormControl minW="220px">
          <FormLabel fontSize="xs" mb={1}>
            Razon Social
          </FormLabel>
          <Input
            size="sm"
            value={invoice.emisor?.razonSocial || ""}
            onChange={(e) => updateField("emisor", "razonSocial", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="180px">
          <FormLabel fontSize="xs" mb={1}>
            CUIT
          </FormLabel>
          <Input
            size="sm"
            value={invoice.emisor?.cuit || ""}
            onChange={(e) => updateField("emisor", "cuit", e.target.value)}
          />
        </FormControl>
        <FormControl minW="220px">
          <FormLabel fontSize="xs" mb={1}>
            Domicilio
          </FormLabel>
          <Input
            size="sm"
            value={invoice.emisor?.domicilio || ""}
            onChange={(e) => updateField("emisor", "domicilio", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="220px">
          <FormLabel fontSize="xs" mb={1}>
            Condicion IVA
          </FormLabel>
          <Input
            size="sm"
            value={invoice.emisor?.condicionIva || ""}
            onChange={(e) =>
              updateField("emisor", "condicionIva", e.target.value)
            }
          />
        </FormControl>
        <FormControl maxW="180px">
          <FormLabel fontSize="xs" mb={1}>
            Ingresos Brutos
          </FormLabel>
          <Input
            size="sm"
            value={invoice.emisor?.ingresosBrutos || ""}
            onChange={(e) =>
              updateField("emisor", "ingresosBrutos", e.target.value)
            }
          />
        </FormControl>
        <FormControl maxW="160px">
          <FormLabel fontSize="xs" mb={1}>
            Inicio Actividades
          </FormLabel>
          <Input
            size="sm"
            value={invoice.emisor?.inicioActividades || ""}
            onChange={(e) =>
              updateField("emisor", "inicioActividades", e.target.value)
            }
          />
        </FormControl>
      </SimpleGrid>
    </Box>

    <Divider />

    <Box>
      <Heading size="sm" mb={3}>
        Receptor
      </Heading>
      <SimpleGrid
        minChildWidth="220px"
        spacingX={4}
        spacingY={8}
        alignItems="start"
      >
        <FormControl minW="220px">
          <FormLabel fontSize="xs" mb={1}>
            Razon Social
          </FormLabel>
          <Input
            size="sm"
            value={invoice.receptor?.razonSocial || ""}
            onChange={(e) =>
              updateField("receptor", "razonSocial", e.target.value)
            }
          />
        </FormControl>
        <FormControl maxW="180px">
          <FormLabel fontSize="xs" mb={1}>
            CUIT
          </FormLabel>
          <Input
            size="sm"
            value={invoice.receptor?.cuit || ""}
            onChange={(e) => updateField("receptor", "cuit", e.target.value)}
          />
        </FormControl>
        <FormControl minW="220px">
          <FormLabel fontSize="xs" mb={1}>
            Domicilio
          </FormLabel>
          <Input
            size="sm"
            value={invoice.receptor?.domicilio || ""}
            onChange={(e) => updateField("receptor", "domicilio", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="220px">
          <FormLabel fontSize="xs" mb={1}>
            Condicion IVA
          </FormLabel>
          <Input
            size="sm"
            value={invoice.receptor?.condicionIva || ""}
            onChange={(e) =>
              updateField("receptor", "condicionIva", e.target.value)
            }
          />
        </FormControl>
        <FormControl maxW="180px">
          <FormLabel fontSize="xs" mb={1}>
            Condicion Venta
          </FormLabel>
          <Input
            size="sm"
            value={invoice.receptor?.condicionVenta || ""}
            onChange={(e) =>
              updateField("receptor", "condicionVenta", e.target.value)
            }
          />
        </FormControl>
      </SimpleGrid>
    </Box>

    <Divider />

    <Box>
      <HStack mb={3}>
        <Heading size="sm">Items</Heading>
        <Spacer />
        <Button size="sm" leftIcon={<AddIcon />} onClick={addItem}>
          Agregar item
        </Button>
      </HStack>
      <Box overflowX="auto">
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Producto / Servicio</Th>
              <Th>Cant.</Th>
              <Th>U. Medida</Th>
              <Th>Precio Unit.</Th>
              <Th>% Bonif.</Th>
              <Th>Subtotal</Th>
              <Th>Alic. IVA</Th>
              <Th>Subtotal c/IVA</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {(invoice.items || []).map((item, idx) => (
              <Tr key={idx}>
                <Td>
                  <Input
                    size="sm"
                    minW="180px"
                    value={item.producto || ""}
                    onChange={(e) => updateItem(idx, "producto", e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    w="80px"
                    value={item.cantidad || ""}
                    onChange={(e) => updateItem(idx, "cantidad", e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    w="100px"
                    value={item.unidadMedida || ""}
                    onChange={(e) =>
                      updateItem(idx, "unidadMedida", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    w="110px"
                    value={item.precioUnitario || ""}
                    onChange={(e) =>
                      updateItem(idx, "precioUnitario", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    w="80px"
                    value={item.bonificacion || ""}
                    onChange={(e) =>
                      updateItem(idx, "bonificacion", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    w="110px"
                    value={item.subtotal || ""}
                    onChange={(e) => updateItem(idx, "subtotal", e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    w="80px"
                    value={item.alicuotaIva || ""}
                    onChange={(e) =>
                      updateItem(idx, "alicuotaIva", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    size="sm"
                    w="120px"
                    value={item.subtotalConIva || ""}
                    onChange={(e) =>
                      updateItem(idx, "subtotalConIva", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <IconButton
                    size="sm"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeItem(idx)}
                    aria-label="Eliminar item"
                  />
                </Td>
              </Tr>
            ))}
            {(!invoice.items || invoice.items.length === 0) && (
              <Tr>
                <Td colSpan={9} textAlign="center" color="gray.400">
                  Sin items. Agrega uno manualmente.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>

    <Divider />

    <Box>
      <Heading size="sm" mb={3}>
        Totales
      </Heading>
      <SimpleGrid
        minChildWidth="140px"
        spacingX={4}
        spacingY={8}
        alignItems="start"
      >
        <FormControl maxW="180px">
          <FormLabel fontSize="xs" mb={1}>
            Neto Gravado
          </FormLabel>
          <Input
            size="sm"
            value={invoice.totales?.netoGravado || ""}
            onChange={(e) => updateField("totales", "netoGravado", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="140px">
          <FormLabel fontSize="xs" mb={1}>
            IVA 21%
          </FormLabel>
          <Input
            size="sm"
            value={invoice.totales?.iva21 || ""}
            onChange={(e) => updateField("totales", "iva21", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="140px">
          <FormLabel fontSize="xs" mb={1}>
            IVA 10.5%
          </FormLabel>
          <Input
            size="sm"
            value={invoice.totales?.iva105 || ""}
            onChange={(e) => updateField("totales", "iva105", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="140px">
          <FormLabel fontSize="xs" mb={1}>
            IVA 27%
          </FormLabel>
          <Input
            size="sm"
            value={invoice.totales?.iva27 || ""}
            onChange={(e) => updateField("totales", "iva27", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="140px">
          <FormLabel fontSize="xs" mb={1}>
            IVA 5%
          </FormLabel>
          <Input
            size="sm"
            value={invoice.totales?.iva5 || ""}
            onChange={(e) => updateField("totales", "iva5", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="140px">
          <FormLabel fontSize="xs" mb={1}>
            IVA 2.5%
          </FormLabel>
          <Input
            size="sm"
            value={invoice.totales?.iva25 || ""}
            onChange={(e) => updateField("totales", "iva25", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="140px">
          <FormLabel fontSize="xs" mb={1}>
            IVA 0%
          </FormLabel>
          <Input
            size="sm"
            value={invoice.totales?.iva0 || ""}
            onChange={(e) => updateField("totales", "iva0", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="180px">
          <FormLabel fontSize="xs" mb={1}>
            Otros Tributos
          </FormLabel>
          <Input
            size="sm"
            value={invoice.totales?.otrosTributos || ""}
            onChange={(e) =>
              updateField("totales", "otrosTributos", e.target.value)
            }
          />
        </FormControl>
        <FormControl maxW="180px">
          <FormLabel fontSize="xs" fontWeight="bold" mb={1}>
            TOTAL
          </FormLabel>
          <Input
            size="sm"
            fontWeight="bold"
            value={invoice.totales?.total || ""}
            onChange={(e) => updateField("totales", "total", e.target.value)}
          />
        </FormControl>
      </SimpleGrid>
    </Box>

    <Divider />

    <Box>
      <Heading size="sm" mb={3}>
        CAE
      </Heading>
      <SimpleGrid
        minChildWidth="200px"
        spacingX={4}
        spacingY={8}
        alignItems="start"
      >
        <FormControl maxW="250px">
          <FormLabel fontSize="xs" mb={1}>
            Numero CAE
          </FormLabel>
          <Input
            size="sm"
            value={invoice.cae?.numero || ""}
            onChange={(e) => updateField("cae", "numero", e.target.value)}
          />
        </FormControl>
        <FormControl maxW="180px">
          <FormLabel fontSize="xs" mb={1}>
            Fecha Vencimiento
          </FormLabel>
          <Input
            size="sm"
            value={invoice.cae?.fechaVencimiento || ""}
            onChange={(e) =>
              updateField("cae", "fechaVencimiento", e.target.value)
            }
          />
        </FormControl>
      </SimpleGrid>
    </Box>

    <HStack justify="flex-end" gap={4} pb={4}>
      <Button variant="outline" onClick={resetScanner}>
        Cancelar
      </Button>
      <Button colorScheme="blue" onClick={goToMatchStep} isLoading={loading}>
        Continuar: asignar productos
      </Button>
    </HStack>
  </VStack>
);

export default InvoiceEditStep;
