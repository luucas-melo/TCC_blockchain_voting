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
  Link,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { MdHowToVote } from "react-icons/md";

import { DangerPopup } from "@/components/DangerPopup";
import { VotingMenu } from "@/components/VotingMenu";
import { useVoting } from "@/hooks/useVoting";
import { VotingContract, VotingFactoryContract } from "@/lib/contracts";

export async function generateStaticParams() {
  // const web3 = new Web3("http://127.0.0.1:8545");

  // const VotingFactoryContract = new web3.eth.Contract(
  //   VotingFactoryArtifact.abi,
  //   Object.entries(VotingFactoryArtifact.networks)[0][1].address
  // );

  const contracts = await VotingFactoryContract.methods
    .getDeployedContracts()
    .call();

  console.log("generateStaticParams ~ contracts:", contracts);

  return contracts.map((contract) => ({
    contract,
  }));
}

export default function VotingPage({
  params,
}: {
  params: { contract: string };
}) {
  const router = useRouter();

  const contract = VotingContract(params.contract);

  // const background = useColorModeValue("whiteAlpha.700", "blackAlpha.600");

  // const {
  //   data,
  //   isLoading,
  //   mutate: updateContract,
  // } = useSWR(contract?.options?.address, getContractData(contract));

  const { data, isLoading, error, startVoting, vote, cancelVoting } = useVoting(
    contract
    // updateContract
  );

  const date = useMemo(() => {
    if (!data?.votingDuration) return "";

    const time = new Date(Number(data.votingDuration) * 1000);

    return time.toLocaleString();
  }, [data]);

  if (!contract) return null;

  return (
    <Flex direction="column">
      {/* <Text color="gray.400" fontSize="xs">
        #{contract?.options?.address}
      </Text> */}
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
          <VStack align="start" spacing={1}>
            <Skeleton isLoaded={!isLoading && !error}>
              <Heading size="md" textTransform="capitalize">
                {data?.title ?? "Carregando..."}
              </Heading>
            </Skeleton>
            <Skeleton isLoaded={!isLoading && !error}>
              <Badge
                variant="solid"
                colorScheme={data?.isOpen ? "green" : "red"}
                cursor="default"
                fontSize="sm"
              >
                {data?.isStarted ? "" : "Não iniciada"}
                {data?.isOpen ? "Aberta" : ""}
                {data?.isEnded ? "Fechada" : ""}
                {data?.isCancelled ? "Cancelada" : ""}
              </Badge>
            </Skeleton>
          </VStack>

          <HStack transform="translateX(4px)">
            {/* <Skeleton isLoaded={!isLoading && !error}>
              <Badge colorScheme={data?.isOpen ? "green" : "red"}>
                {data?.isOpen ? "Aberta" : "Fechada"}
              </Badge>
            </Skeleton> */}

            {!isLoading && !error && (
              <VotingMenu
                startVoting={startVoting}
                cancelVoting={cancelVoting}
                onEdit={() =>
                  router.push(`/voting/${contract?.options?.address}/edit`)
                }
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
                <Skeleton
                  isLoaded={!isLoading && !error}
                  w="200px"
                  height="163px"
                />
                <Skeleton
                  isLoaded={!isLoading && !error}
                  w="200px"
                  height="163px"
                />
                <Skeleton
                  isLoaded={!isLoading && !error}
                  w="200px"
                  height="163px"
                />
              </Flex>
            )}
            <Skeleton isLoaded={!isLoading && !error}>
              <Grid
                templateColumns="repeat(auto-fit, minmax(0, 200px))"
                gap={8}
              >
                {data?.proposals?.map?.((proposal, index) => (
                  <Grid
                    key={proposal}
                    templateRows="auto 1fr auto"
                    justifyItems="center"
                    alignItems="center"
                    gap={2}
                    p={5}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius={8}
                  >
                    <Avatar name={proposal} />

                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      textTransform="capitalize"
                    >
                      {proposal}
                    </Text>
                    <DangerPopup
                      title={`Votar em ${proposal}`}
                      message="Você tem certeza que deseja votar nessa opção?"
                      onConfirm={vote({ proposalIndex: index })}
                    >
                      <Button
                        variant="outline"
                        leftIcon={<Icon as={MdHowToVote} boxSize={5} />}
                        w="full"
                        size="md"
                      >
                        Votar
                      </Button>
                    </DangerPopup>
                  </Grid>
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
                <Skeleton
                  isLoaded={!isLoading && !error}
                  w="45%"
                  height="24px"
                />
                <Skeleton
                  isLoaded={!isLoading && !error}
                  w="45%"
                  height="24px"
                />
              </Flex>
            )}
            <Skeleton isLoaded={!isLoading && !error}>
              <Grid templateColumns="1fr 1fr" justifyItems="start" gap={2}>
                {data?.whiteList?.map?.((address) => (
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
          <Skeleton isLoaded={!isLoading && !error} w="75%" height="24px">
            <Text fontWeight="medium">{date ?? "Loading..."}</Text>
          </Skeleton>
        </CardFooter>
      </Card>
    </Flex>
  );
}
