// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Assert.sol";
import "../contracts/Voting.sol";

contract TestVoting {
    Voting voting;

    function beforeEach() public {
        string[] memory proposals = new string[](3);
        proposals[0] = "Proposal 1";
        proposals[1] = "Proposal 2";
        proposals[2] = "Proposal 3";

        address[] memory whitelist = new address[](2);
        whitelist[0] = address(0x1);
        whitelist[1] = address(0x2);

        voting = new Voting(
            msg.sender,
            "Voting Title",
            proposals,
            whitelist,
            3600
        );
    }

    function testAddToWhitelist() public {
        voting.addToWhiteList(address(0x3));
        Assert.equal(
            voting.getExists(address(0x3)),
            true,
            "Address should be added to the whitelist"
        );
    }

    function testRemoveFromWhitelist() public {
        voting.removeFromWhiteList(address(0x1));
        Assert.equal(
            voting.getExists(address(0x1)),
            false,
            "Address should be removed from the whitelist"
        );
    }

    function testVote() public {
        voting.vote(0);
        Assert.equal(
            voting.getResult()[0],
            1,
            "Vote count should be incremented"
        );
    }

    function testEditVoting() public {
        string[] memory newProposals = new string[](2);
        newProposals[0] = "New Proposal 1";
        newProposals[1] = "New Proposal 2";

        address[] memory newWhitelist = new address[](1);
        newWhitelist[0] = address(0x3);

        voting.editVoting("New Voting Title", newProposals, newWhitelist, 7200);

        Assert.equal(
            voting.title(),
            "New Voting Title",
            "Title should be updated"
        );
        Assert.equal(
            voting.getProposals().length,
            2,
            "Number of proposals should be updated"
        );
        Assert.equal(
            voting.getWhiteListedAddresses().length,
            1,
            "Number of whitelist addresses should be updated"
        );
    }

    function testStartVoting() public {
        voting.startVoting();
        Assert.equal(
            voting.getIsOpen(),
            true,
            "Voting should be open after starting"
        );
    }

    function testEndVoting() public {
        voting.endVoting();
        Assert.equal(voting.votingEnded(), true, "Voting should be ended");
    }

    function testCancelVoting() public {
        voting.cancelVoting();
        Assert.equal(
            voting.votingCancelled(),
            true,
            "Voting should be cancelled"
        );
    }
}
