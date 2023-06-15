"use client";

import { useEffect } from "react";

import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";

export default function Web3Layout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  const {
    dispatch,
    state: { status, wallet: metamaskWallet },
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

  const isConnected =
    status !== "pageNotLoaded" && typeof metamaskWallet === "string";

  console.group("Web3");
  console.log("isConnected", isConnected);
  console.log("wallet", metamaskWallet);
  console.log("status", status);
  console.groupEnd();

  // if (!isConnected && status !== "pageNotLoaded") {
  //   console.log("redirecting to /login");
  //   redirect("/login");
  // }

  return (
    <>
      {children}
      {!isConnected ? authModal : null}
    </>
  );
}
