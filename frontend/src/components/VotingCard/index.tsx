import {
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Grid,
  Heading,
  Icon,
  IconButton,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { SiStackedit } from "react-icons/si";
import useSWR from "swr";
import { Contract } from "web3-eth-contract";

import { useMetamask } from "@/hooks/useMetamask";

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
    const titlePromise = contract.methods.title().call() as Promise<string>;
    const votingDurationPromise = contract.methods
      .votingDuration()
      .call() as Promise<string>;
    const proposalsPromise = contract.methods.getProposals().call() as Promise<
      string[]
    >;

    const [title, votingDuration, proposals] = await Promise.allSettled([
      titlePromise,
      votingDurationPromise,
      proposalsPromise,
    ]);

    console.log("data", title, votingDuration, proposals);

    return {
      title,
      votingDuration,
      proposals,
    };
  };

  const { data, isLoading } = useSWR([contract, "data"], getContractData);

  // console.log("VotingCard ~ data:", data);

  const date = useMemo(() => {
    if (!data?.votingDuration || data?.votingDuration?.status === "rejected")
      return "";

    const time = new Date(Number(data.votingDuration.value) * 1000);

    return time.toLocaleString();
  }, [data]);

  return (
    <Box>
      <Text color="gray.600" fontSize="xs">
        #{contract?._address}
      </Text>
      <Card
        border="1px solid"
        boxShadow="lg"
        backgroundColor="whiteAlpha.500"
        backdropFilter="blur(48px)"
        gap={4}
      >
        <CardHeader
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={0}
        >
          <Skeleton isLoaded={!isLoading}>
            <Heading size="md">
              {data?.title?.status === "fulfilled" && data?.title?.value}
            </Heading>
          </Skeleton>

          <IconButton
            aria-label="edit"
            icon={<Icon as={SiStackedit} boxSize={6} />}
            size="sm"
            variant="ghost"
            colorScheme="pink"
          />
        </CardHeader>

        <CardBody py={0}>
          <Skeleton isLoaded={!isLoading}>
            <Text color="gray.500" fontSize="sm">
              Chapa
            </Text>
            <Divider mb={1} />
            <Grid templateColumns="1fr 1fr" justifyItems="start" gap={4}>
              {data?.proposals?.status === "fulfilled"
                ? data?.proposals?.value.map((proposal) => (
                    <Badge fontSize="md" colorScheme="purple" key={proposal}>
                      {proposal}
                    </Badge>
                  ))
                : null}
            </Grid>
          </Skeleton>
        </CardBody>

        <CardFooter pt={0}>
          <Skeleton isLoaded={!isLoading} w="100%">
            <Text color="gray.500" fontSize="sm">
              Duração
            </Text>
            <Divider mb={1} />
            <Text fontWeight="medium">{date}</Text>
          </Skeleton>
        </CardFooter>
      </Card>
    </Box>
  );
}
