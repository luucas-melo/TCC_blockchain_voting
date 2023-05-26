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

    function getVotings() public view returns (Voting[] memory) {
        address voter = msg.sender;

        Voting[] memory votingContracts = new Voting[](
            deployedContracts.length
        );

        uint arrayLength = deployedContracts.length;
        for (uint i = 0; i < arrayLength; i++) {
            bool isWhiteListed = Voting(deployedContracts[i]).getIsWhiteListed(
                voter
            );

            if (isWhiteListed) {
                votingContracts[i] = Voting(deployedContracts[i]);
            } else continue;
        }

        return votingContracts;
    }
}
