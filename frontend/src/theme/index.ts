import { extendTheme, Theme, withDefaultColorScheme } from "@chakra-ui/react";

import { buttonTheme } from "./components/button";
import { Form } from "./components/form";
import { colors } from "./foundations/colors";
import { fonts } from "./foundations/fonts";
import { styles } from "./styles";

/**
 * Run 'yarn theme' to generate types, or 'yarn theme:watch' to generate types
 * on file change. This is required for the custom theme keys to work with
 * TypeScript. See https://chakra-ui.com/docs/styled-system/cli
 *
 * If using VSCode, you may also need to restart the TS server after running the
 * command.
 */

const overrides: Partial<Theme> = {
  fonts,
  colors,
  styles,
  components: {
    Form,
    Button: buttonTheme,
  } as Theme["components"],
  config: {
    initialColorMode: "light",
  },
};

export const theme = extendTheme(
  overrides,
  withDefaultColorScheme({ colorScheme: "cyan" })
  // withDefaultSize(),
  // withDefaultVariant(),
  // withDefaultProps()
);
