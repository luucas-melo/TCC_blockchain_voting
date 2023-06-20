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
  useColorModeValue,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { metaMask } from "@/connectors/MetamaskConnector";

const onClose = () => {};

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  const { account, isActive, isActivating } = useWeb3React();

  console.log("account", account);
  // const onClose = useCallback(() => router.back(), [router]);

  const connect = useCallback(async () => {
    try {
      console.log("ANTES");
      await metaMask.activate();
      console.log("DEPOIS");
    } catch (e) {
      console.log("error", e);
    }
  }, []);
  // const {
  //   dispatch,
  //   state: { status, isMetamaskInstalled, wallet },
  // } = useMetamask();

  // const listen = useListen();

  // const showConnectButton =
  //   status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  // const handleConnect = async () => {
  //   dispatch({ type: "loading" });
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });

  //   if (accounts.length > 0) {
  //     const balance = await window.ethereum!.request({
  //       method: "eth_getBalance",
  //       params: [accounts[0], "latest"],
  //     });
  //     dispatch({ type: "connect", wallet: accounts[0], balance });

  //     // we can register an event listener for changes to the users wallet
  //     listen();

  //     router.replace("/");
  //   }
  // };

  // const handleDisconnect = () => {
  //   dispatch({ type: "disconnect" });
  // };

  const background = useColorModeValue("blackAlpha.700", "blackAlpha.200");

  return (
    <Modal isCentered isOpen onClose={onClose}>
      <ModalOverlay background={background} backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>Autenticação</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={6}
        >
          <Text fontSize="lg">
            Acesse a sua carteira Metamask para continuar
          </Text>
          {!isActive && (
            <Button isLoading={isActivating} size="lg" onClick={connect}>
              Conectar carteira
            </Button>
          )}
        </ModalBody>

        <ModalFooter justifyContent="center" gap={1}>
          <Text fontWeight="light" color="gray.600" as="span">
            Não possui uma carteira Metamask?
          </Text>
          <Link as={NextLink} href="https://metamask.io/" target="_blank">
            Obter
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Login;
