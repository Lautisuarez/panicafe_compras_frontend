import * as React from "react";
import { Heading } from "@chakra-ui/react";

const HeaderModel = (props) => {
  const t = props.text;
  return (
    <Heading size="lg">
      {t}
    </Heading>
  );
};

export default HeaderModel;
