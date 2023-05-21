"use client";
import { CreateVotingForm } from "@/components/CreateVotingForm";
import { Test } from "@/components/Test";
import { VotingFactoryAbi } from "@/constants/VotingFactoryAbi";
import { votingFactoryAddress } from "@/constants/voitngFactoriyAddress";
import { useMetamask } from "@/hooks/useMetamask";
import { web3 } from "@/lib/web3";
import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
const CreateVoting = () => {
  const [votings, setVotings] = useState<string[]>([]);

  const {
    state: { wallet, balance, isMetamaskInstalled, status },
    dispatch,
  } = useMetamask();
  console.log(wallet);
  const getAllVoting = async () => {
    console.log(wallet);
    if (!wallet) return;

    const contract = new web3.eth.Contract(
      VotingFactoryAbi,
      votingFactoryAddress
    );

    const response = await contract.methods.getDeployedContracts().call();
    setVotings(response);
    console.log("response", response);
  };

  useEffect(() => {
    if (wallet) getAllVoting();
  }, [wallet]);

  return (
    <Flex flexDirection="column" align="center" justify="center">
      <CreateVotingForm />
    </Flex>
  );
};

export default CreateVoting;
