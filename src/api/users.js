import configData from "../config.json";

const getHeader = () => {
    return new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
    })
}

const normalizeUserRow = (item) => {
    if (item == null) return null;
    if (typeof item === "string") {
        const usuario = item.trim();
        if (!usuario) return null;
        return {
            usuario,
            nombre: "",
            email: "",
            id: 0,
            isAdmin: 0,
        };
    }
    if (typeof item !== "object") return null;
    const usuario = item.usuario != null ? String(item.usuario).trim() : "";
    if (!usuario) return null;
    return {
        usuario,
        nombre: item.nombre ?? "",
        email: item.email ?? "",
        id: item.id ?? 0,
        isAdmin: item.isAdmin ?? 0,
    };
};

export const getUsers = async () => {
    try {
        const response = await fetch(`${configData.SERVER_URL}/getUsers`, {
          method: "GET",
          headers: getHeader(),
        });
        const data = await response.json();
        if (!Array.isArray(data)) return [];
        return data.map(normalizeUserRow).filter((row) => row != null);
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getLocales = async () => {
    try {
        const response = await fetch(`${configData.SERVER_URL}/getInfoAddUser`, {
            method: "GET",
            headers: getHeader(),
        });
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const updateUser = async ({ usuario, nombre, email, id, isAdmin, password }) => {
    const body = { usuario, nombre, email, id, isAdmin };
    if (password !== undefined && String(password).length > 0) {
        body.password = password;
    }
    const response = await fetch(`${configData.SERVER_URL}/editUser`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const msg = typeof data === "string" ? data : data?.message || "Error al guardar";
        throw new Error(msg);
    }
    return data;
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