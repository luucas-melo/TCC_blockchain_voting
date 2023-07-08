const Voting = artifacts.require('Voting');

contract('Voting', (accounts) => {
  let votingInstance;

  beforeEach(async () => {
    votingInstance = await Voting.new(
      accounts[0],
      'Election Title',
      ['Proposal 1', 'Proposal 2', 'Proposal 3'],
      [accounts[1], accounts[2], accounts[3]],
      3600
    );
  });

  it('should add addresses to the whitelist', async () => {
    const voter = accounts[4];

    await votingInstance.addToWhiteList(voter);
    const isWhiteListed = await votingInstance.getExists(voter);

    assert.isTrue(isWhiteListed, 'Address was not added to the whitelist');
  });

  it('should remove addresses from the whitelist', async () => {
    const voter = accounts[2];

    await votingInstance.removeFromWhiteList(voter);
    const isWhiteListed = await votingInstance.getExists(voter);

    assert.isFalse(isWhiteListed, 'Address was not removed from the whitelist');
  });

  it('should return the list of proposals', async () => {
    const expectedProposals = ['Proposal 1', 'Proposal 2', 'Proposal 3'];

    const proposals = await votingInstance.getProposals();

    assert.deepEqual(proposals, expectedProposals, 'Incorrect list of proposals');
  });

  it('should return the list of whitelisted addresses', async () => {
    const expectedAddresses = [accounts[1], accounts[2], accounts[3]];

    const addresses = await votingInstance.getWhiteListedAddresses();

    assert.deepEqual(addresses, expectedAddresses, 'Incorrect list of whitelisted addresses');
  });

  it('should edit the name of a proposal', async () => {
    const proposalIndex = 0;
    const newProposalName = 'Updated Proposal';

    await votingInstance.editProposal(proposalIndex, newProposalName);
    const proposals = await votingInstance.getProposals();

    assert.equal(proposals[proposalIndex], newProposalName, 'Proposal name was not updated');
  });

  it('should add a new proposal', async () => {
    const newProposalName = 'New Proposal';

    await votingInstance.addProposal(newProposalName);
    const proposals = await votingInstance.getProposals();
    const lastProposal = proposals[proposals.length - 1];

    assert.equal(lastProposal, newProposalName, 'New proposal was not added');
  });

  it('should edit the title of the voting', async () => {
    const newTitle = 'New Election Title';

    await votingInstance.editTitle(newTitle);
    const title = await votingInstance.title();

    assert.equal(title, newTitle, 'Title was not updated');
  });

  it('should edit the duration of the voting', async () => {
    const newDuration = 7200;

    await votingInstance.editDeadline(newDuration);
    const duration = await votingInstance.votingDuration();

    assert.equal(duration, newDuration, 'Voting duration was not updated');
  });

  it('should vote for a proposal', async () => {
    const voter = accounts[4];
    const proposalIndex = 1;

    await votingInstance.addToWhiteList(voter);
    await votingInstance.startVoting({ from: accounts[0] });
    await votingInstance.vote(proposalIndex, { from: voter });

    const voteCounts = await votingInstance.getResult();

    assert.equal(voteCounts[proposalIndex], 1, 'Vote count was not updated');
  });

  it('should not allow voting for non-whitelisted addresses', async () => {
    const voter = accounts[5];
    const proposalIndex = 0;

    await votingInstance.startVoting({ from: accounts[0] });

    try {
      await votingInstance.vote(proposalIndex, { from: voter });
      assert.fail('Voting should not be allowed for non-whitelisted addresses');
    } catch (error) {
      assert.include(error.message, 'You are not allowed to vote', 'Incorrect error message');
    }
  });

  it('should not allow voting multiple times from the same address', async () => {
    const voter = accounts[4];
    const proposalIndex = 2;

    await votingInstance.addToWhiteList(voter);
    await votingInstance.startVoting({ from: accounts[0] });
    await votingInstance.vote(proposalIndex, { from: voter });

    try {
      await votingInstance.vote(proposalIndex, { from: voter });
      assert.fail('Voting should not be allowed multiple times from the same address');
    } catch (error) {
      assert.include(error.message, 'You have already voted', 'Incorrect error message');
    }
  });

  it('should start the voting', async () => {
    await votingInstance.startVoting({ from: accounts[0] });
    const votingStarted = await votingInstance.votingStarted();

    assert.isTrue(votingStarted, 'Voting did not start');
  });

  it('should end the voting', async () => {
    await votingInstance.endVoting({ from: accounts[0] });
    const votingEnded = await votingInstance.votingEnded();

    assert.isTrue(votingEnded, 'Voting did not end');
  });

  it('should cancel the voting', async () => {
    await votingInstance.cancelVoting({ from: accounts[0] });
    const votingCancelled = await votingInstance.votingCancelled();

    assert.isTrue(votingCancelled, 'Voting was not cancelled');
  });

  it('should return the correct voting status', async () => {
    const isOpen = await votingInstance.getIsOpen();

    assert.isFalse(isOpen, 'Incorrect voting status');
  });

  it('should return the result of the voting', async () => {
    const proposalIndex = 1;
    const expectedVoteCount = 2;

    await votingInstance.addToWhiteList(accounts[4]);
    await votingInstance.addToWhiteList(accounts[5]);
    await votingInstance.startVoting({ from: accounts[0] });

    await votingInstance.vote(proposalIndex, { from: accounts[4] });
    await votingInstance.vote(proposalIndex, { from: accounts[5] });

    const voteCounts = await votingInstance.getResult();

    assert.equal(voteCounts[proposalIndex], expectedVoteCount, 'Incorrect vote count');
  });
});
