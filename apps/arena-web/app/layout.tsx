// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050505", // Matches --arena-darker
};

export const metadata: Metadata = {
  title: "ARENA | DeskMate",
  description: "Study. Challenge. Ascend.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-arena-darker selection:bg-primary/30 no-overscroll">
        <main className="relative min-h-dvh flex flex-col overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}