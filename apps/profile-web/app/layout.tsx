import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import ParticleField from "@verse/profile-web/components/particles";
import { ClientWeb3Provider } from "@verse/profile-web/components/ClientWeb3Provider";
import { Navbar } from "@verse/profile-web/components/NavBar";
import { GridBackground } from "@verse/profile-web/components/GridBackground";
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
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-[#010103]`}
      >
        <ClientWeb3Provider>
          <main className="relative min-h-screen text-white tracking-wide overflow-hidden selection:bg-alpha-magenta/40 selection:text-white">
            
            {/* Base Layer */}
            <div className="absolute inset-0 bg-[#010103] -z-50" />
            
            {/* Deep Space Vignette / Glow (Bottom-most to not wash out grid) */}
            <div className="absolute inset-0 pointer-events-none -z-40 opacity-50">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% -10%, rgba(0,240,255,0.15), transparent 60%), radial-gradient(circle at 10% 90%, rgba(176,38,255,0.15), transparent 50%)",
                  filter: "blur(60px)",
                }}
              />
            </div>

            {/* Grid Animation */}
            <div className="absolute inset-0 pointer-events-none -z-30 opacity-80">
               <GridBackground />
            </div>

            {/* Particle Field Background */}
            <div className="absolute inset-0 pointer-events-none -z-20 opacity-60">
              <ParticleField />
            </div>

            {/* Scanline Overlay */}
            <div className="scanline" />

            {/* Header */}
            <Navbar />

            {/* Page Content */}
            <div className="relative z-10 pt-20">
              {children}
            </div>
          </main>
        </ClientWeb3Provider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
