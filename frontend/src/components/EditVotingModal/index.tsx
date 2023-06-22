"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ToastId,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";

import { VotingForm } from "@/components/VotingForm";
import { useVoting } from "@/hooks/useVoting";
import { VotingContract } from "@/lib/contracts";
import { formatContractError } from "@/utils/formatContractError";

interface EditVotingModalProps {
  // contract: Contract<typeof VotingArtifact.abi>;
  contractAddress: string;
  defaultValues: Partial<RegisterVotingValues>;
}

export function EditVotingModal(props: EditVotingModalProps) {
  const { contractAddress, defaultValues } = props;
  const contract = useRef(VotingContract(contractAddress));

  const router = useRouter();

  const { account: wallet } = useWeb3React();

  // const { mutate: globalMutate } = useSWRConfig();

  // const {
  //   data: voting,
  //   isLoading,
  //   mutate,
  // } = useSWR(
  //   contract?.current?.options?.address,
  //   getContractData(contract?.current)
  // );

  const {
    editVoting,
    data: voting,
    isLoading,
    mutate,
  } = useVoting(contract?.current);

  const formMethods = useForm<RegisterVotingValues>({
    mode: "onChange",
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formMethods;

  const toast = useToast();
  const toastIdRef = useRef<ToastId>();

  const onSubmit = useCallback(
    async (data: RegisterVotingValues) => {
      const title = data?.title;
      const proposals = data?.proposals.split("\n");
      const whiteList = data?.whiteList.split("\n");

      const duration = new Date(data?.deadline);
      const deadline = Math.floor(duration.getTime() / 1000); // unix timestamp

      try {
        const res = await editVoting({
          title,
          proposals,
          whiteList,
          deadline,
        });

        console.log("onSubmit res:", res);

        // mutate([wallet, "votings"]);
        // mutate([wallet, "allVotings"]);
        mutate();

        // reset();
      } catch (error) {
        console.error("onSubmit:", error);
        toast({
          status: "error",
          title: "Algo deu errado",
          description: formatContractError(error as Error),
        });
      }
    },
    [editVoting, mutate, toast]
  );

  return (
    <Modal isOpen onClose={router.back}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Votação</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" id="voting-form" onSubmit={handleSubmit(onSubmit)}>
          <VotingForm {...formMethods} />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={router.back}>
            Cancelar
          </Button>
          <Button type="submit" form="voting-form" size="lg">
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
