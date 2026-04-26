import configData from "../config.json";

const getHeader = () => {
  return new Headers({
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json",
  });
};

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

/**
 * Catalog for order flow (GET /productos). May include all articles with
 * permitePedidoCompras / PERMITEPEDIDOCOMPRAS; UI must block ordering when false.
 */
export const fetchProductosCatalogo = async () => {
  const response = await fetch(`${configData.SERVER_URL}/productos`, {
    method: "GET",
    headers: getHeader(),
  });
  const data = await parseJsonSafe(response);
  if (!response.ok) {
    const msg = data.mensaje || data.message || `Error ${response.status}`;
    throw new Error(msg);
  }
  return Array.isArray(data) ? data : [];
};

/**
 * Search products by name (GET /productos/search?q=...).
 * Minimum 2 characters on the server; returns up to 20 results.
 */
export const searchProductos = async (q) => {
  const trimmed = (q || "").trim();
  if (trimmed.length < 2) {
    return [];
  }
  const params = new URLSearchParams({ q: trimmed });
  const response = await fetch(
    `${configData.SERVER_URL}/productos/search?${params.toString()}`,
    {
      method: "GET",
      headers: getHeader(),
    }
  );
  const data = await parseJsonSafe(response);
  if (!response.ok) {
    const msg = data.mensaje || data.message || `Error ${response.status}`;
    throw new Error(msg);
  }
  return Array.isArray(data) ? data : [];
};

/**
 * Full article list for admin (GET /productos/admin).
 */
export const getProductosAdmin = async () => {
  const response = await fetch(`${configData.SERVER_URL}/productos/admin`, {
    method: "GET",
    headers: getHeader(),
  });
  const data = await parseJsonSafe(response);
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: data.mensaje || data.message || "No se pudo cargar el listado",
      items: [],
    };
  }
  return {
    ok: true,
    status: response.status,
    message: "",
    items: Array.isArray(data) ? data : [],
  };
};

/**
 * Toggle PERMITE_PEDIDO_COMPRAS (PATCH /articulos/pedido-habilitado).
 */
export const patchArticuloPedidoHabilitado = async (codigo, habilitado) => {
  const response = await fetch(
    `${configData.SERVER_URL}/articulos/pedido-habilitado`,
    {
      method: "PATCH",
      headers: getHeader(),
      body: JSON.stringify({ codigo, habilitado }),
    }
  );
  const data = await parseJsonSafe(response);
  return {
    ok: response.ok,
    status: response.status,
    data,
    message: data.mensaje || data.message || "",
  };
};
