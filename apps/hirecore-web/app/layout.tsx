"use client";

import { Geist, Geist_Mono } from "next/font/google";
import ConnectWalletButton from "@verse/sdk/ConnectWalletButton";
import { workerNavItems, clientNavItems } from "../components/navItems";
import { useState } from "react";
import "./globals.css";
import { Web3Provider } from "@verse/providers/index";
import HireCoreNavbar from "apps/hirecore-web/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`  cyber-grid`}>
        <Web3Provider>
          <HireCoreNavbar />
        </Web3Provider>
        <main className="pt-4">{children}</main>
      </body>
    </html>
  );
}
