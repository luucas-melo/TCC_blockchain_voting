// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>ROOT LAYOUT</h1>
        <br />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
