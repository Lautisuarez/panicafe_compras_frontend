import * as React from "react";
import { HStack, Heading, Spacer } from "@chakra-ui/react";

const HeaderModel = (props) => {
  const t = props.text;
  return (
    <HStack>
      <Heading size="lg">{t}</Heading>
      <Spacer />
    </HStack>
  );
};

export default HeaderModel;
