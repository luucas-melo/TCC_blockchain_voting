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
