import * as React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import PasswordInput from "./PasswordInput";
import { updateUser } from "../api/users";

const roleLabel = (isAdmin) => {
  if (isAdmin === 1) return "Administrador";
  if (isAdmin === 3) return "Administrador de catálogo (productos pedido)";
  return "Usuario";
};

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export default function AbmUserModal({
  isOpen,
  onClose,
  user,
  locales,
  onSaved,
  startInEditMode = false,
}) {
  const toast = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [branchId, setBranchId] = React.useState("");
  const [role, setRole] = React.useState("0");
  const [password, setPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!user || !isOpen) return;
    setNombre(user.nombre || "");
    setEmail(user.email || "");
    const id = user.id ?? "";
    setBranchId(id === "" ? "" : String(id));
    setRole(String(user.isAdmin ?? 0));
    setPassword("");
    setIsEditing(startInEditMode);
  }, [user, isOpen, locales, startInEditMode]);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const branchDisplayName = () => {
    if (branchId === "") return "—";
    const loc = locales.find((l) => String(l.id) === String(branchId));
    return loc?.nombre?.trim() || `Local #${branchId}`;
  };

  const onDropBranch = (item) => {
    setBranchId(String(item.id));
  };

  const handleSave = async () => {
    if (!user?.usuario) return;
    if (!validateEmail(email)) {
      toast({ title: "Email inválido", status: "warning", duration: 4000, isClosable: true });
      return;
    }
    if (!nombre.trim()) {
      toast({ title: "El nombre es obligatorio", status: "warning", duration: 4000, isClosable: true });
      return;
    }
    if (branchId === "") {
      toast({ title: "Seleccione una sucursal", status: "warning", duration: 4000, isClosable: true });
      return;
    }
    setSaving(true);
    try {
      await updateUser({
        usuario: user.usuario,
        nombre: nombre.trim(),
        email: email.trim(),
        id: Number(branchId),
        isAdmin: Number(role),
        password: password.trim() || undefined,
      });
      toast({ title: "Usuario actualizado", status: "success", duration: 3000, isClosable: true });
      setIsEditing(false);
      await onSaved();
    } catch (e) {
      toast({
        title: "No se pudo guardar",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader pr={12}>Usuario: {user.usuario}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isEditing ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <div>
                <Text fontSize="sm" color="gray.600">
                  Nombre
                </Text>
                <Text fontWeight="medium">{nombre.trim() || "—"}</Text>
              </div>
              <div>
                <Text fontSize="sm" color="gray.600">
                  Email
                </Text>
                <Text fontWeight="medium">{email.trim() || "—"}</Text>
              </div>
              <div>
                <Text fontSize="sm" color="gray.600">
                  Sucursal
                </Text>
                <Text fontWeight="medium">{branchDisplayName()}</Text>
              </div>
              <div>
                <Text fontSize="sm" color="gray.600">
                  Rol
                </Text>
                <Text fontWeight="medium">{roleLabel(Number(role))}</Text>
              </div>
            </SimpleGrid>
          ) : (
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} bg="white" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} bg="white" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Sucursal</FormLabel>
                <Menu>
                  {({ isOpen: menuOpen }) => (
                    <>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        isActive={menuOpen}
                        width="100%"
                        textAlign="left"
                        fontWeight="normal"
                      >
                        {branchId === "" ? "Seleccionar sucursal" : branchDisplayName()}
                      </MenuButton>
                      <MenuList maxH="240px" overflowY="auto">
                        {locales.map((datos) => {
                          if (datos.nombre === "" && datos.id === "") return null;
                          return (
                            <MenuItem key={datos.id} onClick={() => onDropBranch(datos)}>
                              {datos.nombre}
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </>
                  )}
                </Menu>
              </FormControl>
              <FormControl>
                <FormLabel>Rol</FormLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value)} bg="white">
                  <option value="0">Usuario</option>
                  <option value="1">Administrador</option>
                  <option value="3">Administrador de catálogo (productos pedido)</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Nueva contraseña (opcional)</FormLabel>
                <PasswordInput
                  placeholder="Dejar vacío para no cambiar"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter gap={2} flexWrap="wrap">
          {!isEditing ? (
            <>
              <Button colorScheme="orange" variant="solid" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                Cerrar
              </Button>
            </>
          ) : (
            <>
              <Button colorScheme="green" onClick={handleSave} isLoading={saving} isDisabled={saving}>
                Guardar cambios
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setNombre(user.nombre || "");
                  setEmail(user.email || "");
                  const id = user.id ?? "";
                  setBranchId(id === "" ? "" : String(id));
                  setRole(String(user.isAdmin ?? 0));
                  setPassword("");
                }}
              >
                Cancelar
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
