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
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";

const onClose = () => {};

const Login = () => {
  const router = useRouter();

  // const onClose = useCallback(() => router.back(), [router]);

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

      router.replace("/");
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  const backgroound = useColorModeValue("blackAlpha.700", "blackAlpha.200");

  return (
    <Modal isCentered isOpen onClose={onClose}>
      <ModalOverlay background={backgroound} backdropFilter="blur(4px)" />
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
          {showConnectButton && (
            <Button
              isLoading={status === "loading"}
              size="lg"
              onClick={handleConnect}
            >
              Connect Wallet
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
