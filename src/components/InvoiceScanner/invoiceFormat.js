export function parseArgNumber(str) {
  if (!str) return 0;
  return parseFloat(String(str).replace(/\./g, "").replace(",", "."));
}

export function convertDate(ddmmyyyy) {
  if (!ddmmyyyy) return "";
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3) return ddmmyyyy;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
}

export function formatArgCurrency(str) {
  const num = typeof str === "string" ? parseArgNumber(str) : str;
  if (isNaN(num)) return str || "-";
  return `$ ${num.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
}

export function typeBadgeColor(tipo) {
  switch (tipo) {
    case "A":
      return "blue";
    case "B":
      return "green";
    case "C":
      return "purple";
    default:
      return "gray";
  }
}
