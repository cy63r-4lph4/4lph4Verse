// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@verse/arena-web/components/QueryProvider";

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "ARENA | DeskMate",
  description: "Study. Challenge. Ascend.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};


// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark selection:bg-primary/30">
      <body className="bg-arena-darker text-foreground antialiased min-h-screen overflow-x-hidden">
        <main className="relative flex flex-col min-h-screen">
          <QueryProvider>{children}</QueryProvider>
        </main>
      </body>
    </html>
  );
}