import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { Navigate } from "react-router-dom";
import { logout } from "../protected/AuthService";
import HeaderModel from "./HeaderModel";
import AbmModal from "./AbmModal";
import AbmUserModal from "./AbmUserModal";
import { jwtDecode } from "jwt-decode";
import { DeleteIcon, EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { getUsers, deleteUser, getLocales } from "../api/users";
import { roleLabelLong, roleLabelShort } from "../utils/isAdminLabels";

const ABM = () => {
  const [token, setToken] = React.useState({});
  const [redirect, handleRedirect] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [locales, setLocales] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [startInEditMode, setStartInEditMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isOpen: isUserModalOpen, onOpen: onUserModalOpen, onClose: onUserModalClose } =
    useDisclosure();
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [userToDelete, setUserToDelete] = React.useState(null);
  const deleteCancelRef = React.useRef();

  const refreshUsers = React.useCallback(async () => {
    const list = await getUsers();
    setUsers(list);
    setSelectedUser((prev) => {
      if (!prev) return null;
      const next = list.find((u) => u != null && u.usuario === prev.usuario);
      return next ?? prev;
    });
  }, []);

  React.useEffect(() => {
    const mountABM = async () => {
      setUsers(await getUsers());
      try {
        const raw = localStorage.getItem("token");
        setToken(raw ? jwtDecode(raw) : {});
      } catch {
        setToken({});
      }
    };
    mountABM();
  }, []);

  React.useEffect(() => {
    const loadLocales = async () => {
      if (token.isAdmin !== 1) return;
      setLocales(await getLocales());
    };
    loadLocales();
  }, [token.isAdmin]);

  const logoutHandler = () => {
    logout();
    handleRedirect(true);
  };

  const requestDeleteUser = (usuario) => {
    setUserToDelete(usuario);
    onDeleteDialogOpen();
  };

  const handleDeleteUserConfirm = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
      await refreshUsers();
    }
    setUserToDelete(null);
    onDeleteDialogClose();
  };

  const handleDeleteUserCancel = () => {
    setUserToDelete(null);
    onDeleteDialogClose();
  };

  const openUserDetail = (user, edit) => {
    setSelectedUser(user);
    setStartInEditMode(edit);
    onUserModalOpen();
  };

  const sortedUsers = React.useMemo(() => {
    return [...users]
      .filter((u) => u != null && u.usuario)
      .sort((a, b) =>
        (a.usuario || "").localeCompare(b.usuario || "", "es", { sensitivity: "base" })
      );
  }, [users]);

  const localeName = (id) => {
    if (id === undefined || id === null || id === "") return "—";
    const loc = locales.find((l) => String(l.id) === String(id));
    return loc?.nombre?.trim() || `#${id}`;
  };

  const filteredUsers = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sortedUsers;
    return sortedUsers.filter((row) => {
      const sucursal = localeName(row.id).toLowerCase();
      const chunks = [
        row.usuario,
        row.nombre,
        row.email,
        sucursal,
        roleLabelShort(row.isAdmin),
      ].map((s) => String(s || "").toLowerCase());
      return chunks.some((c) => c.includes(q));
    });
  }, [sortedUsers, searchQuery, locales]);

  return redirect ? (
    <Navigate to="/" replace />
  ) : token.isAdmin === 1 ? (
    <Box flex="1" minW={0} w="100%" pl={{ base: 4, md: "200px" }} pr={{ base: 4, md: 10 }} py={8}>
      <Box maxW="1400px" mx="auto">
        <Flex
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={8}
        >
          <VStack align="start" spacing={1}>
            <HeaderModel text="Usuarios" />
            <Text color="gray.600" fontSize="sm">
              Alta, consulta, edición y baja de cuentas. El nombre de usuario no se puede cambiar.
            </Text>
          </VStack>
          <Spacer display={{ base: "none", md: "block" }} />
          <Button p="20px" onClick={logoutHandler} alignSelf={{ base: "stretch", md: "center" }}>
            Desconectarse
          </Button>
        </Flex>

        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="blackAlpha.100"
          overflow="hidden"
        >
          <HStack
            justify="space-between"
            align="center"
            px={6}
            py={4}
            borderBottomWidth="1px"
            borderColor="blackAlpha.100"
            bg="orange.50"
            flexWrap="wrap"
            gap={3}
          >
            <Heading size="sm" fontWeight="semibold">
              Listado
            </Heading>
            <HStack flex="1" justify="flex-end" minW={{ base: "100%", md: "280px" }} maxW="420px">
              <InputGroup size="sm" bg="white" borderRadius="md">
                <InputLeftElement pointerEvents="none" h="full">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  pl={9}
                  placeholder="Buscar…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="md"
                  aria-label="Filtrar usuarios"
                />
              </InputGroup>
              <AbmModal getUsers={refreshUsers} />
            </HStack>
          </HStack>

          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Usuario</Th>
                  <Th>Nombre</Th>
                  <Th>Email</Th>
                  <Th>Sucursal</Th>
                  <Th>Rol</Th>
                  <Th textAlign="right">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedUsers.length === 0 ? (
                  <Tr>
                    <Td colSpan={6}>
                      <Text py={8} textAlign="center" color="gray.500">
                        No hay usuarios cargados.
                      </Text>
                    </Td>
                  </Tr>
                ) : filteredUsers.length === 0 ? (
                  <Tr>
                    <Td colSpan={6}>
                      <Text py={8} textAlign="center" color="gray.500">
                        Ningún usuario coincide con la búsqueda.
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  filteredUsers.map((row) => {
                    if (!row?.usuario) return null;
                    return (
                      <Tr key={row.usuario} _hover={{ bg: "orange.50" }}>
                        <Td fontWeight="medium">{row.usuario}</Td>
                        <Td>{row.nombre || "—"}</Td>
                        <Td>{row.email || "—"}</Td>
                        <Td>{localeName(row.id)}</Td>
                        <Td>
                          <Tooltip label={roleLabelLong(row.isAdmin)} hasArrow placement="top">
                            <Text as="span" cursor="default">
                              {roleLabelShort(row.isAdmin)}
                            </Text>
                          </Tooltip>
                        </Td>
                        <Td textAlign="right">
                          <ButtonGroup size="sm" variant="outline" spacing={1}>
                            <Tooltip label="Ver datos" hasArrow>
                              <IconButton
                                aria-label="Ver usuario"
                                icon={<ViewIcon />}
                                onClick={() => openUserDetail(row, false)}
                              />
                            </Tooltip>
                            <Tooltip label="Editar" hasArrow>
                              <IconButton
                                aria-label="Editar usuario"
                                icon={<EditIcon />}
                                onClick={() => openUserDetail(row, true)}
                              />
                            </Tooltip>
                            <Tooltip label="Eliminar" hasArrow>
                              <IconButton
                                aria-label="Eliminar usuario"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                variant="solid"
                                onClick={() => requestDeleteUser(row.usuario)}
                              />
                            </Tooltip>
                          </ButtonGroup>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <AbmUserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          onUserModalClose();
          setSelectedUser(null);
        }}
        user={selectedUser}
        locales={locales}
        onSaved={refreshUsers}
        startInEditMode={startInEditMode}
      />

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={deleteCancelRef}
        onClose={handleDeleteUserCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar usuario
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Está seguro de que desea eliminar este usuario?
              {userToDelete ? (
                <Text mt={2} fontWeight="medium">
                  {userToDelete}
                </Text>
              ) : null}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={deleteCancelRef} onClick={handleDeleteUserCancel}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteUserConfirm} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  ) : null;
};

export default ABM;
