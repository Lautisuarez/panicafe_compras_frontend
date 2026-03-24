import { Button } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import { MdAccountBox, MdShoppingBasket } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { isAdmin } from "./protected/AuthService";

const AdminABMButton = () => {
  return isAdmin() ? (
    <VStack spacing={3} width="100%" align="center" py={2}>
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
    </VStack>
  ) : null;
};
export default AdminABMButton;