"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import useSWR from "swr";

import { VotingCard } from "@/components/VotingCard";
import { useMetamask } from "@/hooks/useMetamask";
import { VotingContract, VotingFactoryContract } from "@/lib/contracts";

const Home = () => {
  const {
    state: { wallet },
  } = useMetamask();

  // const [votings, setState] = useState<string[]>([]);

  const votingContractAddresses = useSWR<string[]>(
    [wallet, "votings"],
    async () => {
      const res = await VotingFactoryContract.methods.getVotings().call({
        from: wallet,
      });

      return res;
    }
  );

  console.log("votingContractAddresses:", votingContractAddresses?.data);

  const allDeployedAddresses = useSWR<string[]>(
    [wallet, "allVotings"],
    VotingFactoryContract.methods.getDeployedContracts().call
  );

  const votings = useMemo(() => {
    if (!votingContractAddresses?.data || votingContractAddresses.isLoading)
      return [];

    return votingContractAddresses.data.map(VotingContract);
  }, [votingContractAddresses]);

  const allVotings = useMemo(() => {
    if (!allDeployedAddresses?.data || allDeployedAddresses.isLoading)
      return [];

    return allDeployedAddresses.data.map(VotingContract);
  }, [allDeployedAddresses]);

  console.group("Home");
  console.log("votings ~ votings:", votings);
  console.log("allVotings ~ allVotings:", allVotings);
  console.groupEnd();

  return (
    <VStack align="stretch" gap={8}>
      <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
        <Box>
          <Heading>Minhas Votações</Heading>
          <Text>
            {votings?.length} votaç{votings?.length !== 1 ? "ões" : "ão"}
          </Text>
        </Box>
        <Button as={Link} href="/voting/create" size="lg" boxShadow="2xl">
          <Icon as={FaPlus} mr={2} />
          Votação
        </Button>
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {votings?.map((contract) => (
          <VotingCard contract={contract} key={contract?.options?.address} />
        ))}
      </Grid>

      <Heading size="lg">Todas as votações</Heading>
      <Divider />

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {allVotings?.map((contract) => (
          <VotingCard
            contract={contract}
            key={`${contract?.options?.address}allVotings`}
          />
        ))}
      </Grid>
    </VStack>
  );
};

export default Home;
