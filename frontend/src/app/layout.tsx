import { Poppins, Roboto_Flex } from "next/font/google";

import { BackButton } from "@/components/BackButton";
import { ColorMode } from "@/components/ColorMode";

import { Providers } from "./providers";

const roboto = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--body-font",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--heading-font",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable}`}>
      <body>
        <Providers>
          <BackButton
            position={{
              base: "fixed",
              "2xl": "sticky",
            }}
            gridColumn={3}
            gridRow={2}
            top={[2, 4, 6, 8]}
            right={2}
            justifySelf="start"
            zIndex={1}
          />
          <main>{children}</main>
          <ColorMode
            position={{
              base: "fixed",
              "2xl": "sticky",
            }}
            gridColumn={3}
            gridRow={2}
            bottom={[2, 4, 6, 8]}
            right={2}
            justifySelf="start"
            alignSelf="end"
            zIndex={1}
          />
        </Providers>
      </body>
    </html>
  );
}
