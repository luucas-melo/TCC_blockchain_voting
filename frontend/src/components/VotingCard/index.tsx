import {
  Badge,
  Box,
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
  Skeleton,
  Text,
} from "@chakra-ui/react";
import type { Route } from "next";
import { default as NextLink } from "next/link";
import { useCallback, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import useSWR from "swr";
import { Contract } from "web3-eth-contract";

import { useMetamask } from "@/hooks/useMetamask";

import { ActionButton } from "../ActionButton";

interface VotingCardProps {
  contract: Contract;
}

export function VotingCard({ contract }: VotingCardProps) {
  const {
    dispatch,
    state: { wallet },
  } = useMetamask();

  // const listen = useListen();
  // const web3 = new Web3("ws://localhost:8545");
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

  //     // local could be null if not present in LocalStorage
  //     const { wallet, balance } = local
  //       ? JSON.parse(local)
  //       : // backup if local storage is empty
  //         { wallet: null, balance: null };

  //     dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
  //   }
  // }, []);

  // const [contract, setContract] = useState(null);

  //   let contractAddress = "0x1f49444De78Bd325C2A3C1C4550fF6BBF5FbEEd1"; // hard coded for now

  const add = async () => {
    // if (!wallet) return;
    // const contract = new web3.eth.Contract(VotingAbi, contractAddress);
    // const inputConsts = "0xDf3f47571FD69590dA954777562E8751869c9817"; // hard coded for now
    // const data = contract.methods.addToWhiteList(inputConsts).encodeVotingAbi();
    // console.log("data", data);
    // // Define the gas price and gas limit
    // const gasPrice = await web3.eth.getGasPrice();
    // console.log("gasPrice", gasPrice);
    // console.log("wallet", wallet);
    // const tx = {
    //   from: wallet,
    //   to: contractAddress,
    //   data,
    //   gas: "2000000000",
    //   gasPrice,
    // };
    // const gasLimit = await web3.eth.estimateGas(tx);
    // console.log("gasLimit", gasLimit);
    // tx.gas = (gasLimit * 1.5).toFixed(0);
    // const res = await web3.eth.sendTransaction(tx, (error, transactionHash) => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     console.log(`Transaction hash: ${transactionHash}`);
    //   }
    // });
  };

  const vote = async () => {
    // if (!wallet) return;
    // const contract = new web3.eth.Contract(VotingAbi, contractAddress);
    // const inputConsts = 1;
    // const data = contract.methods.vote(inputConsts).encodeVotingAbi();
    // console.log("data", data);
    // // Define the gas price and gas limit
    // const gasPrice = await web3.eth.getGasPrice();
    // console.log("gasPrice", gasPrice);
    // console.log("wallet", wallet);
    // const tx = {
    //   from: wallet,
    //   to: contractAddress,
    //   data,
    //   gas: "2000000000", // hard coded for now
    //   gasPrice,
    // };
    // const gasLimit = await web3.eth.estimateGas(tx);
    // console.log("gasLimit", gasLimit);
    // tx.gas = (gasLimit * 1.5).toFixed(0);
    // const res = await web3.eth.sendTransaction(tx, (error, transactionHash) => {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     console.log(`Transaction hash: ${transactionHash}`);
    //   }
    // });
  };

  // useEffect(() => {
  //   const c = new web3.eth.Contract(VotingAbi, contractAddress);
  //   setContract(c);
  // }, []);

  const getContractData = async () => {
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

    const isOpenPromise = contract.methods
      .getIsOpen()
      .call() as Promise<boolean>;

    const [title, votingDuration, proposals, isOpen, electionChief] =
      await Promise.allSettled([
        titlePromise,
        votingDurationPromise,
        proposalsPromise,
        isOpenPromise,
        electionChiefPromise,
      ]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("data", title, votingDuration, proposals, isOpen);

    return {
      title,
      votingDuration,
      proposals,
      isOpen,
      electionChief,
    };
  };

  const { data, isLoading } = useSWR([contract, "data"], getContractData);

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
    <Box>
      <Link
        as={NextLink}
        href={`/voting/${contract?.options?.address}`}
        color="gray.400"
        fontSize="xs"
      >
        #{contract?.options?.address}
      </Link>
      <Card
        border="1px solid"
        boxShadow="lg"
        backdropFilter="blur(48px)"
        borderColor={getPromiseValue("isOpen") ? "green.200" : "red.200"}
        gap={4}
      >
        <CardHeader
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={0}
        >
          <Skeleton isLoaded={!isLoading}>
            <Heading
              as={NextLink}
              href={`/voting/${contract?.options?.address}` as Route}
              size="md"
            >
              {getPromiseValue("title") ?? "Carregando..."}
            </Heading>
          </Skeleton>

          <HStack>
            <Skeleton isLoaded={!isLoading}>
              <Badge colorScheme={getPromiseValue("isOpen") ? "green" : "red"}>
                {getPromiseValue("isOpen") ? "Aberta" : "Fechada"}
              </Badge>
            </Skeleton>
            {!isLoading && (
              <Menu>
                <MenuButton
                  as={ActionButton}
                  icon={<Icon as={BsThreeDotsVertical} />}
                  colorScheme="gray"
                />
                <MenuList>
                  <MenuItem>Editar</MenuItem>
                  <MenuItem>Iniciar</MenuItem>
                  <MenuDivider />
                  <MenuItem color="red.400">Cancelar</MenuItem>
                </MenuList>
              </Menu>
            )}
          </HStack>
        </CardHeader>

        <CardBody py={0}>
          <Text fontSize="sm">Chapa</Text>
          <Divider mb={1} />

          {isLoading && (
            <Flex justifyContent="space-between">
              <Skeleton isLoaded={!isLoading} w="45%" height="24px" />
              <Skeleton isLoaded={!isLoading} w="45%" height="24px" />
            </Flex>
          )}
          <Skeleton isLoaded={!isLoading}>
            <Grid templateColumns="1fr 1fr" justifyItems="start" gap={4}>
              {getPromiseValue("proposals")?.map?.((proposal) => (
                <Badge fontSize="md" colorScheme="purple" key={proposal}>
                  {proposal}
                </Badge>
              ))}
            </Grid>
          </Skeleton>
        </CardBody>

        <CardFooter pt={0} flexDirection="column">
          <Text fontSize="sm">Duração</Text>
          <Divider mb={1} />
          <Skeleton isLoaded={!isLoading} w="75%" height="24px">
            <Text fontWeight="medium">{date ?? "Loading..."}</Text>
          </Skeleton>
        </CardFooter>
      </Card>
    </Box>
  );
}
