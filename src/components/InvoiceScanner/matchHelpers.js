import { convertDate, parseArgNumber } from "./invoiceFormat";

export function buildMatchPayloadItems(inv) {
  return (inv.items || []).map((it) => ({
    producto: it.producto,
    cantidad: it.cantidad,
    precioUnitario: it.precioUnitario,
  }));
}

export function initialSelectionsFromMatch(matchResult, itemCount) {
  return Array.from({ length: itemCount }, (_, idx) => {
    const match = (matchResult.matches || []).find((m) => m.itemIndex === idx);
    if (match && match.sugerencias && match.sugerencias.length > 0) {
      return match.sugerencias[0].codigo;
    }
    return null;
  });
}

export function initialSelectionProductsFromMatch(matchResult, itemCount) {
  return Array.from({ length: itemCount }, (_, idx) => {
    const match = (matchResult.matches || []).find((m) => m.itemIndex === idx);
    return match?.sugerencias?.[0] ?? null;
  });
}

export function buildSaveStockPayload(invoice, selections) {
  return {
    comprobante: {
      tipo: invoice.comprobante?.tipo || "A",
      prefijo: invoice.comprobante?.puntoVenta || "00001",
      numero: invoice.comprobante?.numero || "00000000",
      fecha: convertDate(invoice.comprobante?.fechaEmision),
      total: parseArgNumber(invoice.totales?.total),
      bonificacion: 0,
    },
    totales: {
      total: parseArgNumber(invoice.totales?.total),
      netoGravado: parseArgNumber(invoice.totales?.netoGravado),
      iva21: parseArgNumber(invoice.totales?.iva21),
    },
    idproveedor: 0,
    idlocal: 1,
    iddeposito: 1,
    items: (invoice.items || []).map((item, idx) => ({
      articuloCodigo: selections[idx],
      cantidad: parseArgNumber(item.cantidad),
      precio: parseArgNumber(item.precioUnitario),
    })),
  };
}
