import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
// eslint-disable-next-line import/no-extraneous-dependencies -- Peer dependency
import { mode } from "@chakra-ui/theme-tools";

const lg = defineStyle({
  // fontWeight: "bold",
});

const gradient = defineStyle((props) => {
  const { colorScheme, colorMode, theme } = props;

  return {
    backgroundImage: mode(
      `linear-gradient(to right, ${colorScheme}.600 0%, ${colorScheme}.400  51%, ${colorScheme}.600  100%)`,
      // `linear-gradient(to right, ${colorScheme}.500 0%, ${colorScheme}.300  51%, ${colorScheme}.500  100%)`,
      `linear-gradient(to right, ${colorScheme}.200 0%, ${colorScheme}.300  51%, ${colorScheme}.200  100%)`
    )(props),

    color: theme?.components?.Button?.variants?.solid(props)?.color,

    // _dark: {
    //   backgroundImage: `linear-gradient(to right, ${colorScheme}.400 0%, ${colorScheme}.200  51%, ${colorScheme}.400  100%)`,
    // },

    backgroundSize: "200% auto",
    transition: "0.5s",
    filter: "contrast(1.15)", // ???

    "&:hover": {
      backgroundPosition: "right center",
    },
  };
});

export const buttonTheme = defineStyleConfig({
  baseStyle: {
    borderRadius: "100px",
  },
  variants: {
    gradient,
  },
  sizes: { lg },
  defaultProps: {
    // size: "lg",
    variant: "gradient",
  },
});
