"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ParticleField from "../../components/particles";
import ConnectWalletButton from "@verse/ui/wallet/ConnectWalletButton";

export default function GuardiansPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03040a] text-white tracking-wide">
      {/* particle background */}
      <ParticleField />

      {/* nebula glow */}
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

      {/* cosmic streak */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, rgba(0,255,255,0.04), rgba(255,0,255,0.05))",
          opacity: 0.15,
        }}
      />

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-lg font-semibold text-cyan-200 hover:text-cyan-300"
        >
          4lph4Verse • Identity
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/guardians" className="text-sm text-cyan-300 font-medium">
            Guardian Registry
          </Link>

          <ConnectWalletButton />
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_0_35px_rgba(0,0,0,0.35)]"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-violet-300">
            Guardian Registry
          </h1>

          <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The Guardian Registry is a verified directory of trusted people in
            the 4lph4Verse. Here, users can discover and appoint guardians who
            can assist with account recovery and identity protection.
          </p>

          {/* Coming soon box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg"
          >
            <p className="text-lg text-slate-200 font-medium">
              🔒 The Guardian Registry is not available yet.
            </p>
            <p className="text-sm mt-1 text-slate-400">
              It will launch soon with verified guardian profiles.
            </p>

            <button
              disabled
              className="mt-5 px-6 py-3 rounded-xl text-sm font-semibold bg-white/10 text-white border border-white/20 cursor-not-allowed opacity-50"
            >
              Browse Guardians (Coming Soon)
            </button>
          </motion.div>

          {/* Extra explanation */}
          <div className="mt-10 text-slate-300 text-sm leading-relaxed">
            <p>
              Once live, you will be able to browse guardians, view details,
              trust scores, and click{" "}
              <span className="text-cyan-300 font-medium">“Add Guardian”</span>{" "}
              to assign them to your VerseProfile.
            </p>
            <p className="mt-2">
              You will also still be able to manually assign any wallet address
              as a guardian from your profile page.
            </p>
          </div>
        </motion.div>
      </div>

      {/* watermark */}
      <div className="absolute bottom-6 left-6 text-xs text-slate-400 opacity-50 z-20">
        Forged in the 4lph4Verse • Guardian Layer by Self.xyz
      </div>
    </main>
  );
}
