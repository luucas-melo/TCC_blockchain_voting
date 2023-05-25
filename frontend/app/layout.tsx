// app/layout.tsx
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
        <main>
          <Providers>
            {children}
            <BackButton />
          </Providers>
        </main>
      </body>
    </html>
  );
}
