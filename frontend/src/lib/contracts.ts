import Contract from "web3-eth-contract";

import { VotingArtifact } from "@/constants/Voting";
import { VotingFactoryArtifact } from "@/constants/VotingFactory";

import { web3 } from "./web3";

export const VotingFactoryContract = new web3.eth.Contract(
  VotingFactoryArtifact.abi,
  // sepolia network id
  VotingFactoryArtifact.networks?.[11155111]?.address
);

export const VotingContract = (address: string) => {
  try {
    const provider = typeof window !== "undefined" ? window.web3 : web3;

    return new provider.eth.Contract(VotingArtifact.abi, address);
    // return new web3.eth.Contract(VotingArtifact.abi, address);
  } catch (error) {
    console.log(error);

    return {} as Contract<typeof VotingArtifact.abi>;
  }
};

type PromiseResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

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

    const getResultPromise = contract.methods.getResult().call() as Promise<
      number[]
    >;

    const [
      titleResult,
      votingDurationResult,
      whiteListResult,
      proposalsResult,
      isOpenResult,
      isCancelledResult,
      isEndedResult,
      isStartedResult,
      electionChiefResult,
      getResult,
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
      getResultPromise,
    ]);

    function handleSettledPromise<T>(result: PromiseResult<T>): T {
      if (result.status === "fulfilled") {
        return result.value;
      }

      console.error("Promise rejected: ", result?.reason);
      throw new Error("Promise rejected", { cause: result?.reason });
    }

    // it can be reajected if the voting has not ended yet
    function handleVotingResultPromise<T>(
      result: PromiseResult<T>
    ): PromiseResult<T> {
      return result;
    }

    const title = handleSettledPromise(titleResult);
    const votingDuration = handleSettledPromise(votingDurationResult);
    const whiteList = handleSettledPromise(whiteListResult);
    const proposals = handleSettledPromise(proposalsResult);
    const isOpen = handleSettledPromise(isOpenResult);
    const isCancelled = handleSettledPromise(isCancelledResult);
    const isEnded = handleSettledPromise(isEndedResult);
    const isStarted = handleSettledPromise(isStartedResult);
    const electionChief = handleSettledPromise(electionChiefResult);
    const votingResult = handleVotingResultPromise(getResult);

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
      votingResult,
    };
  };
