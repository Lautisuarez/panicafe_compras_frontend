import { Button } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import { MdAccountBox, MdShoppingBasket } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { isAdmin, isProductosPedidoAdmin } from "./protected/AuthService";

const AdminABMButton = () => {
  const fullAdmin = isAdmin();
  const productosAdmin = isProductosPedidoAdmin();
  if (!fullAdmin && !productosAdmin) return null;

  return (
    <VStack spacing={3} width="100%" align="center" py={2}>
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
    </VStack>
  );
};
export default AdminABMButton;