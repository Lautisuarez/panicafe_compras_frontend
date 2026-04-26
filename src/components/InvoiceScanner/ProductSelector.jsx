import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import {
  Badge,
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { searchProductos } from "../../api/products";
import { DROPDOWN_Z_INDEX, SEARCH_DEBOUNCE_MS } from "./constants";
import { formatArgCurrency } from "./invoiceFormat";

/** Product picker: match suggestions or manual search (Portal to avoid table clipping). */
const ProductSelector = ({ sugerencias, value, selectedProduct, onChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [panelPos, setPanelPos] = useState({
    top: 0,
    left: 0,
    width: 360,
    maxH: 280,
  });

  const anchorRef = useRef(null);
  const panelRef = useRef(null);

  const displaySelected =
    selectedProduct && selectedProduct.codigo === value
      ? selectedProduct
      : sugerencias.find((p) => p.codigo === value);

  const updatePanelPosition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.max(r.width, 360);
    const spaceBelow = window.innerHeight - r.bottom - 16;
    const spaceAbove = r.top - 16;
    const desiredMax = 280;

    let top = r.bottom + 8;
    let maxH = Math.min(desiredMax, Math.max(100, spaceBelow));

    if (spaceBelow < 140 && spaceAbove > spaceBelow) {
      maxH = Math.min(desiredMax, Math.max(100, spaceAbove));
      top = Math.max(8, r.top - maxH - 8);
    }

    setPanelPos({
      top,
      left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)),
      width,
      maxH,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
    const onScrollOrResize = () => updatePanelPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, updatePanelPosition, search, searchResults, searchLoading]);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e) => {
      if (anchorRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
      setSearch("");
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const data = await searchProductos(q);
        setSearchResults(data);
      } catch (err) {
        setSearchResults([]);
        setSearchError(err.message || "Error al buscar");
      } finally {
        setSearchLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = (producto) => {
    onChange(producto.codigo, producto);
    setSearch("");
    setOpen(false);
    setSearchResults([]);
  };

  const qLen = search.trim().length;
  const showSugerencias = open && qLen < 2;
  const showServerSearch = open && qLen >= 2;

  return (
    <Box ref={anchorRef} minW="280px" w="100%">
      {!open && displaySelected ? (
        <HStack
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          px={3}
          py={2}
          cursor="pointer"
          onClick={() => setOpen(true)}
          bg="white"
          _hover={{ borderColor: "blue.400", boxShadow: "sm" }}
          minH="40px"
          transition="border-color 0.15s, box-shadow 0.15s"
        >
          <Badge fontSize="xs" colorScheme="blue">
            {displaySelected.codigo}
          </Badge>
          <Text fontSize="sm" noOfLines={2} flex={1} textAlign="left">
            {displaySelected.descripcion}
          </Text>
        </HStack>
      ) : (
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none" h="40px">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            h="40px"
            pl="40px"
            placeholder="Buscar en catalogo (min. 2 letras) o elegi una sugerencia abajo"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            autoFocus={open}
            borderRadius="md"
          />
        </InputGroup>
      )}

      {open && (
        <Portal>
          <Box
            ref={panelRef}
            position="fixed"
            zIndex={DROPDOWN_Z_INDEX}
            top={`${panelPos.top}px`}
            left={`${panelPos.left}px`}
            w={`${panelPos.width}px`}
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="xl"
            overflow="hidden"
          >
            <Box maxH={`${panelPos.maxH}px`} overflowY="auto">
              {showSugerencias && (
                <>
                  <Text
                    px={3}
                    pt={3}
                    pb={2}
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Sugerencias segun la factura
                  </Text>
                  {sugerencias.length === 0 ? (
                    <Text px={3} pb={3} fontSize="sm" color="gray.500">
                      No hay coincidencias automaticas. Escribi al menos dos
                      letras en el buscador para buscar en el catalogo.
                    </Text>
                  ) : (
                    sugerencias.map((p) => (
                      <HStack
                        key={`sug-${p.codigo}`}
                        px={3}
                        py={2.5}
                        cursor="pointer"
                        _hover={{ bg: "blue.50" }}
                        bg={p.codigo === value ? "blue.100" : "transparent"}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(p)}
                        gap={3}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                      >
                        <Badge fontSize="xs" colorScheme="blue" flexShrink={0}>
                          {p.codigo}
                        </Badge>
                        <Text fontSize="sm" noOfLines={2} flex={1}>
                          {p.descripcion}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.700"
                          flexShrink={0}
                        >
                          {formatArgCurrency(p.precio)}
                        </Text>
                      </HStack>
                    ))
                  )}
                </>
              )}

              {showServerSearch && (
                <>
                  <Text
                    px={3}
                    pt={3}
                    pb={2}
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.600"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Resultados en catalogo
                  </Text>
                  {searchLoading ? (
                    <Flex justify="center" py={6}>
                      <Spinner size="sm" color="blue.500" />
                    </Flex>
                  ) : searchError ? (
                    <Text px={3} pb={3} fontSize="sm" color="red.500">
                      {searchError}
                    </Text>
                  ) : searchResults.length === 0 ? (
                    <Text px={3} pb={3} fontSize="sm" color="gray.500">
                      No hay resultados para &quot;{search.trim()}&quot;
                    </Text>
                  ) : (
                    searchResults.map((p) => (
                      <HStack
                        key={`sr-${p.codigo}`}
                        px={3}
                        py={2.5}
                        cursor="pointer"
                        _hover={{ bg: "blue.50" }}
                        bg={p.codigo === value ? "blue.100" : "transparent"}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(p)}
                        gap={3}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                      >
                        <Badge
                          fontSize="xs"
                          colorScheme="gray"
                          flexShrink={0}
                        >
                          {p.codigo}
                        </Badge>
                        <Box flex={1} minW={0}>
                          <Text fontSize="sm" noOfLines={2}>
                            {p.descripcion}
                          </Text>
                          {p.rubro ? (
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                              {p.rubro}
                            </Text>
                          ) : null}
                        </Box>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.700"
                          flexShrink={0}
                        >
                          {formatArgCurrency(p.precio)}
                        </Text>
                      </HStack>
                    ))
                  )}
                </>
              )}
            </Box>
          </Box>
        </Portal>
      )}
    </Box>
  );
};

export default ProductSelector;
