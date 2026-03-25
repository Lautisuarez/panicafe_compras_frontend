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
import { productAllowsPedidoCompras } from "../utils/productOrder";

const mergeCatalogWithCart = (serverList, prevList) => {
  const qtyById = new Map();
  for (const p of prevList) {
    if (
      p &&
      p.id != null &&
      p.cantidad != null &&
      p.cantidad !== undefined &&
      Number(p.cantidad) !== 0
    ) {
      qtyById.set(p.id, p.cantidad);
    }
  }
  return serverList.map((prod) => {
    const allows = productAllowsPedidoCompras(prod);
    const next = { ...prod, show: true };
    if (allows && qtyById.has(prod.id)) {
      next.cantidad = qtyById.get(prod.id);
    }
    return next;
  });
};

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
  }, []);

  React.useEffect(() => {
    handleProdList((prev) => mergeCatalogWithCart(props.prodList, prev));
  }, [props.prodList]);

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
          <ProdModal
            prodList={prodList}
            logout={props.logout}
            onRefreshCatalog={props.onRefreshCatalog}
          />
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
