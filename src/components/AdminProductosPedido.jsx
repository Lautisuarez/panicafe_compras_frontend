import {
  Button,
  CircularProgress,
  Container,
  Flex,
  HStack,
  Spacer,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import * as React from "react";
import { Redirect } from "react-router";
import { logout } from "../protected/AuthService";
import HeaderModel from "./HeaderModel";
import jwt_decode from "jwt-decode";
import {
  getProductosAdmin,
  patchArticuloPedidoHabilitado,
} from "../api/products";

const AdminProductosPedido = () => {
  const [token, setToken] = React.useState({});
  const [redirect, setRedirect] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [pendingId, setPendingId] = React.useState(null);
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
    setToken(jwt_decode(localStorage.getItem("token")));
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

  if (redirect) {
    return <Redirect to="/" />;
  }

  if (token.isAdmin !== 1) {
    return null;
  }

  return (
    <Container paddingLeft="150px">
      <HStack>
        <HeaderModel text="Productos — pedido de compras" />
        <Spacer />
        <Button p="20px" onClick={logoutHandler}>
          Desconectarse
        </Button>
      </HStack>
      <VStack align="stretch" spacing={4} mt={4}>
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
                <Th isNumeric>Precio</Th>
                <Th>Rubro</Th>
                <Th>Habilitado para pedido</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.length === 0 ? (
                <Tr>
                  <Td colSpan={4}>No hay artículos</Td>
                </Tr>
              ) : (
                items.map((row) => (
                  <Tr key={row.id}>
                    <Td>
                      {typeof row.descripcion === "string" &&
                      row.descripcion.trim() !== ""
                        ? row.descripcion.trim()
                        : `(Sin descripción — código ${row.id})`}
                    </Td>
                    <Td isNumeric>${Number(row.precio).toFixed(2)}</Td>
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
