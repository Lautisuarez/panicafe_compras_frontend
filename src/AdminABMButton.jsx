import { Button, VStack } from "@chakra-ui/react";
import { MdAccountBox, MdShoppingBasket, MdReceipt } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { isAdmin, isProductosPedidoAdmin } from "./protected/AuthService";

const AdminABMButton = () => {
  const fullAdmin = isAdmin();
  const productosAdmin = isProductosPedidoAdmin();
  if (!fullAdmin && !productosAdmin) return null;

  return (
    <VStack gap={3} width="100%" align="center" py={2}>
      {fullAdmin ? (
        <Button
          as={RouterLink}
          to="/abm"
          bgColor="#ebc699"
          leftIcon={<MdAccountBox />}
          maxW="220px"
          justifyContent="center"
        >
          ABM
        </Button>
      ) : null}
      {productosAdmin ? (
        <Button
          as={RouterLink}
          to="/abm-productos"
          bgColor="#ebc699"
          leftIcon={<MdShoppingBasket />}
          maxW="220px"
          justifyContent="center"
        >
          Productos
        </Button>
      ) : null}
      {fullAdmin ? (
        <Button
          as={RouterLink}
          to="/facturas"
          bgColor="#ebc699"
          leftIcon={<MdReceipt />}
          maxW="220px"
          justifyContent="center"
        >
          Facturas
        </Button>
      ) : null}
    </VStack>
  );
};
export default AdminABMButton;
