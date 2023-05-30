import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const lg = defineStyle({
  fontWeight: "bold",
});

export const buttonTheme = defineStyleConfig({
  sizes: { lg },
});
