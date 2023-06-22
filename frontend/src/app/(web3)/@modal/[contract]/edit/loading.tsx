"use client";

import {
  Center,
  CircularProgress,
  CircularProgressLabel,
  Icon,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { SiSolidity } from "react-icons/si";

export default function Loading() {
  return (
    <Modal isOpen isCentered onClose={() => {}}>
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent background="transparent" boxShadow="none">
        <Center>
          <CircularProgress
            isIndeterminate
            size="120px"
            color="cyan.500"
            thickness="4px"
          />
          <CircularProgressLabel>
            <Icon as={SiSolidity} boxSize={10} color="cyan.500" />
          </CircularProgressLabel>
        </Center>
      </ModalContent>
    </Modal>
  );
}
