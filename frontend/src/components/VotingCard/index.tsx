import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { Route } from "next";
import NextLink from "next/link";
import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { Contract } from "web3-eth-contract";

import { VotingArtifact } from "@/constants/Voting";
import { useVoting } from "@/hooks/useVoting";
import { getContractData } from "@/lib/contracts";

import { VotingMenu } from "../VotingMenu";

interface VotingCardProps {
  contract: Contract<typeof VotingArtifact.abi>;
}

export function VotingCard({ contract }: VotingCardProps) {
  const background = useColorModeValue("whiteAlpha.700", "blackAlpha.600");

  const {
    data,
    isLoading,
    mutate: updateContract,
  } = useSWR(contract?.options?.address, getContractData(contract));

  const { startVoting, cancelVoting } = useVoting(contract, updateContract);

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

  // console.log("VotingCard ~ getPromiseValue:", getPromiseValue("title"));

  return (
    <Flex direction="column">
      <Link
        // as={NextLink}
        // href={`/voting/${contract?.options?.address}` as Route}
        href={`https://sepolia.etherscan.io/address/${contract?.options?.address}`}
        target="_blank"
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
                textTransform="capitalize"
              >
                {getPromiseValue("title") ?? "Carregando..."}
              </Heading>
              <Badge
                variant="solid"
                colorScheme={getPromiseValue("isOpen") ? "green" : "red"}
                cursor="default"
              >
                {getPromiseValue("isStarted") ? "" : "Não iniciada"}
                {getPromiseValue("isOpen") ? "Aberta" : ""}
                {getPromiseValue("isEnded") ? "Fechada" : ""}
                {getPromiseValue("isCancelled") ? "Cancelada" : ""}
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
              <VotingMenu
                startVoting={startVoting}
                cancelVoting={cancelVoting}
              />
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
            <Flex flexWrap="wrap" gap={4}>
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
            </Flex>
          </Skeleton>
        </CardBody>

        <CardFooter pt={0} flexDirection="column">
          <Text fontSize="sm" cursor="default">
            Duração
          </Text>
          <Divider mb={1} />
          <Skeleton isLoaded={!isLoading} w="75%" height="24px">
            {getPromiseValue("isStarted") ? (
              <Text fontWeight="medium">{date ?? "Loading..."}</Text>
            ) : (
              <Text fontWeight="medium">Não iniciada</Text>
            )}
          </Skeleton>
        </CardFooter>
      </Card>
    </Flex>
  );
}
