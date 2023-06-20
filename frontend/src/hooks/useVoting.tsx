"use client";

import { ToastId, useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useRef } from "react";
import { KeyedMutator } from "swr";
import Contract from "web3-eth-contract";

import { VotingArtifact } from "@/constants/Voting";
import { formatContractErro } from "@/utils/formatContractErro";

// interface ReturnType {
//   vote: ({ proposalIndex }: { proposalIndex: number }) => () => Promise<void>;
//   startVoting: () => Promise<void>;
// }

export const useVoting = (
  contract: Contract<typeof VotingArtifact.abi>,
  updateContract: KeyedMutator<any>
) => {
  // const {
  //   state: { wallet },
  // } = useMetamask();

  const { account: wallet } = useWeb3React();
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
        from: wallet as string,
      });

      const response = await contract.methods
        .startVoting()
        .send({
          from: wallet as string,
          gas: (gasLimit * BigInt(2)).toString(),
        })
        .on("error", (error) => {
          console.error("error TESTE:", error);

          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "error",
              title: "Não foi possível iniciar votação",
              description: formatContractErro(error as Error),
            });
        })
        .on("transactionHash", (transactionHash) => {
          console.log(`Transaction hash: ${transactionHash}`);
          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "success",
              title: "Transação pendente",
              description: `#${transactionHash}`,
            });
        })
        .on("receipt", (receipt) => {
          console.log("receipt", receipt);
          updateContract();
        })
        .on("confirmation", (confirmation) => {
          console.log("confirmation", confirmation);
        });

      console.log("response", response);
    } catch (e) {
      console.log("error estimateGas", e);
      console.log("CAUSE", e?.cause);
      console.log("JSON", e?.toJSON()?.data?.message);
      if (toastIdRef.current)
        toast.update(toastIdRef.current, {
          status: "error",
          title: "Não foi possível iniciar votação",
          description: formatContractErro(e as Error),
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
              from: wallet as string,
            });

          const response = await contract.methods
            .vote(proposalIndex)
            .send({
              from: wallet as string,
              gas: (gasLimit * BigInt(2)).toString(),
            })
            .on("error", (error) => {
              console.error("error TESTE:", error);

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
              if (toastIdRef.current)
                toast.update(toastIdRef.current, {
                  status: "success",
                  title: "Votação realizada com sucesso!",
                  description: `#${transactionHash}`,
                });
            })
            .on("receipt", (receipt) => {
              console.log("receipt", receipt);
              updateContract();
            })
            .on("confirmation", (confirmation) => {
              console.log("confirmation", confirmation);
            });

          console.log("response", response);
        } catch (e) {
          console.log("error estimateGas", e);

          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "error",
              title: "Erro ao realizar voto",
              description:
                (e as Error)?.message?.split(":")?.[2]?.replace("revert", "") ||
                (e as Error)?.message,
            });
        }
      },
    [contract, toast, updateContract]
  );

  const cancelVoting = useCallback(async () => {
    toastIdRef.current = toast({
      status: "info",
      title: "Processando cancelamento",
      description: "Aguarde a confirmação da transação",
    });

    try {
      const gasLimit = await contract.methods.cancelVoting().estimateGas({
        from: wallet as string,
      });

      const response = await contract.methods
        .cancelVoting()
        .send({
          from: wallet as string,
          gas: (gasLimit * BigInt(2)).toString(),
        })
        .on("error", (error) => {
          console.error("error TESTE:", error);

          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "error",
              title: "Erro ao cancelar votação",
              description: error?.message
                ?.split(":")?.[2]
                ?.replace("revert", ""),
            });
        })
        .on("transactionHash", (transactionHash) => {
          console.log(`Transaction hash: ${transactionHash}`);
          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "success",
              title: "Votação cancelada com sucesso!",
              description: `#${transactionHash}`,
            });
        })
        .on("receipt", (receipt) => {
          console.log("receipt", receipt);
          updateContract();
        })
        .on("confirmation", (confirmation) => {
          console.log("confirmation", confirmation);
        });

      console.log("response", response);
    } catch (e) {
      console.error("error estimateGas", e);

      if (toastIdRef.current)
        toast.update(toastIdRef.current, {
          status: "error",
          title: "Erro ao cancelar votação",
          description:
            (e as Error)?.message?.split(":")?.[2]?.replace("revert", "") ||
            (e as Error)?.message,
        });
    }
  }, [contract, toast, updateContract]);

  return {
    startVoting,
    vote,
    cancelVoting,
  };
};
