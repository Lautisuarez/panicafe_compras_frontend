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
import configData from "../config.json";

const TabContainer = (props) => {
  const [searchList, handleSearchList] = React.useState([]);
  const [rubroList, handleRubroList] = React.useState([]);
  const [prodList, handleProdList] = React.useState([]);

  const searchProdList = (x) => {
    handleSearchList(x);
  };

  const getRubros = async () => {
    fetch(configData.SERVER_URL + "/rubros", {
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      }),
    })
    .then(response => response.json())
    .then((res) => {
      res.push({rubro: "Todos"})
      handleRubroList(res);
    })
    .catch((error) => console.error(error));
  }

  React.useEffect(() => {
    getRubros();
    handleProdList(props.prodList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterByRubro = (rubro) => {
    if (rubro === "Todos") {
      return prodList;
    } else {
      return prodList.filter(product => product.rubro.trim() === rubro.trim());
    }
  };

  const handleQuantity = (item) => {
    const newProdList = prodList.map(product => 
      product.descripcion === item.descripcion 
        ? { ...product, cantidad: item.cantidad } 
        : product
    );
    
    handleProdList(newProdList);
  };
  

  return (
    <VStack mt="15px">
      <Searchbar {...props} callback={searchProdList} />
      <Tabs>
        <TabList>
          {rubroList.length > 0 ?
          rubroList.map((rubro) => (
            <Tab key={rubro.rubro} index={rubro.rubro}>
              {rubro.rubro}
            </Tab>
          )) :
          <Tab key="0" index="0">
            No hay rubros disponibles
          </Tab>}
          <Spacer />
          <ProdModal prodList={prodList} logout={props.logout} />
        </TabList>

        <TabPanels>
          {rubroList.length > 0 ? 
            rubroList.map(({ rubro }) => (
              <TabPanel key={rubro} index={rubro}>
                <ProdTable
                  logout={props.logout}
                  prodList={filterByRubro(rubro)}
                  ready={props.ready}
                  searchList={searchList}
                  handleQuantity={handleQuantity}
                />
              </TabPanel>
            ))
          : null}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default TabContainer;
