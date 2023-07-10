pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Voting.sol";

contract TestVoting {
    Voting voting;

    function beforeEach() public {
        // Deploy the Voting contract before each test
        string[] memory initialProposals = new string[](2);
        initialProposals[0] = "Proposal 1";
        initialProposals[1] = "Proposal 2";
        address[] memory initialWhiteList = new address[](3);
        initialWhiteList[0] = address(0x1);
        initialWhiteList[1] = address(0x2);
        initialWhiteList[2] = address(this);
        voting = new Voting(
            address(this),
            "Test Voting",
            initialProposals,
            initialWhiteList,
            block.timestamp + 1720636849
        );
    }

    // Verify the initial state of the contract
    function testInitialState() public {
        Assert.equal(voting.title(), "Test Voting", "Incorrect title");
        Assert.equal(
            voting.votingDuration(),
            block.timestamp + 1720636849,
            "Incorrect voting duration"
        );
        Assert.equal(
            voting.votingEnded(),
            false,
            "Voting should not have ended"
        );
        Assert.equal(
            voting.votingStarted(),
            false,
            "Voting should not have started"
        );
        Assert.equal(
            voting.votingCancelled(),
            false,
            "Voting should not be cancelled"
        );
        Assert.equal(
            voting.electionCommission(),
            address(this),
            "Incorrect election commission"
        );
    }

    // Verify the initial proposals
    function testInitialProposals() public {
        string[] memory initialProposals = voting.getProposals();
        Assert.equal(
            initialProposals.length,
            2,
            "Incorrect number of initial proposals"
        );
        Assert.equal(
            initialProposals[0],
            "Proposal 1",
            "Incorrect initial proposal 1"
        );
        Assert.equal(
            initialProposals[1],
            "Proposal 2",
            "Incorrect initial proposal 2"
        );
    }

    // Verify the initial whitelist
    function testInitialWhiteList() public {
        // Verify the initial whitelist
        address[] memory initialWhiteList = voting.getWhiteListedAddresses();
        Assert.equal(
            initialWhiteList.length,
            3,
            "Incorrect number of initial whitelist addresses"
        );
        Assert.equal(
            initialWhiteList[0],
            address(0x1),
            "Incorrect initial whitelist address 1"
        );
        Assert.equal(
            initialWhiteList[1],
            address(0x2),
            "Incorrect initial whitelist address 2"
        );
    }

    function testWhiteList() public {
        // Add an address to the whitelist
        voting.addToWhiteList(address(this));

        // Call the vote function with an address not in the whitelist
        (bool success, bytes memory data) = address(voting).call(
            abi.encodeWithSignature("vote(uint256)", 0)
        );

        // Verify the result
        Assert.isFalse(
            success,
            "Only whitelisted addresses should be able to vote"
        );
    }

    function testStartVoting() public {
        voting.startVoting();
        Assert.equal(
            voting.votingStarted(),
            true,
            "Voting should have started"
        );
    }

    function testGetResultVotingNotEnded() public {
        // Call the getResult function before the voting has ended
        (bool success, ) = address(voting).call(
            abi.encodeWithSignature("getResult()")
        );

        // Verify the result
        Assert.isFalse(
            success,
            "Should not be able to get the result before the voting ends"
        );
    }
}
