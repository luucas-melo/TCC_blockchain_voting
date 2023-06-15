"use client";

import { Card, Flex } from "@chakra-ui/react";

import { CreateVotingForm } from "@/components/CreateVotingForm";

const CreateVoting = () => (
  <Flex width="100%" justifyContent="center" alignSelf="center">
    <Card
      gap={6}
      width="100%"
      maxWidth="500px"
      padding={[4, 8, 12]}
      // backgroundColor="whiteAlpha.900"
      // backdropFilter="blur(16px)"
      boxShadow="2xl"
      border="1px solid"
      // borderColor="gray.500"
    >
      <CreateVotingForm />
    </Card>
  </Flex>
);

export default CreateVoting;
