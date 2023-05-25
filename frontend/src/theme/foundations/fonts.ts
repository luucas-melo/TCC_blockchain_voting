import { Poppins, Roboto_Flex } from 'next/font/google';
import { Theme } from '@chakra-ui/react';

const roboto = Roboto_Flex({
	subsets: ['latin'],
	display: 'swap',
});

const poppins = Poppins({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	display: 'swap',
});

export const fonts = {
	body: roboto.style.fontFamily,
	heading: poppins.style.fontFamily,
} as Theme['fonts'];
