"use client";

import { Icon, IconButton, IconButtonProps } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";

interface BackButtonProps extends Partial<IconButtonProps> {}

export function BackButton(props: BackButtonProps) {
  const router = useRouter();

  return (
    <IconButton
      aria-label="go-back"
      onClick={router.back}
      icon={<Icon as={TiArrowBack} boxSize={7} />}
      size="md"
      colorScheme="cyan"
      {...props}
    />
  );
}
