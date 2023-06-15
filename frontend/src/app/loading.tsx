"use client";

import {
  Center,
  CircularProgress,
  CircularProgressLabel,
  Icon,
} from "@chakra-ui/react";
import { SiSolidity } from "react-icons/si";

export default function Loading() {
  return (
    <Center justifyContent="center" alignItems="center" minBlockSize="100vh">
      <CircularProgress
        isIndeterminate
        size="240px"
        color="cyan.500"
        thickness="8px"
      />
      <CircularProgressLabel>
        <Icon as={SiSolidity} boxSize={16} color="cyan.500" />
      </CircularProgressLabel>
    </Center>
  );
}
