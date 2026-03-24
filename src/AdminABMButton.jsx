import { Button } from "@chakra-ui/button";
import { VStack } from "@chakra-ui/layout";
import { MdAccountBox, MdShoppingBasket } from "react-icons/md";
import { Link } from "react-router-dom";
import { isAdmin } from "./protected/AuthService";

const AdminABMButton = () => {
  return isAdmin() ? (
    <VStack spacing={2} width="100%">
      <Button
        bgColor="#ebc699"
        leftIcon={<MdAccountBox />}
        m="10px"
        width="90%"
      >
        <Link to="/abm">ABM</Link>
      </Button>
      <Button
        bgColor="#ebc699"
        leftIcon={<MdShoppingBasket />}
        m="10px"
        width="90%"
      >
        <Link to="/abm-productos">Productos pedido</Link>
      </Button>
    </VStack>
  ) : null;
};
export default AdminABMButton;