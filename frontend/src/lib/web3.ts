import Web3 from "web3";

export const web3 = new Web3(process.env.NEXT_PUBLIC_WEB3_PROVIDER_URL);

export const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    window.web3 = new Web3(window.ethereum);

    return true;
  }

  return false;
};
