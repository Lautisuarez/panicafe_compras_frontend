import React from "react";
import { Button, Container, HStack, Spacer } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import HeaderModel from "../HeaderModel";
import { useInvoiceScanner } from "./useInvoiceScanner";
import InvoiceUploadStep from "./InvoiceUploadStep";
import InvoiceEditStep from "./InvoiceEditStep";
import InvoiceMatchStep from "./InvoiceMatchStep";

const InvoiceScanner = () => {
  const s = useInvoiceScanner();

  if (s.redirect) return <Navigate to="/" replace />;

  return (
    <Container maxW="container.xl" paddingLeft="200px" py={6}>
      <HStack mb={4}>
        <HeaderModel text="Escaner de Facturas" />
        <Spacer />
        <Button onClick={s.logoutHandler}>Desconectarse</Button>
      </HStack>

      {s.step === "upload" && (
        <InvoiceUploadStep
          loading={s.loading}
          fileName={s.fileName}
          dragOver={s.dragOver}
          setDragOver={s.setDragOver}
          fileInputRef={s.fileInputRef}
          handleFileSelect={s.handleFileSelect}
          handleDrop={s.handleDrop}
          onPickFile={() => s.fileInputRef.current?.click()}
        />
      )}

      {s.step === "edit" && s.invoice && (
        <InvoiceEditStep
          invoice={s.invoice}
          fileName={s.fileName}
          loading={s.loading}
          updateField={s.updateField}
          updateItem={s.updateItem}
          addItem={s.addItem}
          removeItem={s.removeItem}
          goToMatchStep={s.goToMatchStep}
          resetScanner={s.resetScanner}
        />
      )}

      {s.step === "match" && s.invoice && s.matchData && (
        <InvoiceMatchStep
          invoice={s.invoice}
          fileName={s.fileName}
          matchData={s.matchData}
          selections={s.selections}
          selectionProducts={s.selectionProducts}
          loading={s.loading}
          allProductsAssigned={s.allProductsAssigned}
          setStep={s.setStep}
          resetScanner={s.resetScanner}
          updateProductSelection={s.updateProductSelection}
          handleConfirmStock={s.handleConfirmStock}
        />
      )}
    </Container>
  );
};

export default InvoiceScanner;
