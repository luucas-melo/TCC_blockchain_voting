import { MetamaskProvider } from "@/hooks/useMetamask";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <MetamaskProvider>
        <Component {...pageProps} />
      </MetamaskProvider>
    </ChakraProvider>
  );
}
