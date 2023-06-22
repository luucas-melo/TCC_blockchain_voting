interface Voting {
  title: string;
  proposals: string[];
  whiteList: string[];
  deadline: number;
}

type RegisterVotingValues = {
  title: string;
  proposals: string;
  whiteList: string;
  deadline: string;
};
