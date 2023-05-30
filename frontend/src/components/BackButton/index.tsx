"use client";

import {
  Icon,
  IconButton,
  IconButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";

interface BackButtonProps extends Partial<IconButtonProps> {}

export function BackButton(props: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const color = useColorModeValue("blackAlpha", "whiteAlpha");
  const variant = useColorModeValue("outline", "solid");

  if (pathname === "/") return null;

  return (
    <IconButton
      aria-label="go-back"
      onClick={router.back}
      icon={<Icon as={TiArrowBack} boxSize={7} />}
      size="md"
      colorScheme={color}
      variant={variant}
      {...props}
    />
  );
}
