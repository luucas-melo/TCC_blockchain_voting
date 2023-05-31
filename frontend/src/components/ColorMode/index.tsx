"use client";

import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";

interface ColorModeProps extends Omit<IconButtonProps, "aria-label"> {}

export function ColorMode(props: ColorModeProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="color-mode"
      onClick={toggleColorMode}
      variant={colorMode === "light" ? "solid" : "outline"}
      // colorScheme={colorMode === "light" ? "gray" : "cyan"}
      {...props}
    >
      {colorMode === "light" ? <BsFillMoonFill /> : <BsFillSunFill />}
    </IconButton>
  );
}
