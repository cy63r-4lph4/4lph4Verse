"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ParticleField from "../components/particles";
import { RuneSVG } from "../components/runeSvg";
import ConnectWalletButton from "@verse/ui/wallet/ConnectWalletButton";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03040a] text-white tracking-wide">
      {/* particle background */}
      <ParticleField />

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
      <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-lg font-semibold text-cyan-200 hover:text-cyan-300"
        >
          4lph4Verse • Identity
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/guardians"
            className="text-sm text-slate-300 hover:text-cyan-300 transition"
          >
            Guardian Registry
          </Link>

          <ConnectWalletButton />
        </div>
      </header>

      {/* content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center justify-center min-h-screen">
        <div className="w-full flex flex-col lg:flex-row items-center gap-14 py-12">
          {/* left side */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-200 drop-shadow-[0_0_22px_rgba(80,150,255,0.35)]">
                  Own Your Existence.
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-pink-300 drop-shadow-[0_0_20px_rgba(190,90,255,0.28)]">
                  Command Your Identity.
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.9 }}
                className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                VerseProfile is your sovereign identity layer — verification,
                wallets, guardians and recovery fused into a single universal
                profile across the entire 4lph4Verse.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="mt-10 flex items-center justify-center lg:justify-start gap-4"
              >
                <Link href="/profile" className="inline-block">
                  <button className="relative inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-400/70 via-blue-500/70 to-violet-500/70 backdrop-blur-xl shadow-[0_10px_45px_rgba(80,150,255,0.20)] hover:scale-[1.05] active:scale-95 ring-1 ring-white/10 transition-all">
                    Enter Your Profile
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* right side visual */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative w-[420px] h-[420px] hidden lg:block">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(90,160,255,0.25), transparent 20%), radial-gradient(circle at 70% 70%, rgba(170,90,255,0.18), transparent 30%)",
                }}
              />

              <div className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-[7px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)] p-6 flex items-center justify-center">
                <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                  <div
                    className="absolute inset-0 animate-[pulse_3s_ease_infinite]"
                    style={{
                      filter: "blur(30px)",
                      opacity: 0.15,
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(100,170,255,0.25), transparent 40%)",
                    }}
                  />

                  <RuneSVG size={320} />
                </div>
              </div>
            </div>

            {/* Mobile Rune */}
            <div className="lg:hidden w-44 h-44 flex items-center justify-center">
              <div className="w-44 h-44 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-violet-400/10 p-4 flex items-center justify-center">
                <RuneSVG size={160} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* watermark */}
      <div className="absolute bottom-6 left-6 text-xs text-slate-400 opacity-50 z-20">
        Forged in the 4lph4Verse • Identity Layer by Self.xyz
      </div>

      {/* animation keyframes */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.1; transform: scale(0.96); }
          50% { opacity: 0.16; transform: scale(1.02); }
          100% { opacity: 0.1; transform: scale(0.96); }
        }
      `}</style>
    </main>
  );
}
