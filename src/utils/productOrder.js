/**
 * Whether the user may add this article to the order (GET /productos may include
 * permitePedidoCompras or PERMITEPEDIDOCOMPRAS from SQL Server).
 */
export function productAllowsPedidoCompras(prod) {
  if (!prod) return false;
  const raw =
    prod.permitePedidoCompras ??
    prod.PERMITEPEDIDOCOMPRAS ??
    prod.permitepedidocompras;
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "number") return raw === 1;
  if (typeof raw === "string") {
    const s = raw.trim().toLowerCase();
    return s === "1" || s === "true" || s === "si";
  }
  return false;
}
