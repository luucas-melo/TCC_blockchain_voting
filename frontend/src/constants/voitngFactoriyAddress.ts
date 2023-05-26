import json from "../../../blockchain/build/contracts/VotingFactory.json";

export const votingFactoryAddress = Object.entries(json.networks)[0][1].address;
