// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@verse/arena-web/components/QueryProvider";
import { ChallengeToast } from "@verse/arena-web/components/ui/ChallengeToast";

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09132a",
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://arena-community-phi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Arena | DeskMate",
    template: "%s | Arena",
  },
  description: "Study. Challenge. Ascend. Compete in real-time academic battles with Arena by DeskMate.",
  applicationName: "Arena",
  keywords: ["arena", "deskmate", "study", "challenge", "academic", "tournament"],
  authors: [{ name: "DeskMate" }],

  // ── Favicons & icons ──────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-256x256.png",  sizes: "256x256", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icons/maskable-icon-512x512.png" },
    ],
  },

  // ── PWA manifest ──────────────────────────────────────────────────────────
  manifest: "/icons/site.webmanifest",

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Arena by DeskMate",
    title: "Arena | DeskMate",
    description: "Study. Challenge. Ascend. Compete in real-time academic battles.",
    images: [
      {
        url: "/og/arena-og.png",
        width: 1200,
        height: 630,
        alt: "Arena by DeskMate — Study. Challenge. Ascend.",
      },
    ],
  },

  // ── Twitter / X card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Arena | DeskMate",
    description: "Study. Challenge. Ascend.",
    images: ["/og/arena-og.png"],
  },

  // ── Apple Web App (PWA on iOS) ────────────────────────────────────────────
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Arena",
  },
};


// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark selection:bg-primary/30">
      <body className="bg-arena-darker text-foreground antialiased min-h-screen overflow-x-hidden">
        <main className="relative flex flex-col min-h-screen">
          <QueryProvider>{children}</QueryProvider>
          <ChallengeToast />
        </main>
      </body>
    </html>
  );
}