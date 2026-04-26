import { jwtDecode } from "jwt-decode";

export const login = () => {
  window.localStorage.setItem("auth", true);
};

/** Max session UI (minutes). Must not exceed the JWT lifetime set on the server. */
export const SESSION_TIMER_CAP_MINUTES = 20;

/**
 * Returns true if there is no token, it is invalid, or the JWT `exp` is in the past.
 */
export const isTokenExpired = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return true;
  try {
    const { exp } = jwtDecode(raw);
    if (exp == null) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const isAuthenticated = () => {
  if (window.localStorage.getItem("auth") == null) {
    return false;
  }
  if (isTokenExpired()) {
    logout();
    return false;
  }
  return true;
};

/**
 * On successful login, cap the session countdown to the real JWT time left
 * so the UI timer and token expiry do not diverge.
 */
export const setSessionTimeLeftForNewToken = (token) => {
  const capSeconds = SESSION_TIMER_CAP_MINUTES * 60;
  try {
    const { exp } = jwtDecode(token);
    if (exp == null) {
      localStorage.setItem("timeLeft", String(capSeconds));
      return;
    }
    const secondsLeft = Math.max(0, exp - Math.floor(Date.now() / 1000));
    localStorage.setItem("timeLeft", String(Math.min(secondsLeft, capSeconds)));
  } catch {
    localStorage.setItem("timeLeft", String(capSeconds));
  }
};

function decodeToken() {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  try {
    const decoded = jwtDecode(raw);
    if (decoded.exp != null && Date.now() >= decoded.exp * 1000) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export const isAdmin = () => {
  const token = decodeToken();
  if (!token || token.isAdmin === null) return null;
  return token.isAdmin === 1 ? true : false;
};

/** JWT isAdmin 4: only invoice scanning (no ABM, no catalog pedidos). */
export const isInvoiceScanOnly = () => {
  const token = decodeToken();
  if (!token || token.isAdmin === null) return null;
  return token.isAdmin === 4 ? true : false;
};

/** Full admin (1) or facturas-only (4) — can use /facturas and invoice APIs. */
export const canAccessInvoiceScanner = () => {
  const token = decodeToken();
  if (!token || token.isAdmin === null) return null;
  return token.isAdmin === 1 || token.isAdmin === 4 ? true : false;
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
