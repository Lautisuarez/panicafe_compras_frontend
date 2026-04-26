import * as React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  Input,
  Select,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Box,
} from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";
import { FiPlus } from "react-icons/fi";
import { CheckCircleIcon, ChevronDownIcon } from "@chakra-ui/icons";
import configData from "../config.json";
import { getLocales } from "../api/users";
import { ROLE_SELECT_OPTIONS } from "../utils/isAdminLabels";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const AbmModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [showErrors, setShowErrors] = React.useState(false);
  const [select, setSelect] = React.useState("");
  const [infoAddUser, setInfoAddUser] = React.useState([]);
  const [id, setId] = React.useState(0);
  const [user, setUser] = React.useState("");
  const [userCreated, setUserCreated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [userRole, setUserRole] = React.useState(0);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loadingLocales, setLoadingLocales] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const isFormValid =
    validateEmail(email) &&
    nombre.trim() !== "" &&
    user.trim() !== "" &&
    password !== "" &&
    select !== "";

  const resetFormState = () => {
    setShowErrors(false);
    setSelect("");
    setId(0);
    setUser("");
    setPassword("");
    setUserRole(0);
    setNombre("");
    setEmail("");
  };

  const handleClose = () => {
    if (userCreated) {
      props.getUsers();
    }
    setUserCreated(false);
    resetFormState();
    onClose();
  };

  const handleOpen = async () => {
    resetFormState();
    setUserCreated(false);
    setLoadingLocales(true);
    try {
      const data = await getLocales();
      setInfoAddUser(Array.isArray(data) ? data : []);
    } catch {
      setInfoAddUser([]);
      toast({
        title: "No se pudo cargar el listado de sucursales",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingLocales(false);
    }
    onOpen();
  };

  const handleAPICall = async () => {
    if (!isFormValid) {
      setShowErrors(true);
      toast({
        title: "Revisá los campos marcados",
        status: "warning",
        duration: 3500,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${configData.SERVER_URL}/adduser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id,
          isAdmin: userRole,
          usuario: user.trim().toLowerCase(),
          pass: password,
          nombre: nombre.trim(),
          email: email.trim(),
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.status === 201) {
        setUserCreated(true);
        setShowErrors(false);
        return;
      }

      const msg =
        typeof data === "string"
          ? data
          : data?.mensaje || "No se pudo crear el usuario. Verificá los datos o si el usuario ya existe.";
      toast({ title: msg, status: "error", duration: 5000, isClosable: true });
    } catch {
      toast({
        title: "Error de conexión",
        description: "No se pudo contactar al servidor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onDropSelect = (item) => {
    setId(item.id);
    setSelect(item.nombre);
  };

  return (
    <>
      <Tooltip label="Añadir usuario" hasArrow>
        <IconButton
          icon={<Icon as={FiPlus} />}
          aria-label="Añadir usuario"
          onClick={handleOpen}
          isLoading={loadingLocales}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={handleClose} size="xl" closeOnOverlayClick={false}>
        <ModalOverlay bg="blackAlpha.400" />
        {!userCreated ? (
          <ModalContent mx={4}>
            <ModalHeader pb={2}>
              Nuevo usuario
              <Text fontWeight="normal" fontSize="sm" color="gray.600" mt={1}>
                Los usuarios inician sesión con el nombre de usuario y la contraseña definidos aquí.
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={showErrors && !nombre.trim()}>
                  <FormLabel>Nombre completo</FormLabel>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. María García"
                    bg="white"
                  />
                  <FormErrorMessage>Ingresá el nombre</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={showErrors && !validateEmail(email)}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@empresa.com"
                    bg="white"
                  />
                  <FormErrorMessage>Usá un email válido</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={showErrors && !user.trim()}>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <Input
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Se guardará en minúsculas"
                    bg="white"
                    autoComplete="off"
                  />
                  <FormErrorMessage>Ingresá el nombre de usuario</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={showErrors && !password}>
                  <FormLabel>Contraseña</FormLabel>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña inicial"
                  />
                  <FormErrorMessage>Ingresá una contraseña</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={showErrors && select === ""}>
                  <FormLabel>Sucursal</FormLabel>
                  <Menu>
                    {({ isOpen: menuOpen }) => (
                      <>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          isActive={menuOpen}
                          width="100%"
                          justifyContent="space-between"
                          fontWeight="normal"
                          textAlign="left"
                          variant="outline"
                        >
                          {select === "" ? "Seleccionar sucursal" : select}
                        </MenuButton>
                        <MenuList maxH="260px" overflowY="auto" zIndex={1500}>
                          {infoAddUser.map((datos) => {
                            if (datos.nombre === "" || datos.id === "") return null;
                            return (
                              <MenuItem key={datos.id} onClick={() => onDropSelect(datos)}>
                                {datos.nombre}
                              </MenuItem>
                            );
                          })}
                        </MenuList>
                      </>
                    )}
                  </Menu>
                  <FormErrorMessage>Seleccioná una sucursal</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Rol</FormLabel>
                  <Select
                    value={String(userRole)}
                    onChange={(e) => setUserRole(Number(e.target.value))}
                    bg="white"
                  >
                    {ROLE_SELECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter gap={3} flexWrap="wrap">
              <Button
                colorScheme="orange"
                onClick={handleAPICall}
                isLoading={submitting}
                loadingText="Creando…"
              >
                Crear usuario
              </Button>
              <Button variant="ghost" onClick={handleClose} isDisabled={submitting}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent mx={4}>
            <ModalHeader>Usuario creado</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} py={2}>
                <Box color="green.500">
                  <CheckCircleIcon boxSize={12} />
                </Box>
                <Text textAlign="center" fontSize="md">
                  El usuario <strong>{user.trim().toLowerCase()}</strong> fue dado de alta y ya puede iniciar sesión
                  con la contraseña indicada.
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="orange" onClick={handleClose}>
                Listo
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

export default AbmModal;
