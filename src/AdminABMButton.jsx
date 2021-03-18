import { Button } from "@chakra-ui/button";
import { MdAccountBox } from "react-icons/md";
import { Link } from "react-router-dom";
import { isAdmin } from "./protected/AuthService";

const AdminABMButton = () => {
  return isAdmin() ? (
    <Button bgColor="#ebc699" leftIcon={<MdAccountBox />} m="10px">
      <Link to="/abm">ABM</Link>
    </Button>
  ) : null;
};
export default AdminABMButton;