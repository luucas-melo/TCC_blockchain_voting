import { Button } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Web3 from "web3";

import { Wallet } from "@/components/Wallet";
import { VotingAbi } from "@/constants/VotingAbi";
import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";

const inter = Inter({ subsets: ["latin"] });

export function Test({ contractAddress }) {
  const {
    dispatch,
    state: { isMetamaskInstalled, status, wallet },
  } = useMetamask();

  const listen = useListen();
  const web3 = new Web3("ws://localhost:8545");
  useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";
      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      // user was previously connected, start listening to MM
      if (local) {
        listen();
      }

      // local could be null if not present in LocalStorage
      const { wallet, balance } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null };

      dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
    }
  }, []);

  const [contract, setContract] = useState(null);

  //   let contractAddress = "0x1f49444De78Bd325C2A3C1C4550fF6BBF5FbEEd1"; // hard coded for now

  const add = async () => {
    if (!wallet) return;

    const contract = new web3.eth.Contract(VotingAbi, contractAddress);

    const inputConsts = "0xDf3f47571FD69590dA954777562E8751869c9817"; // hard coded for now

    const data = contract.methods.addToWhiteList(inputConsts).encodeVotingAbi();
    console.log("data", data);
    // Define the gas price and gas limit
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice", gasPrice);
    console.log("wallet", wallet);
    const tx = {
      from: wallet,
      to: contractAddress,
      data,
      gas: "2000000000",
      gasPrice,
    };

    const gasLimit = await web3.eth.estimateGas(tx);
    console.log("gasLimit", gasLimit);
    tx.gas = (gasLimit * 1.5).toFixed(0);

    const res = await web3.eth.sendTransaction(tx, (error, transactionHash) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Transaction hash: ${transactionHash}`);
      }
    });
  };

  const vote = async () => {
    if (!wallet) return;

    const contract = new web3.eth.Contract(VotingAbi, contractAddress);

    const inputConsts = 1;

    const data = contract.methods.vote(inputConsts).encodeVotingAbi();
    console.log("data", data);
    // Define the gas price and gas limit
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice", gasPrice);
    console.log("wallet", wallet);
    const tx = {
      from: wallet,
      to: contractAddress,
      data,
      gas: "2000000000", // hard coded for now
      gasPrice,
    };

    const gasLimit = await web3.eth.estimateGas(tx);
    console.log("gasLimit", gasLimit);
    tx.gas = (gasLimit * 1.5).toFixed(0);

    const res = await web3.eth.sendTransaction(tx, (error, transactionHash) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Transaction hash: ${transactionHash}`);
      }
    });
  };

  useEffect(() => {
    const c = new web3.eth.Contract(VotingAbi, contractAddress);
    setContract(c);
  }, []);

  return (
    <>
      <Button onClick={add}>Adicionar na white</Button>
      <Button onClick={vote}>Vote</Button>
      <Wallet />
    </>
  );
}
