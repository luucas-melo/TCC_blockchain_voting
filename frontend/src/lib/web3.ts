import Web3 from "web3";

export const web3 = new Web3(
  Web3.givenProvider || process.env.NEXT_PUBLIC_WEB3_PROVIDER_URL
);
