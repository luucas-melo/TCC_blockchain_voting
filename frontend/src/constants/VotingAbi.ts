import { AbiItem } from "web3-utils";

import json from "../../../blockchain/build/contracts/Voting.json";

export const VotingAbi: AbiItem[] = json.abi as AbiItem[];
