// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Voting} from "./Voting.sol";

contract VotingFactory {
    address[] public deployedContracts;
    event ContractDeployed(address deployedAddress);

    function deploy(
        string memory _title,
        string[] memory _proposals,
        address[] memory _whiteList,
        uint256 duration
    ) public {
        // if (bytes(_title).length == bytes("").length) {
        //     if (
        //         keccak256(abi.encodePacked(_title)) ==
        //         keccak256(abi.encodePacked(""))
        //     ) {
        //         revert("Title cannot be empty.");
        //     }
        // }

        address newContract = address(
            new Voting(_title, _proposals, _whiteList, duration)
        );
        deployedContracts.push(newContract);
        emit ContractDeployed(newContract);
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }

    function getVotings() public view returns (address[] memory) {
        // Best Gas costs
        address voter = msg.sender;

        address[] memory votingContracts = new address[](
            deployedContracts.length
        );
        uint validCount = 0;

        for (uint i = 0; i < deployedContracts.length; i++) {
            bool exists = Voting(deployedContracts[i]).getIsWhiteListed(voter);
            if (exists) {
                votingContracts[validCount] = deployedContracts[i];
                validCount++;
            }
        }

        // Create a new array with the correct length
        address[] memory result = new address[](validCount);

        // Copy the valid contracts to the new array
        for (uint i = 0; i < validCount; i++) {
            result[i] = votingContracts[i];
        }

        return result;
    }
}
