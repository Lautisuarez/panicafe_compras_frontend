import configData from "../config.json";

const getHeader = () => {
    return new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
    })
}

export const getUsers = async () => {
    try {
        const response = await fetch(`${configData.SERVER_URL}/getUsers`, {
          method: "GET",
          headers: getHeader(),
        });
        return await response.json();
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const deleteUser = async (usuario) => {
    const response = await fetch(`${configData.SERVER_URL}/deleteUser`, {
      method: "DELETE",
      headers: getHeader(),
      body: JSON.stringify({
        usuario,
      }),
    });
    await response.json();
};