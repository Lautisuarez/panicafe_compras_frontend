import * as React from "react";
import { Heading } from "@chakra-ui/react";

const HeaderModel = (props) => {
  const t = props.text;
  return (
    <Heading mt="10%" m="5%" size="lg">
      {t}
    </Heading>
  );
};

export default HeaderModel;
