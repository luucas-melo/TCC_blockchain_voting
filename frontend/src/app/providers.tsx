"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { SWRConfig, SWRConfiguration } from "swr";

import { MetamaskProvider } from "@/hooks/useMetamask";
import { logger } from "@/lib/swrLogger";
import { theme } from "@/theme";

const swrConfig: SWRConfiguration = {
  use: [logger],
  // keepPreviousData: true,
  revalidateOnFocus: process.env.NODE_ENV !== "development",
  shouldRetryOnError: process.env.NODE_ENV !== "development",
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MetamaskProvider>
      <SWRConfig value={swrConfig}>
        <CacheProvider>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </CacheProvider>
      </SWRConfig>
    </MetamaskProvider>
  );
}
