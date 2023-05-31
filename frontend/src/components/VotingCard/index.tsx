import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Skeleton,
  Text,
  ToastId,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import type { Route } from "next";
import { default as NextLink } from "next/link";
import { useCallback, useMemo, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import useSWR, { mutate } from "swr";
import { Contract } from "web3-eth-contract";

import { useMetamask } from "@/hooks/useMetamask";

import { ActionButton } from "../ActionButton";

interface VotingCardProps {
  contract: Contract;
}

const getContractData = (contract: Contract) => async () => {
  console.log("contract", contract);

  const electionChiefPromise = contract.methods
    .electionCommission()
    .call() as Promise<string>;
  const titlePromise = contract.methods.title().call() as Promise<string>;
  const votingDurationPromise = contract.methods
    .votingDuration()
    .call() as Promise<string>;
  const proposalsPromise = contract.methods.getProposals().call() as Promise<
    string[]
  >;

  const isOpenPromise = contract.methods.getIsOpen().call() as Promise<boolean>;

  const [title, votingDuration, proposals, isOpen, electionChief] =
    await Promise.allSettled([
      titlePromise,
      votingDurationPromise,
      proposalsPromise,
      isOpenPromise,
      electionChiefPromise,
    ]);

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("data", title, votingDuration, proposals, isOpen);

  return {
    title,
    votingDuration,
    proposals,
    isOpen,
    electionChief,
  };
};

export function VotingCard({ contract }: VotingCardProps) {
  const {
    state: { wallet },
  } = useMetamask();

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const background = useColorModeValue("whiteAlpha.700", "blackAlpha.600");

  const {
    data,
    isLoading,
    mutate: updateContract,
  } = useSWR(contract?.options?.address, getContractData(contract));

  const start = useCallback(async () => {
    toastIdRef.current = toast({
      status: "info",
      title: "Iniciando votação",
      description: "Aguarde a confirmação da transação",
    });

    const gasLimit = await contract.methods.startVoting().estimateGas({
      from: wallet,
    });

    const response = await contract.methods
      .startVoting()
      .send({ from: wallet, gas: (gasLimit * 1.5).toFixed(0) })
      .on("error", (error, receipt) => {
        console.error("error TESTE:", error);
        console.log("receipt", receipt);

        if (toastIdRef.current)
          toast.update(toastIdRef.current, {
            status: "error",
            title: "Erro ao inicar votação",
            description: error?.message?.split(":")?.[2]?.replace("revert", ""),
          });
      })
      .on("transactionHash", (transactionHash) => {
        console.log(`Transaction hash: ${transactionHash}`);
        updateContract();
        if (toastIdRef.current)
          toast.update(toastIdRef.current, {
            status: "success",
            title: "Votação iniciada!",
            description: `#${transactionHash}`,
          });
      })
      .on("receipt", (receipt) => {
        console.log("receipt", receipt);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("confirmation", confirmationNumber, receipt);
      });

    console.log("response", response);
  }, [contract, mutate, toast, wallet]);

  console.log("VotingCard ~ data:", data);

  const date = useMemo(() => {
    if (!data?.votingDuration || data?.votingDuration?.status === "rejected")
      return "";

    const time = new Date(Number(data.votingDuration.value) * 1000);

    return time.toLocaleString();
  }, [data]);

  const getPromiseValue = useCallback(
    (dataKey: string) => {
      if (!data) return undefined;

      type DataKeys = keyof typeof data;

      if (data[dataKey as DataKeys].status === "fulfilled")
        return (data[dataKey as DataKeys] as PromiseFulfilledResult<string[]>)
          .value;

      return null;
    },
    [data]
  );

  console.log("VotingCard ~ getPromiseValue:", getPromiseValue("title"));

  return (
    <Flex direction="column">
      <Link
        as={NextLink}
        href={`/voting/${contract?.options?.address}`}
        color="gray.400"
        fontSize="xs"
      >
        #{contract?.options?.address}
      </Link>
      <Card
        display="grid"
        gridTemplateRows="auto 1fr auto"
        gap={4}
        height="100%"
        backgroundColor={background}
        backdropFilter="blur(4px)"
        boxShadow="lg"
      >
        <CardHeader
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={0}
        >
          <Skeleton isLoaded={!isLoading}>
            <VStack align="start" spacing={1}>
              <Heading
                as={NextLink}
                href={`/voting/${contract?.options?.address}` as Route}
                size="md"
              >
                {getPromiseValue("title") ?? "Carregando..."}
              </Heading>
              <Badge
                variant="solid"
                colorScheme={getPromiseValue("isOpen") ? "green" : "red"}
                cursor="default"
              >
                {getPromiseValue("isOpen") ? "Aberta" : "Fechada"}
              </Badge>
            </VStack>
          </Skeleton>

          <HStack transform="translateX(4px)">
            {/* <Skeleton isLoaded={!isLoading}>
              <Badge colorScheme={getPromiseValue("isOpen") ? "green" : "red"}>
                {getPromiseValue("isOpen") ? "Aberta" : "Fechada"}
              </Badge>
            </Skeleton> */}
            {!isLoading && (
              <Menu>
                <MenuButton
                  as={ActionButton}
                  icon={<Icon as={BsThreeDotsVertical} />}
                  colorScheme="gray"
                />
                <Portal>
                  <MenuList>
                    <MenuItem>Editar</MenuItem>
                    <MenuItem onClick={start}>Iniciar</MenuItem>
                    <MenuDivider />
                    <MenuItem color="red.400">Cancelar</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            )}
          </HStack>
        </CardHeader>

        <CardBody py={0}>
          <Text fontSize="sm" cursor="default">
            Chapa
          </Text>
          <Divider mb={2} />

          {isLoading && (
            <Flex justifyContent="space-between">
              <Skeleton isLoaded={!isLoading} w="45%" height="24px" />
              <Skeleton isLoaded={!isLoading} w="45%" height="24px" />
            </Flex>
          )}
          <Skeleton isLoaded={!isLoading}>
            <Grid templateColumns="1fr 1fr" justifyItems="start" gap={2}>
              {getPromiseValue("proposals")?.map?.((proposal) => (
                <Badge
                  fontSize="md"
                  variant="outline"
                  colorScheme="gray"
                  textTransform="capitalize"
                  key={proposal}
                >
                  {proposal}
                </Badge>
              ))}
            </Grid>
          </Skeleton>
        </CardBody>

        <CardFooter pt={0} flexDirection="column">
          <Text fontSize="sm" cursor="default">
            Duração
          </Text>
          <Divider mb={1} />
          <Skeleton isLoaded={!isLoading} w="75%" height="24px">
            <Text fontWeight="medium">{date ?? "Loading..."}</Text>
          </Skeleton>
        </CardFooter>
      </Card>
    </Flex>
  );
}
