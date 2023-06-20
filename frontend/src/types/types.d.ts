type InjectedProviders = {
  isMetaMask?: true;
};

type Web3 = import("web3").default;

interface Window {
  ethereum: InjectedProviders & {
    on: (...args: any[]) => void;
    removeListener: (...args: any[]) => void;
    removeAllListeners: (...args: any[]) => void;
    request<T = any>(args: any): Promise<T>;
  };
  web3: Web3;
}
