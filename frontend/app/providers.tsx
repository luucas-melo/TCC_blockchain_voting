// app/providers.tsx

"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

import { MetamaskProvider } from "@/hooks/useMetamask";

import { theme } from "../src/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MetamaskProvider>
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </MetamaskProvider>
  );
}
