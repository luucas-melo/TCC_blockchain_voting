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
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
  WrapItem,
} from "@chakra-ui/react";
import type { Route } from "next";
import { default as NextLink } from "next/link";
import { useCallback, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdHowToVote } from "react-icons/md";
import useSWR from "swr";

import { ActionButton } from "@/components/ActionButton";
import { DangerPopup } from "@/components/DangerPopup";
import { useVoting } from "@/hooks/useVoting";
import { getContractData, VotingContract } from "@/lib/contracts";

export default function VotingPage({ params }: { params: { id: string } }) {
  const contract = VotingContract(params.id);

  const background = useColorModeValue("whiteAlpha.700", "blackAlpha.600");

  const {
    data,
    isLoading,
    mutate: updateContract,
  } = useSWR(contract?.options?.address, getContractData(contract));

  const { startVoting, vote } = useVoting(contract, updateContract);

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

  return (
    <Flex direction="column">
      <Link
        as={NextLink}
        href={`/voting/${contract?.options?.address}`}
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
              >
                {getPromiseValue("title") ?? "Carregando..."}
              </Heading>
              <Badge
                variant="solid"
                colorScheme={getPromiseValue("isOpen") ? "green" : "red"}
                cursor="default"
              >
                {getPromiseValue("isOpen") ? "Aberta" : "Fechada"}
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
              <Menu>
                <MenuButton
                  as={ActionButton}
                  icon={<Icon as={BsThreeDotsVertical} />}
                  colorScheme="gray"
                />
                <Portal>
                  <MenuList>
                    <MenuItem>Editar</MenuItem>
                    <MenuItem onClick={startVoting}>Iniciar</MenuItem>
                    <MenuDivider />
                    <MenuItem color="red.400">Cancelar</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
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
              <Flex gap={8}>
                <Skeleton isLoaded={!isLoading} w="18%" height="144px" />
                <Skeleton isLoaded={!isLoading} w="18%" height="144px" />
              </Flex>
            )}
            <Skeleton isLoaded={!isLoading}>
              <Flex gap={8}>
                {getPromiseValue("proposals")?.map?.((proposal, index) => (
                  <Card
                    key={proposal}
                    boxShadow="sm"
                    display="flex"
                    flexDirection="column"
                    align="center"
                    py={4}
                    px={8}
                    gap={2}
                  >
                    {/* <Flex
                      width="full"
                      justify="flex-end"
                      transform="translateX(30px)"
                    >
                      <ActionButton
                        icon={<MdHowToVote />}
                        label="Votar nessa opção"
                      />
                    </Flex> */}
                    <WrapItem>
                      <Avatar name={proposal} />
                    </WrapItem>
                    <Text fontWeight="medium">{proposal}</Text>
                    <DangerPopup
                      message="Você tem certeza que deseja votar nessa opção?"
                      onConfirm={vote({ proposalIndex: index })}
                    >
                      <Button
                        variant="ghost"
                        leftIcon={<MdHowToVote />}
                        w="full"
                        size="xs"
                      >
                        Votar
                      </Button>
                    </DangerPopup>
                  </Card>
                ))}
              </Flex>
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
                    fontSize="md"
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
