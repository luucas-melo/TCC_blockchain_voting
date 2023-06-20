// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.0 to v0.9.0
pragma solidity ^0.8.0;

contract Voting {
    string public title;

    mapping(address => uint) whiteList;
    mapping(address => bool) exists;

    address[] public whiteListedAddresses;

    struct Proposal {
        string name;
        uint voteCount;
    }
    Proposal[] public proposals;

    uint256 public votingDuration;
    uint256 public votingStartTime;
    bool public votingEnded; // Stores whether the voting has ended or not
    bool public votingStarted; // Stores whether the voting has started or not
    bool public votingCancelled; // Stores whether the voting has been cancelled or not

    address public electionCommission;

    constructor(
        address _electionCommission,
        string memory _title,
        string[] memory _proposals,
        address[] memory _whiteList,
        uint256 duration
    ) {
        electionCommission = _electionCommission;
        title = _title;
        votingDuration = duration;
        votingEnded = false;
        votingStarted = false;

        for (uint i = 0; i < _proposals.length; i++) {
            proposals.push(Proposal({name: _proposals[i], voteCount: 0}));
        }

        for (uint i = 0; i < _whiteList.length; i++) {
            whiteList[_whiteList[i]] = 1;
            exists[_whiteList[i]] = true;
            whiteListedAddresses.push(_whiteList[i]);
        }
    }

    modifier onlyElectionCommission() {
        require(
            msg.sender == electionCommission,
            "Only Election Commission can give right to vote."
        );
        _;
    }

    modifier onlyBeforeStart() {
        require(votingStarted == false, "Voting has already started.");
        _;
    }

    modifier onlyBeforeVotingEnd() {
        require(
            block.timestamp < (votingStartTime + votingDuration),
            "Voting has already ended."
        );
        _;
    }

    modifier onlyAfterVotingEnd() {
        require(block.timestamp > votingDuration, "Voting has not ended yet.");
        _;
    }

    modifier OnlyVotingIsOpen() {
        require(votingStarted == true, "Voting has not started yet.");
        require(votingEnded == false, "Voting has already ended.");
        require(votingCancelled == false, "Voting has been cancelled.");
        _;
    }

    modifier onlyWhiteListed() {
        require(
            exists[msg.sender] == true,
            "You are not allowed to vote in this election."
        );
        _;
    }

    modifier onlyOnce() {
        require(
            whiteList[msg.sender] > 0,
            "You have already voted in this election."
        );
        _;
    }

    function getExists(address key) public view returns (bool) {
        return exists[key];
    }

    function addToWhiteList(
        address voter
    ) public onlyElectionCommission onlyBeforeStart onlyBeforeVotingEnd {
        if (exists[voter]) return;

        whiteList[voter] = 1;
        whiteListedAddresses.push(voter);
        exists[voter] = true;
    }

    function removeFromWhiteList(
        address voter
    ) public onlyElectionCommission onlyBeforeStart onlyBeforeVotingEnd {
        if (!exists[voter]) return;

        whiteList[voter] = 0;
        exists[voter] = false;
    }

    function getProposals() public view returns (string[] memory) {
        uint arrayLength = proposals.length;

        string[] memory proposalNames = new string[](arrayLength);

        for (uint i = 0; i < arrayLength; i++) {
            proposalNames[i] = proposals[i].name;
        }

        return proposalNames;
    }

    function getWhiteListedAddresses() public view returns (address[] memory) {
        uint arrayLength = whiteListedAddresses.length;

        address[] memory addresses = new address[](arrayLength);

        for (uint i = 0; i < arrayLength; i++) {
            addresses[i] = whiteListedAddresses[i];
        }

        return addresses;
    }

    function editProposal(
        uint proposal,
        string memory newName
    ) public onlyElectionCommission onlyBeforeStart onlyBeforeVotingEnd {
        proposals[proposal].name = newName;
    }

    function addProposal(
        string memory newName
    ) public onlyElectionCommission onlyBeforeStart onlyBeforeVotingEnd {
        proposals.push(Proposal({name: newName, voteCount: 0}));
    }

    function editTitle(
        string memory newTitle
    ) public onlyElectionCommission onlyBeforeStart onlyBeforeVotingEnd {
        title = newTitle;
    }

    function editDeadline(
        uint256 newDeadline
    ) public onlyElectionCommission onlyBeforeStart onlyBeforeVotingEnd {
        votingDuration = newDeadline;
    }

    function vote(
        uint proposal
    ) public OnlyVotingIsOpen onlyWhiteListed onlyBeforeVotingEnd onlyOnce {
        address voter = msg.sender;
        // require(exists[voter] == true, "You are not allowed to vote");
        // require(whiteList[voter] > 0, "You have already voted");

        uint voteWeight = whiteList[voter];

        proposals[proposal].voteCount += voteWeight;
        whiteList[voter] = 0;
    }

    function getIsWhiteListed(address key) external view returns (bool) {
        return exists[key];
    }

    function startVoting()
        public
        onlyBeforeStart
        onlyElectionCommission
        onlyBeforeVotingEnd
    {
        require(votingCancelled == false, "Voting has been cancelled.");
        votingStartTime = block.timestamp;
        votingStarted = true;
    }

    function endVoting() public onlyElectionCommission onlyBeforeVotingEnd {
        votingEnded = true;
    }

    function getIsOpen() public view returns (bool) {
        return
            votingEnded == false &&
            votingStarted == true &&
            votingCancelled == false;
    }

    function cancelVoting() public onlyElectionCommission onlyBeforeVotingEnd {
        require(votingCancelled == false, "Voting has already been cancelled.");
        votingCancelled = true;
    }

    function getResult()
        external
        view
        onlyAfterVotingEnd
        returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }
}
