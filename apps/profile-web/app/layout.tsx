import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Web3Provider } from "@verse/providers/index";

export const metadata: Metadata = {
  title: "Verse Profile",
  description: "The Identity Hub for the 4lph4Verse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-black`}
      >
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
