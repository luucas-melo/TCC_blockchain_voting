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
          {/* <BackButton
            // position={{
            // base: "fixed",
            // lg: "sticky",
            // }}
            // position="sticky"
            position="fixed"
            // gridColumn={1}
            // gridRow={1}
            top={5}
            left={[4, 6, 8]}
            justifySelf="center"
            zIndex="sticky"
          /> */}
          <main>
            <BackButton
              position="sticky"
              gridColumn={1}
              gridRow={1}
              top={5}
              left={[4, 6, 8]}
              justifySelf="end"
              zIndex="sticky"
            />
            {children}
          </main>
          <ColorMode
            // position={{
            //   base: "fixed",
            //   lg: "sticky",
            // }}
            position="fixed"
            // gridColumn={3}
            justifySelf="center"
            alignSelf="end"
            bottom={5}
            right={5}
            zIndex="sticky"
          />
        </Providers>
      </body>
    </html>
  );
}
