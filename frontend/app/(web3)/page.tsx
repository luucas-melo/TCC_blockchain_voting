"use client";

import { Button, Flex } from "@chakra-ui/react";
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

  console.log(votings?.[0]);

  return (
    <Flex flexDirection="column" gap={4}>
      <Button as={Link} href="/voting/create">
        Create voting
      </Button>

      {votings?.map((contract) => (
        <VotingCard contract={contract} key={contract?._address} />
      ))}
    </Flex>
  );
};

export default Home;
