import type { Metadata } from "next";
import "./globals.css";
import VaultToaster from "@verse/vaultoflove-web/components/VaultToaster";


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
