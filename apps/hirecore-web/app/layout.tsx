import { UserRoleProvider } from "@verse/hirecore-web/context/UserRoleContext";
import "./globals.css";
import { Web3Provider } from "@verse/providers/index";
import HireCoreNavbar from "apps/hirecore-web/components/Navbar";

// apps/hirecore-web/app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "sonner";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`  cyber-grid`}>
        <UserRoleProvider>
          <Web3Provider>
            <HireCoreNavbar />
            <main className="pt-4">
              {children}
              <Toaster richColors position="top-right" />
              <div id="modal-root"></div>
            </main>
          </Web3Provider>
        </UserRoleProvider>
      </body>
    </html>
  );
}
