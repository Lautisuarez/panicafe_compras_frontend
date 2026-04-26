import { jwtDecode } from "jwt-decode";

export const login = () => {
  window.localStorage.setItem("auth", true);
};

export const isAuthenticated = () => {
  if (window.localStorage.getItem("auth") == null) {
    return false;
  } else {
    return true;
  }
};

function decodeToken() {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  try {
    return jwtDecode(raw);
  } catch {
    return null;
  }
}

export const isAdmin = () => {
  const token = decodeToken();
  if (!token || token.isAdmin === null) return null;
  return token.isAdmin === 1 ? true : false;
};

/** Admin full (users ABM) or productos-pedido-only role (JWT isAdmin 1 or 3). */
export const isProductosPedidoAdmin = () => {
  const token = decodeToken();
  if (!token || token.isAdmin === null) return null;
  return token.isAdmin === 1 || token.isAdmin === 3 ? true : false;
};

export const isProduction = () => {
  const token = decodeToken();
  if (!token || token.isAdmin === null) return null;
  return token.isAdmin === 2 ? true : false;
};

export const logout = () => {
  if (window.localStorage.getItem("auth") != null) {
    window.localStorage.removeItem("auth");
    window.localStorage.clear();
  }
};
