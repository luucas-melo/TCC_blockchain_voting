import { useToast, VStack } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";

import { validateEthereumAddress } from "@/utils/validateEthereumAddress";

import { Input } from "../FormFields/Input";
import { Textarea } from "../FormFields/Textarea";

interface VotingFormProps extends UseFormReturn<RegisterVotingValues> {
  // onCreateVoting: (data: Voting) => Promise<unknown>;
}

export function VotingForm(props: VotingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = props;

  const toast = useToast();

  // const onSubmit = useCallback(
  //   async (data: RegisterVotingValues) => {
  //     const title = data?.title;
  //     const proposals = data?.proposals.split("\n");
  //     const whiteList = data?.whiteList.split("\n");

  //     const duration = new Date(data?.deadline);
  //     const deadline = Math.floor(duration.getTime() / 1000); // unix timestamp

  //     try {
  //       const res = await onCreateVoting({
  //         title,
  //         proposals,
  //         whiteList,
  //         deadline,
  //       });
  //       console.log("onSubmit res:", res);

  //       reset();
  //     } catch (error) {
  //       console.error("onSubmit:", error);
  //       toast({
  //         status: "error",
  //         title: "Algo deu errado",
  //         description: formatContractError(error as Error),
  //       });
  //     }
  //   },
  //   [onCreateVoting, reset, toast]
  // );

  return (
    <VStack align="stretch" spacing={4}>
      {/* <Heading>Criar votação</Heading> */}
      <Input
        label="Título da votação"
        placeholder="Título da votação"
        {...register("title", {
          required: "Título da votação é obrigatório",
        })}
        errors={errors?.title}
      />

      <Textarea
        label="Opções de voto"
        {...register("proposals", {
          required: "Campo obrigatório",
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
          required: "Campo obrigatório",
          validate: validateEthereumAddress,
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
    </VStack>
  );
}
