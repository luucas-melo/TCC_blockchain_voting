"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
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
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { MdHowToVote } from "react-icons/md";
import useSWR from "swr";

import { DangerPopup } from "@/components/DangerPopup";
import { VotingMenu } from "@/components/VotingMenu";
import { useVoting } from "@/hooks/useVoting";
import { getContractData, VotingContract } from "@/lib/contracts";

// export async function generateStaticParams() {
//   const web3 = new Web3("http://127.0.0.1:8545");

//   const VotingFactoryContract = new web3.eth.Contract(
//     VotingFactoryArtifact.abi,
//     Object.entries(VotingFactoryArtifact.networks)[0][1].address
//   );

//   const contracts = await VotingFactoryContract.methods
//     .getDeployedContracts()
//     .call();

//   console.log("generateStaticParams ~ contracts:", contracts);

//   return contracts.map((contract) => ({
//     contract,
//   }));
// }

export default function VotingPage({
  params,
}: {
  params: { contract: string };
}) {
  console.log("VotingPage:", params);
  const contract = VotingContract(params.contract);

  // const background = useColorModeValue("whiteAlpha.700", "blackAlpha.600");

  const {
    data,
    isLoading,
    mutate: updateContract,
  } = useSWR(contract?.options?.address, getContractData(contract));

  const { startVoting, vote, cancelVoting } = useVoting(
    contract,
    updateContract
  );

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

      if (data?.[dataKey as DataKeys]?.status === "fulfilled")
        return (data[dataKey as DataKeys] as PromiseFulfilledResult<string[]>)
          .value;

      return null;
    },
    [data]
  );

  if (!contract) return null;

  return (
    <Flex direction="column">
      <Text color="gray.400" fontSize="xs">
        #{contract?.options?.address}
      </Text>
      <Card
        display="grid"
        gridTemplateRows="auto 1fr auto"
        gap={4}
        height="100%"
        // backgroundColor={background}
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
              <Heading size="md" textTransform="capitalize">
                {getPromiseValue("title") ?? "Carregando..."}
              </Heading>
              <Badge
                variant="solid"
                colorScheme={getPromiseValue("isOpen") ? "green" : "red"}
                cursor="default"
              >
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
          <Box marginBottom={16}>
            <Text fontSize="sm" cursor="default">
              Chapa
            </Text>
            <Divider mb={2} />

            {isLoading && (
              <Flex flexWrap="wrap" gap={8}>
                <Skeleton isLoaded={!isLoading} w="200px" height="163px" />
                <Skeleton isLoaded={!isLoading} w="200px" height="163px" />
                <Skeleton isLoaded={!isLoading} w="200px" height="163px" />
              </Flex>
            )}
            <Skeleton isLoaded={!isLoading}>
              <Grid
                templateColumns="repeat(auto-fit, minmax(0, 200px))"
                gap={8}
              >
                {getPromiseValue("proposals")?.map?.((proposal, index) => (
                  <VStack
                    key={proposal}
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius={8}
                    alignItems="center"
                    p={4}
                    spacing={2}
                  >
                    <Avatar name={proposal} />

                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      textTransform="capitalize"
                      height="100%"
                    >
                      {proposal}
                    </Text>
                    <DangerPopup
                      title={`Votar em ${proposal}`}
                      message="Você tem certeza que deseja votar nessa opção?"
                      onConfirm={vote({ proposalIndex: index })}
                    >
                      <Button
                        variant="ghost"
                        leftIcon={<Icon as={MdHowToVote} boxSize="4" />}
                        // w="full"
                        size="md"
                      >
                        Votar
                      </Button>
                    </DangerPopup>
                  </VStack>
                ))}
              </Grid>
            </Skeleton>
          </Box>

          <Box>
            <Text fontSize="sm" cursor="default">
              Eleitores
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
                {getPromiseValue("whiteList")?.map?.((address) => (
                  <Badge
                    fontSize="sm"
                    variant="outline"
                    colorScheme="gray"
                    textTransform="capitalize"
                    key={address}
                  >
                    {address}
                  </Badge>
                ))}
              </Grid>
            </Skeleton>
          </Box>
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
