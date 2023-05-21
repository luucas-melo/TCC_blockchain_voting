import { Button, Card, Flex, Heading } from "@chakra-ui/react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../FormFields/Input";
import { Textarea } from "../FormFields/Textarea";
import { validateEthereumAddress } from "@/utils/validateEthereumAddress";
import { useMetamask } from "@/hooks/useMetamask";
import { VotingFactoryAbi } from "@/constants/VotingFactoryAbi";
import { votingFactoryAddress } from "@/constants/voitngFactoriyAddress";
import { web3 } from "@/lib/web3";

export const CreateVotingForm = () => {
  const {
    state: { wallet, balance, isMetamaskInstalled, status },
    dispatch,
  } = useMetamask();

  const createVoting = async ({ name, proposals, whiteList }: Voting) => {
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

    let gasLimit = await web3.eth.estimateGas(tx);
    tx.gas = (gasLimit * 1.5).toFixed(0);

    const res = await web3.eth.sendTransaction(tx, (error, transactionHash) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Transaction hash: ${transactionHash}`);
      }
    });
  };

  const onSubmit = useCallback((data: RegisterVoting) => {
    const name = data?.name;
    const proposals = data?.proposals.split("\n");
    const whiteList = data?.whiteList.split("\n");
    createVoting({ name, proposals, whiteList });
  }, []);

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card display="flex" flexDir="column" gap={6} width="500px" padding={12}>
        <Heading>Criar votação</Heading>
        <Input
          placeholder="Título da votação"
          {...register("name", {
            required: "Título da votação é obrigatório",
          })}
          errors={errors.name}
        />

        <Textarea
          {...register("proposals", {
            required: "Campo obrigatório",
          })}
          helperText="Cada opção deve ser separada por uma quebra de linha"
          placeholder="Insira os nomes das opções de votação"
          size="sm"
          errors={errors.proposals}
          resize="vertical"
        />

        <Textarea
          {...register("whiteList", {
            required: "Campo obrigatório",
            validate: validateEthereumAddress,
          })}
          helperText="Cada opção deve ser separada por uma quebra de linha"
          placeholder="Insira os endereços das carteiras de quem pode votar"
          size="sm"
          errors={errors.whiteList}
          resize="vertical"
        />
        <Button type="submit" width="full" size="lg">
          Criar
        </Button>
      </Card>
    </form>
  );
};
