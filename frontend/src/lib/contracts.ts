import Contract from "web3-eth-contract";

import { VotingArtifact } from "@/constants/Voting";
import { VotingFactoryArtifact } from "@/constants/VotingFactory";

import { web3 } from "./web3";

export const VotingFactoryContract = new web3.eth.Contract(
  VotingFactoryArtifact.abi,
  Object.entries(VotingFactoryArtifact.networks)[1][1].address
);

export const VotingContract = (address: string) => {
  try {
    return new window.web3.eth.Contract(VotingArtifact.abi, address);
  } catch (error) {
    console.log(error);

    return {} as Contract<typeof VotingArtifact.abi>;
  }
};

export const getContractData =
  (contract: Contract<typeof VotingArtifact.abi>) => async () => {
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

    const isStartedPromise = contract.methods
      .votingStarted()
      .call() as Promise<boolean>;

    const isOpenPromise = contract.methods
      .getIsOpen()
      .call() as Promise<boolean>;

    const isEndedPromise = contract.methods
      .votingEnded()
      .call() as Promise<boolean>;

    const whiteListPromise = contract.methods
      .getWhiteListedAddresses()
      .call() as Promise<string[]>;

    const [
      title,
      votingDuration,
      whiteList,
      proposals,
      isOpen,
      isCancelled,
      isEnded,
      isStarted,
      electionChief,
    ] = await Promise.allSettled([
      titlePromise,
      votingDurationPromise,
      whiteListPromise,
      proposalsPromise,
      isOpenPromise,
      isCancelledPromise,
      isEndedPromise,
      isStartedPromise,
      electionChiefPromise,
    ]);

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      title,
      votingDuration,
      proposals,
      isOpen,
      electionChief,
      isCancelled,
      isEnded,
      isStarted,
      whiteList,
    };
  };
