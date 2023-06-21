"use client";

import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import Web3 from "web3";

import Login from "./login";

const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    window.web3 = new Web3(window.ethereum);

    return true;
  }

  return false;
};

export default function Web3Layout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  // const {
  //   dispatch,
  //   state: { status, wallet: metamaskWallet },
  // } = useMetamask();

  // const listen = useListen();

  const {
    account,
    isActive,

    isActivating,
    connector: { provider },
  } = useWeb3React();

  useEffect(() => {
    ethEnabled().then((enabled) => console.log("enabled", enabled));
  }, []);

  // useEffect(() => {
  //   if (typeof window !== undefined) {
  //     // start by checking if window.ethereum is present, indicating a wallet extension
  //     const ethereumProviderInjected = typeof window.ethereum !== "undefined";
  //     // this could be other wallets so we can verify if we are dealing with metamask
  //     // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
  //     const isMetamaskInstalled =
  //       ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

  //     const local = window.localStorage.getItem("metamaskState");

  //     // user was previously connected, start listening to MM
  //     if (local) {
  //       listen();
  //     }

  //     ethEnabled().then((enabled) => console.log("enabled", enabled));
  //     // local could be null if not present in LocalStorage
  //     const { wallet, balance } = local
  //       ? JSON.parse(local)
  //       : // backup if local storage is empty
  //         { wallet: null, balance: null };

  //     dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
  //   }
  // }, []);

  // const isConnected =
  //   status !== "pageNotLoaded" && typeof metamaskWallet === "string";

  // console.group("Web3");
  // console.log("isConnected", isConnected);
  // console.log("wallet", metamaskWallet);
  // console.log("status", status);
  // console.groupEnd();

  // if (!isConnected && status !== "pageNotLoaded") {
  //   console.log("redirecting to /login");
  //   redirect("/login");
  // }

  // if (!isActive && !isActivating && !account) {
  //   console.log("redirecting to /login");
  //   redirect("/login");
  // }

  return (
    <>
      {children}
      <Login isOpen={!account} />
      {/* {!isActive ? authModal : null} */}
      {/* {authModal} */}
    </>
  );
}
