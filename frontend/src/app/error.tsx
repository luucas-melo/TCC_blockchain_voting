'use client';

import { useCallback, useEffect } from 'react';
import { Button, Center, Heading, VStack } from '@chakra-ui/react';
import { useSWRConfig } from 'swr';

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	const { mutate } = useSWRConfig();

	useEffect(() => {
		// Log the error to an error reporting service
		console.groupCollapsed('ErrorBoundary');
		console.error(error);
		console.groupEnd();
	}, [error]);

	const retry = useCallback(() => {
		// Clear the SWR cache
		mutate(
			(key) => true, // which cache keys are updated
			undefined, // update cache data to `undefined`
			{ revalidate: false } // do not revalidate
		);

		reset();
	}, [mutate, reset]);

	return (
		<Center minBlockSize="100vh">
			<VStack spacing={8}>
				<Heading>Something went wrong!</Heading>
				<Button
					size="lg"
					onClick={
						// Attempt to recover by trying to re-render the segment
						retry
					}
				>
					Try again
				</Button>
			</VStack>
		</Center>
	);
}
