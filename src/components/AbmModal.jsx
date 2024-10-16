import * as React from "react";
import {
  Button,
  Checkbox,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  Spacer,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";

import { FiPlus } from "react-icons/fi";
import { ChevronDownIcon } from "@chakra-ui/icons";
import configData from "../config.json";
import AlertModel from "./AlertModel";

const AbmModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isValidated, setValidated] = React.useState(false);
  const [select, setSelect] = React.useState("");
  const [infoAddUser, setInfoAddUser] = React.useState([]);
  const [id, setId] = React.useState(0);
  const [user, setUser] = React.useState("");
  const [userCreated, setUserCreated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(0);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const IconoCarrito = () => {
    return <Icon as={FiPlus} />;
  };
  const getInfoAddUser = async () => {
    const response = await fetch(configData.SERVER_URL + "/getInfoAddUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    setInfoAddUser(await response.json());
  };

  const handleAPICall = async (usuario, password, isAdmin, nombre, email) => {
    const response = await fetch(configData.SERVER_URL + "/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ id, isAdmin, usuario, password, nombre, email }),
    });
    console.log(response);
    if (response.status === 201) {
      setUserCreated(true);
    }
  };

  const helper = () => {
    props.getUsers();
    onClose();

    setUserCreated(false);
  };

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const formValidation = () => {
    const res =
      validateEmail(email) &&
      nombre !== "" &&
      user !== "" &&
      password !== "" &&
      select !== ""
        ? false
        : true;
    setValidated(res);
  };

  const onDropSelect = (item) => {
    setId(item.id);
    setSelect(item.nombre);
  };

  React.useEffect(() => {
    formValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre, user, password, select, validateEmail(email)]);

  return (
    <>
      <IconButton
        icon={<IconoCarrito />}
        m="5px"
        onClick={() => {
          getInfoAddUser();
          onOpen();
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />

        {!userCreated ? (
          <ModalContent>
            <ModalHeader>Añadir usuario</ModalHeader>

            <ModalBody>
              <VStack>
                <Spacer />
                <Input
                  placeholder="Nombre"
                  onChange={(event) => {
                    setNombre(event.target.value);
                  }}
                />
                {nombre === "" ? (
                  <AlertModel text="Por favor ingrese nombre." />
                ) : null}
                <Input
                  placeholder="Email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                {validateEmail(email) ? null : (
                  <AlertModel text="Por favor ingrese un formato de email válido." />
                )}
                <Input
                  placeholder="Usuario"
                  onChange={(event) => {
                    setUser(event.target.value);
                  }}
                />
                {user === "" ? (
                  <AlertModel text="Por favor ingrese un usuario." />
                ) : null}

                <PasswordInput
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  placeholder={"Contraseña"}
                />
                {password === "" ? (
                  <AlertModel text="Por favor ingrese una contraseña segura" />
                ) : null}
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        isActive={isOpen}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        isFullWidth="true"
                      >
                        {isOpen
                          ? "Cerrar"
                          : select === ""
                          ? "Sucursal"
                          : select}
                      </MenuButton>
                      <MenuList>
                        {infoAddUser.map((datos) => {
                          if (datos.nombre === "" || datos.id === "")
                            return null;

                          return (
                            <MenuItem onClick={() => onDropSelect(datos)}>
                              {datos.nombre}
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </>
                  )}
                </Menu>
                <Checkbox onChange={() => setIsAdmin(1)}>
                  Administrador
                </Checkbox>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="whatsapp"
                onClick={() =>
                  handleAPICall(user, password, isAdmin, nombre, email)
                }
                isDisabled={isValidated}
              >
                Enviar
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>Pedido</ModalHeader>

            <ModalBody>
              <VStack>
                <Spacer />
                <h3>Usuario Creado</h3>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={helper}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

export default AbmModal;
