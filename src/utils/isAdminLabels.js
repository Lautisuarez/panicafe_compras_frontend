export const normalizeIsAdmin = (value) => {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

/** Short label for tables and compact UI */
export const roleLabelShort = (isAdmin) => {
  switch (normalizeIsAdmin(isAdmin)) {
    case 1:
      return "Admin";
    case 2:
      return "Producción";
    case 3:
      return "Catálogo";
    default:
      return "Usuario";
  }
};

/** Long label for modals and tooltips */
export const roleLabelLong = (isAdmin) => {
  switch (normalizeIsAdmin(isAdmin)) {
    case 1:
      return "Administrador completo";
    case 2:
      return "Usuario de producción";
    case 3:
      return "Administrador de catálogo";
    default:
      return "Usuario (sucursal)";
  }
};

/** Options for <Select> value must match backend numeric isAdmin */
export const ROLE_SELECT_OPTIONS = [
  { value: "0", label: "Usuario (sucursal)" },
  { value: "1", label: "Administrador completo" },
  { value: "2", label: "Usuario de producción" },
  { value: "3", label: "Administrador de catálogo" },
];
