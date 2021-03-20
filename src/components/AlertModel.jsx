import * as React from "react";
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

const AlertModel = (props) => {
  const text = props.text;
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
};

export default AlertModel;
