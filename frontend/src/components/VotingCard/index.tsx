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
} from "@chakra-ui/react";
import type { Route } from "next";
import { default as NextLink } from "next/link";
import { useCallback, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import useSWR from "swr";
import { Contract } from "web3-eth-contract";

import { useVoting } from "@/hooks/useVoting";
import { getContractData } from "@/lib/contracts";

import { ActionButton } from "../ActionButton";

interface VotingCardProps {
  contract: Contract;
}

export function VotingCard({ contract }: VotingCardProps) {
  const background = useColorModeValue("whiteAlpha.700", "blackAlpha.600");

  const {
    data,
    isLoading,
    mutate: updateContract,
  } = useSWR(contract?.options?.address, getContractData(contract));

  const { startVoting } = useVoting(contract, updateContract);

  console.log("VotingCard ~ data:", data);

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
            <Text fontWeight="medium">{date ?? "Loading..."}</Text>
          </Skeleton>
        </CardFooter>
      </Card>
    </Flex>
  );
}
