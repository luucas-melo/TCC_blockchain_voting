import {
  Button,
  chakra,
  Heading,
  Link,
  ToastId,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";

import { VotingFactoryArtifact } from "@/constants/VotingFactory";
import { formatContractError } from "@/utils/formatContractError";

import { Input } from "../FormFields/Input";
import { Textarea } from "../FormFields/Textarea";

export function CreateVotingForm() {
  // const {
  //   state: { wallet },
  //   web3,
  // } = useMetamask();

  const { account: wallet } = useWeb3React();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterVoting>({
    mode: "onChange",
  });

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const connector = useWeb3React();
  console.log("connector", connector);

  const createVoting = useCallback(
    async ({ title, proposals, whiteList, deadline }: Voting) => {
      if (!wallet) return "Wallet not found";

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
              status: "loading",
              duration: null,
              title: "Aguarde enquanto a votação é criada",

              description: (
                <Link
                  color="white"
                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                  target="_blank"
                >
                  Clique aqui para acompanhar a transação
                </Link>
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
                  color="white"
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
    async (data: RegisterVoting) => {
      const title = data?.title;
      const proposals = data?.proposals.split("\n");
      const whiteList = data?.whiteList.split("\n");

      console.log("duration", data?.deadline, typeof data?.deadline);
      const duration = new Date(data?.deadline);
      const deadline = Math.floor(duration.getTime() / 1000); // unix timestamp

      try {
        toastIdRef.current = toast({
          status: "info",
          title: "Criando votação",
          description: "Por favor, confirme a transação na sua carteira",
          position: "top",
          duration: null,
        });
        const res = await createVoting({
          title,
          proposals,
          whiteList,
          deadline,
        });
        console.log("onSubmit res:", res);

        // toast.update(toastIdRef.current,{
        //   status: "success",
        //   title: "Votação criada com sucesso",
        // });
        reset();
      } catch (error) {
        console.error("onSubmit:", error);
      }
    },
    [createVoting, reset, toast]
  );

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)}>
      <VStack align="stretch" spacing={4}>
        <Heading>Criar votação</Heading>
        <Input
          label="Título da votação"
          placeholder="Título da votação"
          {...register("title", {
            // required: "Título da votação é obrigatório",
          })}
          errors={errors?.title}
        />

        <Textarea
          label="Opções de voto"
          {...register("proposals", {
            // required: "Campo obrigatório",
          })}
          helperText="Cada opção deve ser separada por uma quebra de linha"
          placeholder="Insira os nomes das opções de voto"
          size="sm"
          rows={6}
          errors={errors?.proposals}
          resize="vertical"
        />

        <Textarea
          label="Carteiras autorizadas"
          {...register("whiteList", {
            // required: "Campo obrigatório",
            // validate: validateEthereumAddress,
          })}
          helperText="Cada opção deve ser separada por uma quebra de linha"
          placeholder="Insira os endereços das carteiras de quem pode votar"
          size="sm"
          rows={6}
          errors={errors?.whiteList}
          resize="vertical"
        />

        <Input
          type="datetime-local"
          label="Duração da votação"
          placeholder="Duração da votação"
          {...register("deadline", {
            required: "Duração da votação é obrigatório",
          })}
          errors={errors?.deadline}
        />

        <Button type="submit" width="full" size="lg">
          Criar
        </Button>
      </VStack>
    </chakra.form>
  );
}
