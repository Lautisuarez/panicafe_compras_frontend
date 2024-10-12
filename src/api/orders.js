import configData from "../config.json";

const getHeader = () => {
    return new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
    })
}

export const getOrdersByUser = async (username, since, to) => {
    try {
        const response = await fetch(`${configData.SERVER_URL}/pedidos/user?usuario=${username}&desde=${since}&hasta=${to}`, {
          method: "GET",
          headers: getHeader(),
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getOrdersDetail = async (ordersID) => {
    try {
        const response = await fetch(`${configData.SERVER_URL}/pedidos/detalle`, {
          method: "POST",
          headers: getHeader(),
          body: JSON.stringify({ idPedidos: ordersID })
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return [];
    }
};