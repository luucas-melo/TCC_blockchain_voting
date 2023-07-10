"use client";

import { Link, ToastId, useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useRef, useState } from "react";
import useSWR from "swr";
import Contract from "web3-eth-contract";

import { TransactionPendingToast } from "@/components/TransationPendingToast";
import { VotingArtifact } from "@/constants/Voting";
import { getContractData } from "@/lib/contracts";
import { formatContractError } from "@/utils/formatContractError";

export const useVoting = (contract: Contract<typeof VotingArtifact.abi>) => {
  const { account: wallet } = useWeb3React();

  const [result, setResult] = useState<number[] | string>();
  const toastIdRef = useRef<ToastId>();
  const toast = useToast();

  const votingData = useSWR(
    contract?.options?.address,
    getContractData(contract)
  );

  const startVoting = useCallback(async () => {
    console.group("START VOTING");
    toastIdRef.current = toast({
      status: "info",
      title: "Iniciando votação",
      description: "Por favor, confirme a transação na sua carteira",
      duration: null,
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
          console.log(".on ~ error:", error);

          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "error",
              title: "Não foi possível iniciar votação",
              description: formatContractError(error as Error),
            });
        })
        .on("transactionHash", (transactionHash) => {
          console.log(`Transaction hash: ${transactionHash}`);
          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              render: (props) => (
                <TransactionPendingToast
                  transactionHash={transactionHash}
                  {...props}
                />
              ),
            });
        })
        .on("receipt", (receipt) => {
          console.log("receipt", receipt);
        })
        .on("confirmation", (confirmation) => {
          console.log("confirmation", confirmation);
          votingData?.mutate?.();
          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "success",
              title: "Votação iniciada com sucesso!",
              description: (
                <Link
                  // color="white"
                  href={`https://sepolia.etherscan.io/tx/${confirmation.receipt.transactionHash}`}
                  target="_blank"
                >
                  Clique aqui para visualizar bloco na blockchain
                </Link>
              ),
              isClosable: true,
            });
        });

      console.log("response", response);
    } catch (e) {
      console.log("startVoting ~ e:", e);
      if (toastIdRef.current)
        toast.update(toastIdRef.current, {
          status: "error",
          title: "Não foi possível iniciar votação",
          description: formatContractError(e as Error),
        });
    }

    console.groupEnd();
  }, [contract, toast, wallet]);

  const vote = useCallback(
    ({ proposalIndex }: { proposalIndex: number }) =>
      async () => {
        toastIdRef.current = toast({
          status: "info",
          title: "Processando voto",
          description: "Por favor, confirme a transação na sua carteira",
          duration: null,
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
                  render: (props) => (
                    <TransactionPendingToast
                      transactionHash={transactionHash}
                      {...props}
                    />
                  ),
                });
            })
            .on("receipt", (receipt) => {
              console.log("receipt", receipt);
              votingData?.mutate?.();
            })
            .on("confirmation", (confirmation) => {
              console.log("confirmation", confirmation);
              if (toastIdRef.current)
                toast.update(toastIdRef.current, {
                  status: "success",
                  title: "Voto realizado com sucesso!",
                  description: (
                    <Link
                      // color="white"
                      href={`https://sepolia.etherscan.io/tx/${confirmation.receipt.transactionHash}`}
                      target="_blank"
                    >
                      Clique aqui para visualizar seu voto na blockchain
                    </Link>
                  ),
                });
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
    [contract, toast, votingData, wallet]
  );

  const editVoting = useCallback(
    async (data: Voting) => {
      console.group("EDIT VOTING");

      try {
        toastIdRef.current = toast({
          status: "info",
          title: "Editando votação",
          description: "Por favor, confirme a transação na sua carteira",
          duration: null,
        });

        const gasLimit = await contract.methods
          .editVoting(data.title, data.proposals, data.whiteList, data.deadline)
          .estimateGas({
            from: wallet as string,
          });

        const response = await contract.methods
          .editVoting(data.title, data.proposals, data.whiteList, data.deadline)
          .send({
            from: wallet as string,
            gas: (gasLimit * BigInt(2)).toString(),
          })
          .on("error", (error) => {
            if (toastIdRef.current)
              toast.update(toastIdRef.current, {
                status: "error",
                title: "Não foi possível editar a votação",
                description: formatContractError(error),
              });
          })
          .on("transactionHash", (transactionHash) => {
            console.log(`Transaction hash: ${transactionHash}`);
            if (toastIdRef.current)
              toast.update(toastIdRef.current, {
                render: (props) => (
                  <TransactionPendingToast
                    transactionHash={transactionHash}
                    {...props}
                  />
                ),
              });
          })
          .on("receipt", (receipt) => {
            console.log("receipt", receipt);
            votingData?.mutate?.();
          })
          .on("confirmation", (confirmation) => {
            console.log("confirmation", confirmation);
            if (toastIdRef.current)
              toast.update(toastIdRef.current, {
                status: "success",
                title: "Votação editada com sucesso!",
                description: (
                  <Link
                    // color="white"
                    href={`https://sepolia.etherscan.io/tx/${confirmation.receipt.transactionHash}`}
                    target="_blank"
                  >
                    Clique aqui para visualizar bloco na blockchain
                  </Link>
                ),
              });
          });

        console.log("response", response);
      } catch (e) {
        console.log("error estimateGas", e);

        if (toastIdRef.current)
          toast.update(toastIdRef.current, {
            status: "error",
            title: "Não foi possível editar a votação",
            description: formatContractError(e),
          });
      }

      console.groupEnd();
    },
    [contract, toast, votingData, wallet]
  );

  type PromiseResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

  const getVotingWinner = useCallback(
    (votingResult: PromiseResult<number[]>) => {
      if (votingResult?.status === "fulfilled") {
        const votings = votingResult?.value?.map((item) => Number(item));
        const winner = Math.max(...votings);

        return votings.indexOf(winner);
      }

      return NaN;
    },
    []
  );

  const cancelVoting = useCallback(async () => {
    toastIdRef.current = toast({
      status: "info",
      title: "Cancelando votação",
      description: "Por favor, confirme a transação na sua carteira",
      duration: null,
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
              render: (props) => (
                <TransactionPendingToast
                  transactionHash={transactionHash}
                  {...props}
                />
              ),
            });
        })
        .on("receipt", (receipt) => {
          console.log("receipt", receipt);
          votingData?.mutate?.();
        })
        .on("confirmation", (confirmation) => {
          console.log("confirmation", confirmation);
          if (toastIdRef.current)
            toast.update(toastIdRef.current, {
              status: "success",
              title: "Votação cancelada com sucesso!",
              description: (
                <Link
                  // color="white"
                  href={`https://sepolia.etherscan.io/tx/${confirmation.receipt.transactionHash}`}
                  target="_blank"
                >
                  Clique aqui para visualizar bloco na blockchain
                </Link>
              ),
              isClosable: true,
            });
        });

      console.log("response", response);
    } catch (e) {
      if (toastIdRef.current)
        toast.update(toastIdRef.current, {
          status: "error",
          title: "Erro ao cancelar votação",
          description: formatContractError(e),
        });
    }
  }, [contract, toast, votingData, wallet]);

  return {
    ...votingData,
    startVoting,
    vote,
    cancelVoting,
    editVoting,
    getVotingWinner,
  };
};
