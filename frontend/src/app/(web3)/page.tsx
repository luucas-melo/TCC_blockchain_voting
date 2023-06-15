"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Skeleton,
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

export function Home() {
  const {
    state: { wallet },
  } = useMetamask();

  const votingContractAddresses = useSWR<string[]>(
    [wallet, "votings"],
    async () => {
      const res = await VotingFactoryContract.methods.getVotings().call({
        from: wallet as string,
      });

      return res;
    }
  );

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

  return (
    <VStack align="stretch" gap={8}>
      <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
        <Flex direction="column" alignItems="baseline">
          <Heading>Minhas Votações</Heading>
          <Skeleton isLoaded={!votingContractAddresses?.isLoading}>
            <Text w="fit-content">
              Elegível em {votings?.length} votaç
              {votings?.length !== 1 ? "ões" : "ão"}
            </Text>
          </Skeleton>
        </Flex>
        <Button as={Link} href="/voting/create" size="lg" boxShadow="2xl">
          <Icon as={FaPlus} mr={2} />
          Votação
        </Button>
      </Flex>

      {!votingContractAddresses?.isLoading && !votings?.length && (
        <VStack spacing={8} textAlign="center">
          <Heading size="lg" maxWidth="33ch">
            Você ainda não é um eleitor elegível para nenhuma votação.
          </Heading>
          <Text maxW="43ch">
            Você pode criar uma votação e convidar outros eleitores para
            participar. Ou você pode pedir para ser convidado para uma votação.
          </Text>
          <Button as={Link} href="/voting/create" size="lg" boxShadow="2xl">
            <Icon as={FaPlus} mr={2} />
            Iniciar votação
          </Button>
        </VStack>
      )}

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {votingContractAddresses?.isLoading && (
          <>
            <Skeleton w="330px" h="240px" />
            <Skeleton w="330px" h="240px" />
            <Skeleton w="330px" h="240px" />
          </>
        )}

        {votings?.map((contract) => (
          <VotingCard contract={contract} key={contract?.options?.address} />
        ))}
      </Grid>

      <Box>
        <Heading size="lg">Todas as votações</Heading>
        <Divider mb={6} />

        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {allDeployedAddresses?.isLoading && (
            <>
              <Skeleton w="330px" h="240px" />
              <Skeleton w="330px" h="240px" />
              <Skeleton w="330px" h="240px" />
            </>
          )}

          {!allDeployedAddresses?.isLoading && !allVotings?.length && (
            <VStack spacing={8}>
              <Heading>
                Você ainda não criou nenhuma votação. Crie uma agora!
              </Heading>
              <Button as={Link} href="/voting/create" size="lg" boxShadow="2xl">
                <Icon as={FaPlus} mr={2} />
                Votação
              </Button>
            </VStack>
          )}

          {allVotings?.map((contract) => (
            <VotingCard
              contract={contract}
              key={`${contract?.options?.address}allVotings`}
            />
          ))}
        </Grid>
      </Box>
    </VStack>
  );
}

export default Home;
