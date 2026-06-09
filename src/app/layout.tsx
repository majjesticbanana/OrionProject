import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nueva — Class 10S4",
  description: "Nueva — a student workshop from class 10S4. We design and build our own tech, games, and an arcade caf\u00e9 where people gather to play and connect.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Spline+Sans+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
