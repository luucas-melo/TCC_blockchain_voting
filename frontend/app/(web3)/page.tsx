"use client";

import { Button, Flex, Grid, Heading, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useMemo } from "react";
import useSWR from "swr";

import { VotingCard } from "@/components/VotingCard";
import { useMetamask } from "@/hooks/useMetamask";
import { VotingContract, VotingFactoryContract } from "@/lib/contracts";

const Home = () => {
  const {
    state: { wallet },
  } = useMetamask();

  const { data: addresses, isLoading } = useSWR<string[]>(
    [wallet, "votings"],
    VotingFactoryContract.methods.getDeployedContracts().call
  );

  console.log(addresses);

  const votings = useMemo(() => {
    if (!addresses) return [];

    return addresses.map(VotingContract);
  }, [addresses]);

  console.log("votings ~ votings:", votings);

  return (
    <VStack align="stretch" gap={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading>Lorem Ipsum Dolor</Heading>
        <Button as={Link} href="/voting/create" size="lg">
          Criar Votação
        </Button>
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {votings?.map((contract) => (
          <VotingCard contract={contract} key={contract?._address} />
        ))}
      </Grid>
    </VStack>
  );
};

export default Home;
