import { Poppins, Roboto_Flex } from "next/font/google";

import { BackButton } from "@/components/BackButton";

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
          <main>
            <BackButton
              position={{
                base: "sticky",
              }}
              gridColumn={1}
              gridRow={1}
              top={[4, 6, 8]}
              left={[4, 6, 8]}
              justifySelf="center"
              variant={{
                base: "solid",
                xl: "solid",
              }}
              zIndex="sticky"
            />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
