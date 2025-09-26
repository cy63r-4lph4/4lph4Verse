import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@verse/providers/index";
import HireCoreNavbar from "apps/hirecore-web/components/Navbar";

// apps/hirecore-web/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HireCore",
  description: "Decentralized task marketplace",
  manifest: "/site.webmanifest",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

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
