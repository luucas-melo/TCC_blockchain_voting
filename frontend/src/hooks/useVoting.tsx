import { ToastId, useToast } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { KeyedMutator } from "swr";
import Contract from "web3-eth-contract";

import { useMetamask } from "./useMetamask";

interface ReturnType {
  vote: ({ proposalIndex }: { proposalIndex: number }) => () => Promise<void>;
  startVoting: () => Promise<void>;
}

export const useVoting = (
  contract: Contract,
  updateContract: KeyedMutator<any>
): ReturnType => {
  const {
    state: { wallet },
  } = useMetamask();

  const toastIdRef = useRef<ToastId>();
  const toast = useToast();
  const startVoting = useCallback(async () => {
    toastIdRef.current = toast({
      status: "info",
      title: "Iniciando votação",
      description: "Aguarde a confirmação da transação",
    });

    try {
      const gasLimit = await contract.methods.startVoting().estimateGas({
        from: wallet,
      });

      const response = await contract.methods
        .startVoting()
        .send({ from: wallet, gas: (gasLimit * 1.5).toFixed(0) })
        .on("error", (error, receipt) => {
          console.error("error TESTE:", error);
          console.log("receipt", receipt);

          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "error",
              title: "Erro ao inicar votação",
              description: error?.message
                ?.split(":")?.[2]
                ?.replace("revert", ""),
            });
        })
        .on("transactionHash", (transactionHash) => {
          console.log(`Transaction hash: ${transactionHash}`);
          updateContract();
          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "success",
              title: "Votação iniciada!",
              description: `#${transactionHash}`,
            });
        })
        .on("receipt", (receipt) => {
          console.log("receipt", receipt);
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          console.log("confirmation", confirmationNumber, receipt);
        });

      console.log("response", response);
    } catch (e) {
      console.log("error estimateGas", e);

      if (toastIdRef.current)
        toast.update(toastIdRef.current, {
          status: "error",
          title: "Erro ao inicar votação",
          description: (e as Error)?.message,
        });
    }
  }, [contract, toast, updateContract, wallet]);

  const vote = useCallback(
    ({ proposalIndex }: { proposalIndex: number }) =>
      async () => {
        toastIdRef.current = toast({
          status: "info",
          title: "Computando voto",
          description: "Aguarde a confirmação da transação",
        });

        try {
          const gasLimit = await contract.methods
            .vote(proposalIndex)
            .estimateGas({
              from: wallet,
            });

          const response = await contract.methods
            .vote(proposalIndex)
            .send({ from: wallet, gas: (gasLimit * 1.5).toFixed(0) })
            .on("error", (error, receipt) => {
              console.error("error TESTE:", error);
              console.log("receipt", receipt);

              if (toastIdRef.current)
                toast.update(toastIdRef.current, {
                  status: "error",
                  title: "Erro ao realizar voto",
                  description: error?.message
                    ?.split(":")?.[2]
                    ?.replace("revert", ""),
                });
            })
            .on("transactionHash", (transactionHash) => {
              console.log(`Transaction hash: ${transactionHash}`);
              updateContract();
              if (toastIdRef.current)
                toast.update(toastIdRef.current, {
                  status: "success",
                  title: "Votação realizada com sucesso!",
                  description: `#${transactionHash}`,
                });
            })
            .on("receipt", (receipt) => {
              console.log("receipt", receipt);
            })
            .on("confirmation", (confirmationNumber, receipt) => {
              console.log("confirmation", confirmationNumber, receipt);
            });

          console.log("response", response);
        } catch (e) {
          console.log("error estimateGas", e);

          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "error",
              title: "Erro ao realizar voto",
              description: (e as Error)?.message,
            });
        }
      },
    [contract, toast, updateContract, wallet]
  );

  return {
    startVoting,
    vote,
  };
};
