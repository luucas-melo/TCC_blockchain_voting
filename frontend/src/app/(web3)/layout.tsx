"use client";

import { Heading } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";

import { ethEnabled } from "@/lib/web3";

import Login from "./login";

export default function Web3Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const { account } = useWeb3React();

  useEffect(() => {
    ethEnabled().then((enabled) =>
      console.log("web3 provider enabled:", enabled)
    );
  }, []);

  return (
    <>
      {children}
      <Login isOpen={!account} />
      <Heading>(WEB3)(Start)</Heading>
      {modal}
      <Heading>(WEB3)(End)</Heading>
    </>
  );
}
