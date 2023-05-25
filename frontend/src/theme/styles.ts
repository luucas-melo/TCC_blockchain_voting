import type { StyleFunctionProps, Theme } from '@chakra-ui/react';
// import { mode } from '@chakra-ui/theme-tools'

export const styles: Theme['styles'] = {
	global: (props: StyleFunctionProps) => ({
		body: {},
		main: {
			// Full Bleed layout
			display: 'grid',
			gridTemplateColumns:
				'minmax(0, 1fr) min(1024px, calc(100% - (2*var(--chakra-space-4)))) minmax(0, 1fr)',
			gap: '4',
			minBlockSize: '100vh',
			'> *': {
				gridColumn: 2,
			},
		},
	}),
};
