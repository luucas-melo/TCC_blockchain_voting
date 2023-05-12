"use client";
import { Test } from "@/components/Test";
import { VotingFactoryAbi } from "@/constants/VotingFactoryAbi";
import { useMetamask } from "@/hooks/useMetamask";
import { web3 } from "@/lib/web3";
import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const TestPage = () => {
  const votingFactoryAddress = "0xAD3419a9111C58CfEa0FC45Eb3d5E0d44441913A";
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

  const createVoting = async ({ name, proposals, whiteList }: Voting) => {
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

  return (
    <Flex flexDirection="column" gap={4}>
      <Button
        colorScheme="facebook"
        onClick={() =>
          createVoting({
            name: "test",
            proposals: ["a", "b", "c"],
            whiteList: [],
          })
        }
      >
        Create voting
      </Button>
      {votings?.map((votingAddress) => (
        <Test contractAddress={votingAddress} />
      ))}
    </Flex>
  );
};

export default TestPage;
