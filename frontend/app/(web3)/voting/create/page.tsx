"use client";

import { Flex } from "@chakra-ui/react";

import { CreateVotingForm } from "@/components/CreateVotingForm";

const CreateVoting = () => (
  <Flex width="100%" justifyContent="center" alignSelf="center">
    <CreateVotingForm />
  </Flex>
);

export default CreateVoting;
