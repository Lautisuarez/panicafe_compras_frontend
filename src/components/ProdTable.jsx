import * as React from "react";
import { Box, Button, HStack, Input, useNumberInput } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import styles from "../styles/List.module.css";

const ProdTable = (props) => {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    step: 1,
    defaultValue: 0,
    min: 0,
    max: 20,
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps({ isReadOnly: true });

  const isReady = props.ready;

  return isReady ? (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th isNumeric>Cantidad</Th>
            <Th>Producto</Th>
            <Th isNumeric>Precio</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.prodList.map((producto) => {
            let counter = 0;
            counter++;
            return (
              <Tr
                className={counter % 2 === 0 ? styles.oddRow : styles.evenRow}
              >
                <Td>
                  <HStack maxW={40}>
                    <Button {...dec}>-</Button>
                    <Input {...input} />
                    <Button {...inc}>+</Button>
                  </HStack>
                </Td>
                <Td>{producto.descripcion}</Td>
                <Td>${producto.precio}</Td>
              </Tr>
            );
          })}

          <Tr>
            <Td>
              <HStack maxW={40}>
                <Button {...dec}>-</Button>
                <Input {...input} />
                <Button {...inc}>+</Button>
              </HStack>
            </Td>
            <Td>Jugo de naranja</Td>
            <Td isNumeric>$111.11</Td>
          </Tr>
          <Tr>
            <Td>
              <HStack maxW={40}>
                <Button {...dec}>-</Button>
                <Input {...input} />
                <Button {...inc}>+</Button>
              </HStack>
            </Td>
            <Td>Cafe</Td>
            <Td isNumeric>$222.22</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  ) : null;
};

export default ProdTable;
