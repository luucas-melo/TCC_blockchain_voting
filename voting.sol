pragma solidity ^0.8.0;
 
contract Voting {
   
    mapping(address => bool) whiteList;
    string public name;
    struct Proposal {
       
        string name;   
        uint voteCount; 
    }

    address public ElectionCommission;
 
    Proposal[] public proposals;

    constructor(string memory name_, string[] memory proposalNames, address[] memory whiteList_) {
        ElectionCommission = msg.sender;
        name = name_;
        for (uint i = 0; i < proposalNames.length; i++) {
            
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }

         for (uint i = 0; i < whiteList_.length; i++) {
            
           whiteList[whiteList_[i]] = false;
        }
    }
    
    
    function addToWhiteList(address voter) public {
        require(
            msg.sender == ElectionCommission,
            "Only ElectionCommission can give right to vote."
        );
        
        if (whiteList[voter] == true ||  whiteList[voter] == false) return;

        whiteList[voter] = false;
       
    }
 

    function vote(uint proposal) public {
        address voter = msg.sender;
        
        require(whiteList[voter] != true || whiteList[voter] != false, "Voter is not elegible");
        require(whiteList[voter] != true, "Voter has already voted");
      
        proposals[proposal].voteCount += 1;
        whiteList[voter] = true;
    }

   
    function getResult() public view
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
