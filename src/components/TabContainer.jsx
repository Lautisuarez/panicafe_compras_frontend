import * as React from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ProdTable from "./ProdTable";

const TabContainer = (props) => {
  return (
    <Tabs>
      <TabList>
        <Tab>Productos</Tab>
        <Tab>Recientes</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ProdTable {...props} />
        </TabPanel>
        <TabPanel>
          <ProdTable {...props} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TabContainer;
