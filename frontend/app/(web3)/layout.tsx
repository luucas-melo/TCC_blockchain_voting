"use client";
import Wallet from "@/components/Wallet";
import { useListen } from "@/hooks/useListen";
import { VotingAbi } from "@/constants/VotingAbi";
import { useMetamask } from "@/hooks/useMetamask";
import { Button } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { web3 } from "@/lib/web3";

const inter = Inter({ subsets: ["latin"] });

export default function Web3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    dispatch,
    state: { isMetamaskInstalled, status, wallet },
  } = useMetamask();

  const listen = useListen();
  useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";
      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      // user was previously connected, start listening to MM
      if (local) {
        listen();
      }

      // local could be null if not present in LocalStorage
      const { wallet, balance } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null };

      dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
    }
  }, []);

  return <>{children}</>;
}
