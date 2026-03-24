import {
  Button,
  CircularProgress,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import * as React from "react";
import { Redirect } from "react-router";
import { isProductosPedidoAdmin, logout } from "../protected/AuthService";
import HeaderModel from "./HeaderModel";
import {
  getProductosAdmin,
  patchArticuloPedidoHabilitado,
} from "../api/products";

const AdminProductosPedido = () => {
  const [redirect, setRedirect] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [pendingId, setPendingId] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const toast = useToast();

  const loadList = React.useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const res = await getProductosAdmin();
    if (!res.ok) {
      setLoadError(res.message);
      setItems([]);
    } else {
      setItems(res.items);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadList();
  }, [loadList]);

  const logoutHandler = () => {
    logout();
    setRedirect(true);
  };

  const handleToggle = async (row, nextEnabled) => {
    setPendingId(row.id);
    const result = await patchArticuloPedidoHabilitado(row.id, nextEnabled);
    setPendingId(null);

    if (!result.ok) {
      toast({
        title: "No se pudo actualizar",
        description:
          result.message ||
          (result.status === 404
            ? "Artículo no encontrado"
            : "Intente nuevamente"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Actualizado",
      description: result.message || undefined,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    await loadList();
  };

  const filteredItems = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) => {
      const desc = String(row.descripcion ?? "").toLowerCase();
      const rubro = String(row.rubro ?? "").toLowerCase();
      const idStr = String(row.id ?? "");
      return (
        desc.includes(q) || rubro.includes(q) || idStr.includes(q)
      );
    });
  }, [items, searchQuery]);

  if (redirect) {
    return <Redirect to="/" />;
  }

  if (isProductosPedidoAdmin() !== true) {
    return null;
  }

  return (
    <Container paddingLeft="150px">
      <HStack>
        <HeaderModel text="Catalogo de Productos" />
        <Spacer />
        <Button p="20px" onClick={logoutHandler}>
          Desconectarse
        </Button>
      </HStack>
      <VStack align="stretch" spacing={4} mt={4}>
        {!loading && !loadError && items.length > 0 && (
          <FormControl maxW="md">
            <FormLabel htmlFor="admin-productos-buscar" mb={1}>
              Buscar
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                id="admin-productos-buscar"
                placeholder="Artículo, rubro o código…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="white"
              />
            </InputGroup>
          </FormControl>
        )}
        {loading ? (
          <Flex justify="center" py={10}>
            <CircularProgress
              isIndeterminate
              color="#f7d4ab"
              thickness="4px"
            />
          </Flex>
        ) : loadError ? (
          <Text color="red.600">{loadError}</Text>
        ) : (
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Artículo</Th>
                <Th>Rubro</Th>
                <Th>Habilitado para pedido</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredItems.length === 0 ? (
                <Tr>
                  <Td colSpan={4}>
                    {items.length === 0
                      ? "No hay artículos"
                      : "Ningún artículo coincide con la búsqueda"}
                  </Td>
                </Tr>
              ) : (
                filteredItems.map((row) => (
                  <Tr key={row.id}>
                    <Td>
                      {typeof row.descripcion === "string" &&
                      row.descripcion.trim() !== ""
                        ? row.descripcion.trim()
                        : `(Sin descripción — código ${row.id})`}
                    </Td>
                    <Td>{row.rubro ?? ""}</Td>
                    <Td>
                      <Switch
                        isChecked={Boolean(row.permitePedidoCompras)}
                        isDisabled={pendingId === row.id}
                        onChange={(e) =>
                          handleToggle(row, e.target.checked)
                        }
                      />
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Container>
  );
};

export default AdminProductosPedido;
