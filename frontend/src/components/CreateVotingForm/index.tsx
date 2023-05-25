import { Button, Card, chakra, Heading, VStack } from "@chakra-ui/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { votingFactoryAddress } from "@/constants/voitngFactoriyAddress";
import { VotingFactoryAbi } from "@/constants/VotingFactoryAbi";
import { useMetamask } from "@/hooks/useMetamask";
import { web3 } from "@/lib/web3";
import { validateEthereumAddress } from "@/utils/validateEthereumAddress";

import { Input } from "../FormFields/Input";
import { Textarea } from "../FormFields/Textarea";

export function CreateVotingForm() {
  const {
    state: { wallet, balance, isMetamaskInstalled, status },
    dispatch,
  } = useMetamask();

  console.log("wallet aqui", wallet);

  const createVoting = useCallback(
    async ({ name, proposals, whiteList }: Voting) => {
      console.log("data", name, proposals, whiteList);
      console.log("wallet", wallet);
      if (!wallet) return;

      const contract = new web3.eth.Contract(
        VotingFactoryAbi,
        votingFactoryAddress
      );

      const inputConsts = [name, proposals, whiteList];

      const data = contract.methods.deploy(...inputConsts).encodeABI();
      console.log("data", data);
      // Define the gas price and gas limit
      const gasPrice = await web3.eth.getGasPrice();
      console.log("gasPrice", gasPrice);
      console.log("wallet", wallet);
      const tx = {
        from: wallet,
        to: votingFactoryAddress,
        data,
        gas: "2000000000", // hard coded for now
        gasPrice,
      };

      const gasLimit = await web3.eth.estimateGas(tx);
      tx.gas = (gasLimit * 1.5).toFixed(0);

      const res = await web3.eth.sendTransaction(
        tx,
        (error, transactionHash) => {
          if (error) {
            console.error(error);
          } else {
            console.log(`Transaction hash: ${transactionHash}`);
          }
        }
      );
    },
    [wallet]
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
    control,
    formState: { errors },
  } = useForm<RegisterVoting>({
    mode: "onChange",
  });

  console.log(errors);

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
