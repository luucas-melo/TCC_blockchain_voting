"use client";

import {
  Button,
  Heading,
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
import { useSWRConfig } from "swr";

import { VotingForm } from "@/components/VotingForm";
import { useVoting } from "@/hooks/useVoting";
import { VotingContract } from "@/lib/contracts";
import { formatContractError } from "@/utils/formatContractError";

export default function EditVoting({
  params,
}: {
  params: { contract: string };
}) {
  const { contract } = params;

  const router = useRouter();

  const { account: wallet } = useWeb3React();
  const { mutate } = useSWRConfig();

  const { editVoting } = useVoting(VotingContract(contract));

  const formMethods = useForm<RegisterVotingValues>({
    mode: "onChange",
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

        mutate([wallet, "votings"]);
        mutate([wallet, "allVotings"]);

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
    [editVoting, mutate, wallet, toast]
  );

  return (
    <>
      <Heading color="red">EDIT MODAL</Heading>
      <Modal isOpen onClose={router.back}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Votação</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            as="form"
            id="voting-form"
            onSubmit={handleSubmit(onSubmit)}
          >
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
    </>
  );
}
