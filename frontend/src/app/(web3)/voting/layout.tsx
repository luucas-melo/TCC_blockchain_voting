"use client";

import { Heading } from "@chakra-ui/react";

export default function Web3Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Heading color="red">VOTING LAYOUT</Heading>
      {modal}
    </>
  );
}
