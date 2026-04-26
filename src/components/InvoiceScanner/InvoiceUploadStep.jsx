import React from "react";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { MdCloudUpload } from "react-icons/md";

const InvoiceUploadStep = ({
  loading,
  fileName,
  dragOver,
  setDragOver,
  fileInputRef,
  handleFileSelect,
  handleDrop,
  onPickFile,
}) => (
  <Box
    border="3px dashed"
    borderColor={dragOver ? "blue.400" : "gray.300"}
    borderRadius="lg"
    p={10}
    textAlign="center"
    bg={dragOver ? "blue.50" : "gray.50"}
    cursor="pointer"
    transition="all 0.2s"
    onDragOver={(e) => {
      e.preventDefault();
      setDragOver(true);
    }}
    onDragLeave={() => setDragOver(false)}
    onDrop={handleDrop}
    onClick={onPickFile}
  >
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf"
      style={{ display: "none" }}
      onChange={handleFileSelect}
    />
    {loading ? (
      <VStack gap={4}>
        <Spinner size="xl" color="blue.500" />
        <Text fontSize="lg">Procesando {fileName}...</Text>
      </VStack>
    ) : (
      <VStack gap={3}>
        <Box as={MdCloudUpload} size="60px" color="gray.400" />
        <Text fontSize="lg" fontWeight="bold">
          Arrastra un PDF o hace clic para seleccionar
        </Text>
        <Text fontSize="sm" color="gray.500">
          Facturas A, B o C (formato AFIP)
        </Text>
      </VStack>
    )}
  </Box>
);

export default InvoiceUploadStep;
