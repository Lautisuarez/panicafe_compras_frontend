import { extendTheme } from "@chakra-ui/react";

/** WhatsApp brand greens (same scale Chakra v1 shipped; v2 default theme omits this palette). */
const whatsapp = {
  50: "#E2FBE8",
  100: "#C6F6D5",
  200: "#9AE6B4",
  300: "#68D391",
  400: "#48BB78",
  500: "#11bf53",
  600: "#1DA851",
  700: "#128C7E",
  800: "#0E6655",
  900: "#0A463F",
};

export const appTheme = extendTheme({
  colors: {
    whatsapp,
  },
  fonts: {
    heading: "Bitter",
    body: "Bitter",
  },
  styles: {
    global: {
      "html, body": {
        fontSize: "md",
        color: "#3a3937",
        lineHeight: "tall",
      },
    },
  },
});
