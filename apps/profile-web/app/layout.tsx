import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Web3Provider } from "@verse/providers/index";
import ParticleField from "@verse/profile-web/components/particles";
import { Navbar } from "@verse/profile-web/components/NavBar";
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
        <Web3Provider>
          <main className="relative min-h-screen bg-[#03040a] text-white tracking-wide">
            {/* particle background */}
            <div className="pointer-events-none">
              <ParticleField />
            </div>
            {/* enhanced nebula gradients */}
            <div className="absolute inset-0 pointer-events-none -z-10 opacity-60">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 25% 35%, rgba(70,150,255,0.25), transparent 55%), radial-gradient(circle at 80% 65%, rgba(180,80,255,0.22), transparent 40%)",
                  filter: "blur(65px)",
                }}
              />
            </div>

            {/* bright cosmic streak */}
            <div
              className="absolute inset-0 -z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(115deg, rgba(0,255,255,0.04), rgba(255,0,255,0.05))",
                opacity: 0.15,
              }}
            />

            {/* Header */}
            <Navbar />

            {children}
          </main>
        </Web3Provider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
