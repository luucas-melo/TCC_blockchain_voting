// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Voting} from "./Voting.sol";

contract VotingFactory {
    address[] public deployedContracts;
    event ContractDeployed(address deployedAddress);

    function deploy(
        string memory name,
        string[] memory proposalNames,
        address[] memory whiteList_
    ) public {
        address newContract = address(
            new Voting(name, proposalNames, whiteList_)
        );
        deployedContracts.push(newContract);
        emit ContractDeployed(newContract);
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}
