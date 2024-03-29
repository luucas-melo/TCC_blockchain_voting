"use client";

import { Button, Center, Heading, VStack } from "@chakra-ui/react";
import { useEffect } from "react";

/**
 * Global-error.js replaces the root layout.js when active and so must define
 * its own <html> and <body> tags.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.groupCollapsed("GlobalErrorBoundary");
    console.error(error);
    console.groupEnd();
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Center minBlockSize="100%">
          <VStack spacing={8}>
            <Heading>Something went wrong!</Heading>
            <Button
              size="lg"
              onClick={
                // Attempt to recover by trying to re-render the segment
                reset
              }
            >
              Try again
            </Button>
          </VStack>
        </Center>
      </body>
    </html>
  );
}
