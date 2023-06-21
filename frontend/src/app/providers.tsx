"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { SWRConfig, SWRConfiguration } from "swr";

import { hooks, metaMask } from "@/connectors/MetamaskConnector";
import { logger } from "@/lib/swrLogger";
import { theme } from "@/theme";

const swrConfig: SWRConfiguration = {
  use: [logger],
  // keepPreviousData: true,
  revalidateOnFocus: process.env.NODE_ENV !== "development",
  shouldRetryOnError: process.env.NODE_ENV !== "development",
};

const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, hooks]];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3ReactProvider connectors={connectors}>
      <SWRConfig value={swrConfig}>
        <CacheProvider>
          <ChakraProvider
            theme={theme}
            toastOptions={{
              defaultOptions: { position: "top", isClosable: true },
            }}
          >
            {children}
          </ChakraProvider>
        </CacheProvider>
      </SWRConfig>
    </Web3ReactProvider>
  );
}
