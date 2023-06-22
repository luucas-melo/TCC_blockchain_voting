"use client";

import { Heading } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function EditVoting() {
  const router = useRouter();

  const { account: wallet } = useWeb3React();

  const formMethods = useForm<RegisterVotingValues>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formMethods;

  return <Heading color="red">EDIT PAGE</Heading>;
}
