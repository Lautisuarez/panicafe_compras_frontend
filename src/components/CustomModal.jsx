import * as React from "react";
import {
  Button,
  Checkbox,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Center,
   Image, 
   Input, 
   Spacer, 
   VStack
} from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";

import { FiPlus } from "react-icons/fi";
const CustomModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [user, setUser] = React.useState("");
  const [userCreated, setUserCreated] = React.useState(false)
  const [password, setPassword] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(0)
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const IconoCarrito = () => {
    return <Icon as={FiPlus} />;
  };
  const handleAPICall = async (usuario, password,isAdmin,nombre,email) => {
    // Cambiar link
    const response = await fetch("http://localhost:3001/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({isAdmin,
        usuario,
      password,
      nombre,
      email}),
    });

    if (response.status === 201) {
        setUserCreated(true)
    }
  };

  const helper = () =>{
    props.getUsers()
    onClose()

    setUserCreated(false)
  }
  return (
    <>
      <IconButton icon={<IconoCarrito /> } m="5px" onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        
        { !userCreated ? 
        <ModalContent>
            <ModalHeader>Pedido</ModalHeader>
            
          
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
            <Checkbox onChange={() => setIsAdmin(1)}>Administrador</Checkbox>
            <Button onClick={() => handleAPICall(user,password,isAdmin,nombre,email)}>Enviar</Button>
            </VStack>
            
        </ModalBody>
        
          
          
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          
            
        </ModalContent>
        :

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
        }
      </Modal>
    </>
  );
};

export default CustomModal;
