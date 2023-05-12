import { Theme, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
export const theme = extendTheme(
  {
    shadows: {
      thin: "rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset;",
      soft: "0px 3px 8px rgba(51, 51, 51, 0.2)",
      medium: "5px 5px 20px rgba(0, 0, 0, 0.2)",
      large: "rgba(17,12,46,0.1) 0px 48px 100px 0px",
      hard: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
    },
    fonts: {
      heading: `'Poppins', sans-serif`,
      body: `'Roboto', sans-serif`,
    },
    styles: {
      global: {
        body: {
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          overflowX: "clip",
        },
      },
    },
    config: {
      initialColorMode: "light",
    },
    components: {
      Link: {
        baseStyle: {
          color: "purple.500",
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "purple" })
) as Theme;
