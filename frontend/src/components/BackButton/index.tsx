"use client";

import { Icon, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";

export function BackButton() {
  const router = useRouter();

  return (
    <IconButton
      aria-label="go-back"
      position="absolute"
      top={5}
      right={5}
      onClick={router.back}
      icon={<Icon as={TiArrowBack} />}
      variant="outline"
      size="lg"
      colorScheme=""
    />
  );
}
