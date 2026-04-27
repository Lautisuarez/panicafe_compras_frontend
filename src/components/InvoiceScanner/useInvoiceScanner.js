import { useState, useRef, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { logout } from "../../protected/AuthService";
import { parseInvoicePdf, matchInvoiceItems, saveStock } from "../../api/invoices";
import { EMPTY_ITEM } from "./constants";
import {
  buildMatchPayloadItems,
  initialSelectionsFromMatch,
  initialSelectionProductsFromMatch,
  buildSaveStockPayload,
} from "./matchHelpers";

export function useInvoiceScanner() {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState("upload");

  const [matchData, setMatchData] = useState(null);
  const [selections, setSelections] = useState([]);
  const [selectionProducts, setSelectionProducts] = useState([]);

  const fileInputRef = useRef(null);
  const toast = useToast();

  const logoutHandler = () => {
    logout();
    setRedirect(true);
  };

  const updateField = (section, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoice((prev) => {
      const items = [...(prev.items || [])];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...(prev.items || []), { ...EMPTY_ITEM }],
    }));
  };

  const removeItem = (index) => {
    setInvoice((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  const processFile = useCallback(
    async (file) => {
      if (!file || file.type !== "application/pdf") {
        toast({
          title: "Archivo invalido",
          description: "Solo se aceptan archivos PDF.",
          status: "error",
          duration: 4000,
        });
        return;
      }

      setFileName(file.name);
      setLoading(true);
      setMatchData(null);
      setSelections([]);
      setSelectionProducts([]);

      try {
        const data = await parseInvoicePdf(file);
        setInvoice(data);
        setStep("edit");
        toast({
          title: "PDF procesado",
          description:
            "Revisa y corrige los datos si hace falta, luego continua con la asignacion de productos.",
          status: "success",
          duration: 4000,
        });
      } catch (err) {
        toast({
          title: "Error al procesar",
          description: err.message,
          status: "error",
          duration: 5000,
        });
        setInvoice(null);
        setStep("upload");
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const goToMatchStep = async () => {
    if (!invoice || !(invoice.items || []).length) {
      toast({
        title: "Sin items",
        description: "Agrega al menos un item de factura antes de continuar.",
        status: "warning",
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const matchResult = await matchInvoiceItems(
        buildMatchPayloadItems(invoice)
      );
      setMatchData(matchResult);
      const n = invoice.items.length;
      setSelections(initialSelectionsFromMatch(matchResult, n));
      setSelectionProducts(initialSelectionProductsFromMatch(matchResult, n));
      setStep("match");
      toast({
        title: "Productos cargados",
        description:
          "Asigna o corrige cada producto y confirma el ingreso de stock.",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Error al buscar productos",
        description: err.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const updateProductSelection = (index, codigo, producto) => {
    setSelections((prev) => {
      const next = [...prev];
      next[index] = codigo;
      return next;
    });
    setSelectionProducts((prev) => {
      const next = [...prev];
      next[index] = producto;
      return next;
    });
  };

  const handleConfirmStock = async () => {
    const unmatched = selections.findIndex((s) => s == null);
    if (unmatched !== -1) {
      toast({
        title: "Items sin producto asignado",
        description: `El item ${unmatched + 1} no tiene un producto seleccionado.`,
        status: "warning",
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = buildSaveStockPayload(invoice, selections);
      const result = await saveStock(payload);
      toast({
        title: "Stock registrado",
        description:
          result.mensaje ||
          "El ingreso de stock fue registrado correctamente.",
        status: "success",
        duration: 5000,
      });
      resetScanner();
    } catch (err) {
      toast({
        title: "Error al registrar stock",
        description: err.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setInvoice(null);
    setFileName("");
    setStep("upload");
    setMatchData(null);
    setSelections([]);
    setSelectionProducts([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const items = invoice?.items || [];
  const itemCount = items.length;
  const allProductsAssigned =
    !!invoice &&
    itemCount > 0 &&
    selections.length >= itemCount &&
    items.every((_, idx) => selections[idx] != null);

  return {
    redirect,
    loading,
    invoice,
    fileName,
    dragOver,
    setDragOver,
    step,
    setStep,
    matchData,
    selections,
    selectionProducts,
    fileInputRef,
    allProductsAssigned,
    logoutHandler,
    updateField,
    updateItem,
    addItem,
    removeItem,
    processFile,
    goToMatchStep,
    handleFileSelect,
    handleDrop,
    updateProductSelection,
    handleConfirmStock,
    resetScanner,
  };
}
