import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VaultToaster from "@verse/vaultoflove-web/components/VaultToaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vault of Love",
  description: "Your Story, Your Legacy, Your Vault of Love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body      >
        <VaultToaster>
        {children}
        </VaultToaster>
      </body>
    </html>
  );
}
