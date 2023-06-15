import {
  Button,
  chakra,
  Heading,
  ToastId,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";

import { useMetamask } from "@/hooks/useMetamask";
import { VotingFactoryContract } from "@/lib/contracts";

import { Input } from "../FormFields/Input";
import { Textarea } from "../FormFields/Textarea";

export function CreateVotingForm() {
  const {
    state: { wallet },
  } = useMetamask();

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

  const createVoting = useCallback(
    async ({ title, proposals, whiteList, deadline }: Voting) => {
      if (!wallet) return "Wallet not found";

      console.log("deadline", deadline, typeof deadline);
      const inputConsts = [title, proposals, whiteList, deadline];

      // const data = VotingFactoryContract.methods
      //   .deploy(...inputConsts)
      //   .encodeABI();

      // const gasPrice = await web3.eth.getGasPrice();
      // const tx = {
      //   from: wallet as string,
      //   data,
      //   gas: "20000000000", // hard coded for now
      //   gasPrice,
      // };

      // const gasLimit = await web3.eth.estimateGas(tx);
      // tx.gas = (gasLimit * 1.5).toFixed(0);

      const gasLimit = await VotingFactoryContract.methods
        .deploy(title, proposals, whiteList, deadline)
        .estimateGas({ from: wallet as string });

      console.log("teste", gasLimit);

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
              title: "Erro ao criar votação",
              description: error?.message
                ?.split(":")?.[2]
                ?.replace("revert", ""),
            });
        })
        .on("transactionHash", (transactionHash) => {
          console.log(`Transaction hash: ${transactionHash}`);
        })
        .on("receipt", (receipt) => {
          console.log("receipt", receipt);
        })
        .on("confirmation", (confirmation) => {
          console.log("confirmation", confirmation);
        });
      // .then((res) => {
      //   console.log("res", res);

      //   return res;
      // })
      // .catch((err) => {
      //   console.log("err", err);

      //   return Promise.reject(err);
      // })
      // .finally(() => {
      //   console.log("finally");
      // });

      console.log("response", response);

      return response;

      // .on("transactionHash", (transactionHash) => {
      //   console.log(`Transaction hash: ${transactionHash}`);
      // })
      // .on("receipt", (receipt) => {
      //   console.log("receipt", receipt);
      // })
      // .on("confirmation", (confirmationNumber, receipt) => {
      //   console.log("confirmation", confirmationNumber, receipt);
      // })
      // .on("error", (error, receipt) => {
      //   console.error("error TESTE:", error, receipt);

      //   if (toastIdRef.current)
      //     toast.update(toastIdRef.current, {
      //       status: "error",
      //       title: "Erro ao criar votação",
      //       description: error?.message
      //         ?.split(":")?.[2]
      //         ?.replace("revert", ""),
      //     });
      // });
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
          description: "Aguarde enquanto a votação é criada",
          position: "top",
        });
        const res = await createVoting({
          title,
          proposals,
          whiteList,
          deadline,
        });
        console.log("onSubmit res:", res);
        if (toastIdRef.current)
          toast.update(toastIdRef.current, {
            status: "success",
            title: "Votação criada com sucesso",
          });
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
