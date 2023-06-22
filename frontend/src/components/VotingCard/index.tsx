import {
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Link,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { Route } from "next";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Contract } from "web3-eth-contract";

import { VotingArtifact } from "@/constants/Voting";
import { useVoting } from "@/hooks/useVoting";

import { VotingMenu } from "../VotingMenu";

interface VotingCardProps {
  contract: Contract<typeof VotingArtifact.abi>;
}

export function VotingCard({ contract }: VotingCardProps) {
  const background = useColorModeValue("whiteAlpha.700", "blackAlpha.600");

  const router = useRouter();

  const { data, isLoading, error, startVoting, cancelVoting } =
    useVoting(contract);

  const date = useMemo(() => {
    if (!data?.votingDuration) return "";

    const time = new Date(Number(data.votingDuration) * 1000);

    return time.toLocaleString();
  }, [data]);

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
          alignItems="flex-start"
          justifyContent="space-between"
          pb={0}
        >
          <VStack align="start" spacing={1}>
            <Skeleton isLoaded={!isLoading && !error}>
              <Heading
                as={NextLink}
                href={`/voting/${contract?.options?.address}` as Route}
                size="md"
                textTransform="capitalize"
              >
                {data?.title ?? "Carregando..."}
              </Heading>
            </Skeleton>
            <Skeleton isLoaded={!isLoading && !error}>
              <Badge
                variant={data?.isStarted ? "solid" : "subtle"}
                colorScheme={data?.isOpen ? "green" : "red"}
                fontSize="small"
                cursor="default"
              >
                {data?.isStarted ? "" : "Não iniciada"}
                {data?.isOpen ? "Aberta" : ""}
                {data?.isEnded ? "Fechada" : ""}
                {data?.isCancelled ? "Cancelada" : ""}
              </Badge>
            </Skeleton>
          </VStack>

          <Box transform="translate(6px, -4px)">
            {!isLoading && (
              <VotingMenu
                startVoting={startVoting}
                onEdit={() => router.push(`/${contract.options.address}/edit`)}
                cancelVoting={cancelVoting}
              />
            )}
          </Box>
        </CardHeader>

        <CardBody py={0}>
          <Text fontSize="sm" cursor="default">
            Chapa
          </Text>
          <Divider mb={2} />

          {(isLoading || error) && (
            <Flex justifyContent="space-between">
              <Skeleton isLoaded={!isLoading && !error} w="45%" height="24px" />
              <Skeleton isLoaded={!isLoading && !error} w="45%" height="24px" />
            </Flex>
          )}
          <Skeleton isLoaded={!isLoading && !error}>
            <Flex flexWrap="wrap" gap={4}>
              {data?.proposals?.map?.((proposal) => (
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
          <Skeleton isLoaded={!isLoading && !error} w="75%" height="24px">
            {data?.isStarted ? (
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
