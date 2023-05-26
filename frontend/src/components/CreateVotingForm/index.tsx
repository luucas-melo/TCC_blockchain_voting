import {
  Button,
  Card,
  chakra,
  Heading,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { votingFactoryAddress } from "@/constants/voitngFactoriyAddress";
import { useMetamask } from "@/hooks/useMetamask";
import { VotingFactoryContract } from "@/lib/contracts";
import { web3 } from "@/lib/web3";
import { validateEthereumAddress } from "@/utils/validateEthereumAddress";

import { Input } from "../FormFields/Input";
import { Textarea } from "../FormFields/Textarea";

export function CreateVotingForm() {
  const {
    state: { wallet },
  } = useMetamask();

  const toast = useToast();

  const createVoting = useCallback(
    async ({ name, proposals, whiteList }: Voting) => {
      if (!wallet) return;

      // const contract = new web3.eth.Contract(
      //   VotingFactoryAbi,
      //   votingFactoryAddress
      // );

      const inputConsts = [name, proposals, whiteList];

      const data = VotingFactoryContract.methods
        .deploy(...inputConsts)
        .encodeABI();
      // Define the gas price and gas limit
      const gasPrice = await web3.eth.getGasPrice();
      const tx = {
        from: wallet,
        to: votingFactoryAddress,
        data,
        gas: "2000000000", // hard coded for now
        gasPrice,
      };

      const gasLimit = await web3.eth.estimateGas(tx);
      tx.gas = (gasLimit * 1.5).toFixed(0);

      await web3.eth.sendTransaction(tx, (error, transactionHash) => {
        if (error) {
          console.error(error);
          toast({
            status: "error",
            title: "Erro ao criar votação",
            description: "Tente novamente mais tarde",
          });
        } else {
          console.log(`Transaction hash: ${transactionHash}`);
          toast({
            status: "success",
            title: "Votação criada com sucesso",
          });
        }
      });
    },
    [toast, wallet]
  );

  const onSubmit = useCallback(
    (data: RegisterVoting) => {
      const name = data?.name;
      const proposals = data?.proposals.split("\n");
      const whiteList = data?.whiteList.split("\n");
      createVoting({ name, proposals, whiteList });
    },
    [createVoting]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterVoting>({
    mode: "onChange",
  });

  return (
    <Card gap={6} width="100%" maxWidth="500px" padding={12}>
      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <VStack align="stretch" spacing={4}>
          <Heading>Criar votação</Heading>
          <Input
            label="Título da votação"
            placeholder="Título da votação"
            {...register("name", {
              required: "Título da votação é obrigatório",
            })}
            errors={errors.name}
          />

          <Textarea
            label="Opções de votação"
            {...register("proposals", {
              required: "Campo obrigatório",
            })}
            helperText="Cada opção deve ser separada por uma quebra de linha"
            placeholder="Insira os nomes das opções de votação"
            size="sm"
            rows={6}
            errors={errors.proposals}
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
            errors={errors.whiteList}
            resize="vertical"
          />
          <Button type="submit" width="full" size="lg">
            Criar
          </Button>
        </VStack>
      </chakra.form>
    </Card>
  );
}
