// app/layout.tsx
import { BackButton } from "@/components/BackButton";

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
