import { convertDate, parseArgNumber } from "./invoiceFormat";

/** IVA importe de línea: preferimos subtot c/IVA − subtotal; si faltan, neto × alícuota. */
export function parseLineIva(item) {
  if (!item) return 0;
  const st = parseArgNumber(item.subtotal);
  const conIva = parseArgNumber(item.subtotalConIva);
  if (conIva > 0 && st >= 0 && conIva >= st) {
    return Math.max(0, conIva - st);
  }
  const m = String(item.alicuotaIva || "").match(/(\d+(?:[.,]\d+)?)\s*%?/);
  if (!m) {
    return st > 0 ? Math.round((st * 0.21 + Number.EPSILON) * 10000) / 10000 : 0;
  }
  const rate = parseArgNumber(m[1].replace(",", "."));
  if (st > 0 && rate > 0) {
    return Math.round((st * (rate / 100) + Number.EPSILON) * 10000) / 10000;
  }
  return 0;
}

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

export function buildSaveStockPayload(invoice, selections, { idlocal }) {
  const idlocalNum = Number(idlocal);
  if (!Number.isFinite(idlocalNum)) {
    throw new Error("idlocal invalido");
  }
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
    idlocal: idlocalNum,
    iddeposito: 1,
    items: (invoice.items || []).map((item, idx) => ({
      articuloCodigo: selections[idx],
      cantidad: parseArgNumber(item.cantidad),
      precio: parseArgNumber(item.precioUnitario),
      iva: parseLineIva(item),
    })),
  };
}
