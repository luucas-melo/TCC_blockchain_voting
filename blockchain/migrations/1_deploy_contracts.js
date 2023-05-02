const Voting = artifacts.require('Voting');

module.exports = function (deployer) {
  deployer.deploy(Voting, 'votacao', ['a', 'b'], []);
};
