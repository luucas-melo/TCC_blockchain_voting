"use client";

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";

const isOpen = true;

const onClose = () => {};

const Login = () => {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet },
  } = useMetamask();

  const listen = useListen();

  const showConnectButton =
    status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      dispatch({ type: "connect", wallet: accounts[0], balance });

      // we can register an event listener for changes to the users wallet
      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay background="blackAlpha.800" />
      <ModalContent>
        <ModalHeader>Authentication</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="lg">Connect in your metamask wallet to continue</Text>
        </ModalBody>

        <ModalFooter flexDirection="column" justifyContent="center" gap={6}>
          {showConnectButton && (
            <Button
              isLoading={status === "loading"}
              size="lg"
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          )}
          <Text>
            Don&apos;t have Metamask?{" "}
            <Link as={NextLink} href="https://metamask.io/" target="_blank">
              Get Metamask
            </Link>
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Login;
