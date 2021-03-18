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

const AbmModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    // Cambiar link
    const response = await fetch(configData.SERVER_URL + "/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ id, isAdmin, usuario, password, nombre, email }),
    });
    if (response.status === 201) {
      setUserCreated(true);
    }
  };

  const helper = () => {
    props.getUsers();
    onClose();

    setUserCreated(false);
  };
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
                <Input
                  placeholder="Email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                <Input
                  placeholder="Usuario"
                  onChange={(event) => {
                    setUser(event.target.value);
                  }}
                />

                <PasswordInput
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  placeholder={"Contraseña"}
                />
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        isActive={isOpen}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        isFullWidth="true"
                      >
                        {isOpen ? "Cerrar" : "Sucursal"}
                      </MenuButton>
                      <MenuList>
                        {/* Mapeo de sucursal */}
                        { infoAddUser.length > 0 ?
                        infoAddUser.map((datos) => {
                          return (
                            <MenuItem onClick={() => setId(datos.id)}>
                              {datos.nombre}
                            </MenuItem>
                          );
                        })
                      :
                      console.log(infoAddUser)
                      }
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
