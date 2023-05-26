interface Voting {
  title: string;
  proposals: string[];
  whiteList: string[];
  deadline: number;
}

interface RegisterVoting {
  title: string;
  proposals: string;
  whiteList: string;
  deadline: string;
}
