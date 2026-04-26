import configData from "../config.json";

const getAuthHeader = () => ({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

const getJsonHeader = () =>
  new Headers({
    ...getAuthHeader(),
    "Content-Type": "application/json",
  });

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

/**
 * Upload a PDF and get parsed invoice data back.
 * POST /facturas/parse  (multipart/form-data)
 */
export const parseInvoicePdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${configData.SERVER_URL}/facturas/parse`, {
    method: "POST",
    headers: getAuthHeader(),
    body: formData,
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    throw new Error(
      data.mensaje || data.message || `Error ${response.status}`
    );
  }
  return data;
};

/**
 * Send parsed invoice items to get product match suggestions.
 * POST /facturas/match
 */
export const matchInvoiceItems = async (items) => {
  const response = await fetch(`${configData.SERVER_URL}/facturas/match`, {
    method: "POST",
    headers: getJsonHeader(),
    body: JSON.stringify({ items }),
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    throw new Error(
      data.mensaje || data.message || `Error ${response.status}`
    );
  }
  return data;
};

/**
 * Confirm stock entry from matched invoice items.
 * POST /facturas/stock
 */
export const saveStock = async (payload) => {
  const response = await fetch(`${configData.SERVER_URL}/facturas/stock`, {
    method: "POST",
    headers: getJsonHeader(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    throw new Error(
      data.mensaje || data.message || `Error ${response.status}`
    );
  }
  return data;
};
