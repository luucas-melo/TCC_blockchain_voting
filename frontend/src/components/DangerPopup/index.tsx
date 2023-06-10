import {
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverProps,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactElement, useCallback, useState } from "react";
import { IoWarning } from "react-icons/io5";

import { useTimeout } from "@/hooks/useTimeout";

interface DangerPopupProps extends Partial<PopoverProps> {
  message: string;
  onConfirm: () => void | Promise<void>;
  children: ReactElement;
}

export function DangerPopup(props: DangerPopupProps) {
  const { message, onConfirm, children, ...popoverProps } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState(true);

  useTimeout(() => setIsLoading(false), isOpen ? 1750 : null);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onClose();
  }, [onClose, onConfirm]);

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="auto"
      {...popoverProps}
    >
      <PopoverTrigger>{children}</PopoverTrigger>

      <Portal>
        <PopoverContent borderRadius="base" boxShadow="2xl">
          <PopoverArrow />
          <PopoverCloseButton top={2.5} right={2} />

          <PopoverHeader borderTopRadius="base">
            <HStack>
              <Icon as={IoWarning} color="yellow.400" fontSize="2xl" />
              <Heading size="md" fontWeight="semibold">
                Atenção!
              </Heading>
            </HStack>
          </PopoverHeader>

          <PopoverBody textAlign="center" fontSize="md">
            <Text fontWeight="medium">{message}</Text>

            <Text color="gray.200" mt={2}>
              Está ação não poderá ser desfeita.
            </Text>
          </PopoverBody>

          <PopoverFooter borderBottomRadius="base">
            <ButtonGroup
              size="sm"
              display="flex"
              justifyContent="space-between"
            >
              <Button
                variant="ghost"
                colorScheme="whiteAlpha"
                color="white"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                variant="solid"
                colorScheme="red"
                onClick={handleConfirm}
                isLoading={isLoading}
              >
                Confirmar
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
