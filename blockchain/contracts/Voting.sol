// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.0 to v0.9.0
pragma solidity ^0.8.0;

contract Voting {
    mapping(address => uint) whiteList;
    mapping(address => bool) exists;
    string public name;
    struct Proposal {
        string name;
        uint voteCount;
    }

    address public ElectionCommission;

    Proposal[] public proposals;

    constructor(
        string memory name_,
        string[] memory proposalNames,
        address[] memory whiteList_
    ) {
        ElectionCommission = msg.sender;
        name = name_;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }

        for (uint i = 0; i < whiteList_.length; i++) {
            whiteList[whiteList_[i]] = 1;
        }
    }

    function addToWhiteList(address voter) public {
        require(
            msg.sender == ElectionCommission,
            "Only ElectionCommission can give right to vote."
        );

        if (exists[voter]) return;

        whiteList[voter] = 1;
        exists[voter] = true;
    }

    function vote(uint proposal) public {
        address voter = msg.sender;
        require(exists[voter] == true, "You are not allowed to vote");

        require(whiteList[voter] > 0, "You have already voted");

        uint voteWeight = whiteList[voter];

        proposals[proposal].voteCount += voteWeight;
        whiteList[voter] = 0;
    }

    function getWhiteList(address key) public view returns (uint) {
        return whiteList[key];
    }

    function getResult() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }
}
