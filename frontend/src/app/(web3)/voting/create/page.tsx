"use client";

import {
  Button,
  Card,
  Center,
  Link,
  ToastId,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";

import { TransactionPendingToast } from "@/components/TransationPendingToast";
import { VotingForm } from "@/components/VotingForm";
import { VotingFactoryArtifact } from "@/constants/VotingFactory";
import { formatContractError } from "@/utils/formatContractError";

const CreateVoting = () => {
  const { account: wallet } = useWeb3React();

  const formMethods = useForm<RegisterVotingValues>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formMethods;

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const createVoting = useCallback(
    async ({ title, proposals, whiteList, deadline }: Voting) => {
      if (!wallet) throw new Error("User wallet not found");

      toastIdRef.current = toast({
        status: "info",
        title: "Criando votação",
        description: "Por favor, confirme a transação na sua carteira",
        duration: null,
      });

      const VotingFactoryContract = new window.web3.eth.Contract(
        VotingFactoryArtifact.abi,
        Object.entries(VotingFactoryArtifact.networks)[1][1].address
      );

      const gasLimit = await VotingFactoryContract.methods
        .deploy(title, proposals, whiteList, deadline)
        .estimateGas({ from: wallet as string });

      const response = await VotingFactoryContract.methods
        .deploy(title, proposals, whiteList, deadline)
        .send({
          from: wallet as string,
          gas: (gasLimit * BigInt(2)).toString(),
        })
        .on("error", (error) => {
          console.error("error TESTE:", error);

          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "error",
              title: "Não foi possível criar votação",
              description: formatContractError(error as Error),
            });
        })
        .on("transactionHash", (transactionHash) => {
          console.log(`Transaction hash: ${transactionHash}`);
          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              render: (props) => (
                <TransactionPendingToast transactionHash={transactionHash} />
              ),
            });
        })
        .on("receipt", (receipt) => {
          console.log("receipt", receipt);
        })
        .on("confirmation", (confirmation) => {
          console.log("confirmation", confirmation);
          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "success",
              variant: "subtle",
              title: "Votação criada com sucesso",
              description: (
                <Link
                  // color="white"
                  href={`https://sepolia.etherscan.io/tx/${confirmation.receipt.transactionHash}`}
                  target="_blank"
                >
                  Clique aqui para visualizar bloco na blockchain
                </Link>
              ),
              isClosable: true,
            });
        });

      console.log("response", response);

      return response;
    },
    [toast, wallet]
  );

  const onSubmit = useCallback(
    async (data: RegisterVotingValues) => {
      const title = data?.title;
      const proposals = data?.proposals.split("\n");
      const whiteList = data?.whiteList.split("\n");

      const duration = new Date(data?.deadline);
      const deadline = Math.floor(duration.getTime() / 1000); // unix timestamp

      try {
        const res = await createVoting({
          title,
          proposals,
          whiteList,
          deadline,
        });
        console.log("onSubmit res:", res);

        reset();
      } catch (error) {
        console.error("onSubmit:", error);
        toast({
          status: "error",
          title: "Algo deu errado",
          description: formatContractError(error as Error),
        });
      }
    },
    [createVoting, reset, toast]
  );

  return (
    <Center height="100%">
      <Card
        gap={6}
        width="100%"
        maxWidth="500px"
        padding={[4, 8, 12]}
        // backgroundColor="whiteAlpha.900"
        // backdropFilter="blur(16px)"
        boxShadow="2xl"
        border="1px solid"
        // borderColor="gray.500"
      >
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={4}
          align="stretch"
        >
          <VotingForm {...formMethods} />

          <Button type="submit" size="lg" width="full">
            Criar votação
          </Button>
        </VStack>
      </Card>
    </Center>
  );
};

export default CreateVoting;
