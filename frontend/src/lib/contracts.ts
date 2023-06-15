import Contract from "web3-eth-contract";

import { votingFactoryAddress } from "@/constants/voitngFactoriyAddress";
import { VotingAbi } from "@/constants/VotingAbi";
import { VotingFactoryAbi } from "@/constants/VotingFactoryAbi";

import { web3 } from "./web3";

export const VotingFactoryContract = new web3.eth.Contract(
  VotingFactoryAbi,
  votingFactoryAddress
);

export const VotingContract = (address: string) =>
  new web3.eth.Contract(VotingAbi, address);

export const getContractData = (contract: Contract) => async () => {
  const electionChiefPromise = contract.methods
    .electionCommission()
    .call() as Promise<string>;

  const titlePromise = contract.methods.title().call() as Promise<string>;

  const votingDurationPromise = contract.methods
    .votingDuration()
    .call() as Promise<string>;

  const proposalsPromise = contract.methods.getProposals().call() as Promise<
    string[]
  >;

  const isCancelledPromise = contract.methods
    .votingCancelled()
    .call() as Promise<boolean>;

  const isOpenPromise = contract.methods.getIsOpen().call() as Promise<boolean>;

  const isEndedPromise = contract.methods
    .votingEnded()
    .call() as Promise<boolean>;

  const whiteListPromise = contract.methods
    .getWhiteListedAddresses()
    .call() as Promise<string[]>;
  // console.log("white", whiteListPromise);

  console.log("methods", contract.methods);

  const [
    title,
    votingDuration,
    whiteList,
    proposals,
    isOpen,
    isCancelled,
    isEnded,
    electionChief,
  ] = await Promise.allSettled([
    titlePromise,
    votingDurationPromise,
    whiteListPromise,
    proposalsPromise,
    isOpenPromise,
    isCancelledPromise,
    isEndedPromise,
    electionChiefPromise,
  ]);

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(
    "data",
    title,
    votingDuration,
    proposals,
    isOpen,
    isCancelled,
    isEnded,
    whiteList
  );

  return {
    title,
    votingDuration,
    proposals,
    isOpen,
    electionChief,
    isCancelled,
    isEnded,
    whiteList,
  };
};
