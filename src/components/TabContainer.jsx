import * as React from "react";
import {
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import ProdTable from "./ProdTable";
import ProdModal from "./ProdModal";
import Searchbar from "./Searchbar";

const TabContainer = (props) => {
  const [newList, handleNewList] = React.useState([]);
  const [cartList, handleCartList] = React.useState([]);

  const searchProdList = (x) => {
    handleNewList(x);
  };

  const cartFinalList = (x) => {
    handleCartList(x);
  };

  return (
    <VStack mt="15px">
      <Searchbar {...props} callback={searchProdList} />
      <Tabs>
        <TabList>
          <Tab>Productos</Tab>
          {/* <Tab>Recientes</Tab> */}
          <Spacer />
          <ProdModal prodList={cartList} />
        </TabList>

        <TabPanels>
          <TabPanel>
            {newList.some((item) => item.id != null) ? (
              <ProdTable
                {...props}
                prodList={newList}
                callback={cartFinalList}
              />
            ) : (
              <ProdTable {...props} callback={cartFinalList} />
            )}
          </TabPanel>
          {/* <TabPanel>
            {newList.some((item) => item.id != null) ? (
              <ProdTable {...props} prodList={newList} />
            ) : (
              <ProdTable {...props} />
            )}
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default TabContainer;
