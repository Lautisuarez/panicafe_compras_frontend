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
  let cartList = [];

  const searchProdList = (x) => {
    handleSearchList(x);
  };

  const cartFinalList = (newCartList) => {
    /* Update the cart. Add new products, delete them or modify them. 
      Params:
      - newCartList: Array of products with their updated quantities.
    */
    let haveUpdated = false;
    cartList.forEach((prod, index) => {
      newCartList.forEach((newProd) => {
        if(prod.id === newProd.id && newProd.cantidad !== undefined){
          prod["cantidad"] = newProd.cantidad;
          haveUpdated = true;
        } else if (prod.id === newProd.id && !('cantidad' in newProd)){
          cartList[index] = newProd;
          haveUpdated = true;
        }
      })
    })
    if(!haveUpdated) cartList.push(...newCartList);
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
      handleRubroList(res);
    })
    .catch((error) => console.error(error));
  }

  React.useEffect(() => {
    getRubros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedRubroList = React.useMemo(() => rubroList.map((rubro) => {
    return {
      rubro: rubro.rubro,
      filteredProdList: props.prodList.filter(prod => prod.rubro.trim() === rubro.rubro.trim())
    };
  }), [rubroList, props.prodList]);

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
          <ProdModal prodList={cartList} logout={props.logout} />
        </TabList>

        <TabPanels>
          {memoizedRubroList.length > 0 ? 
            memoizedRubroList.map(({ rubro, filteredProdList }) => (
              <TabPanel key={rubro} index={rubro}>
                <ProdTable
                  logout={props.logout}
                  prodList={filteredProdList}
                  ready={props.ready}
                  searchList={searchList}
                  callback={cartFinalList}
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
