import jwt_decode from "jwt-decode";

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

export const isAdmin = () => {
  const token = jwt_decode(localStorage.getItem("token"));
  if (token.isAdmin === null) return null;
  return token.isAdmin === 1 ? true : false;
};

export const isProduction = () => {
  const token = jwt_decode(localStorage.getItem("token"));
  if (token.isAdmin === null) return null;
  return token.isAdmin === 2 ? true : false;
};

export const logout = () => {
  if (window.localStorage.getItem("auth") != null) {
    window.localStorage.removeItem("auth");
    window.localStorage.clear()
  }
};
