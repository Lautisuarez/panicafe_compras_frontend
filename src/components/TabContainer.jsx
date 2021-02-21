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
  const [searchList, handleSearchList] = React.useState([]);
  const [cartList, handleCartList] = React.useState([]);

  const searchProdList = (x) => {
    handleSearchList(x);
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
          <Spacer />
          <ProdModal prodList={cartList} />
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProdTable
              {...props}
              searchList={searchList}
              callback={cartFinalList}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default TabContainer;
