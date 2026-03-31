import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "./providers";

export const metadata: Metadata = {
  title: "De Vertrouwensbarometer 🌡️",
  description: "Hoeveel vertrouwen heeft Nederland nog? Stem mee!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Boogaloo&family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0a0a1a] text-white font-boogaloo">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
