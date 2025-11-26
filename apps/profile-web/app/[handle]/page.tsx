"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import ParticleField from "../../components/particles";
import ConnectWalletButton from "@verse/ui/wallet/ConnectWalletButton";

export default function ProfilePage() {
  const pathname = usePathname();
  const handle = pathname.replace("/", "");

  // TODO: Replace with real logic
  const isOwner = true; // mock owner mode until wallet integration

  return (
    <main className="relative min-h-screen text-white bg-[#03040a] overflow-hidden tracking-wide">
      {/* background particles */}
      <ParticleField />

      {/* cosmic gradient */}
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(70,150,255,0.18), transparent 60%), radial-gradient(circle at 80% 75%, rgba(200,80,255,0.18), transparent 50%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* HEADER */}
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

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto pt-40 pb-20 px-6">
        {/* PROFILE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
        >
          {/* top section */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* avatar */}
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-4xl font-bold">
              {/* Avatar Placeholder */}
              CY
            </div>

            {/* handle + id */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-violet-300">
                @{handle}
              </h1>

              <div className="mt-1 text-slate-300 text-sm">
                Verse ID: <span className="font-medium">#12345</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {isOwner ? (
                <>
                  <button className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-cyan-500/20 border border-cyan-400/20 hover:bg-cyan-500/30 transition">
                    Edit Profile
                  </button>
                  <button className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition">
                    Manage Guardians
                  </button>
                  <button className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition">
                    Wallets & Keys
                  </button>
                  <button className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-red-500/20 border border-red-400/20 hover:bg-red-500/30 transition">
                    Recovery
                  </button>
                </>
              ) : (
                <>
                  <button className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-cyan-500/20 border border-cyan-400/20 hover:bg-cyan-500/30 transition">
                    Add as Guardian
                  </button>
                  <button className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition">
                    View Badges
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* TABS */}
        <div className="mt-10 flex items-center gap-8 border-b border-white/10 pb-3">
          <button className="text-slate-300 hover:text-white transition font-medium">
            Overview
          </button>
          <button className="text-slate-300 hover:text-white transition font-medium">
            Guardians
          </button>
          <button className="text-slate-300 hover:text-white transition font-medium">
            Activity
          </button>
        </div>

        {/* TAB CONTENT - placeholder for now */}
        <div className="mt-8 text-slate-300 text-sm">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
            <p>
              This is where the profile details, guardian list, achievements,
              linked wallets, and activity data will appear.
            </p>
            <p className="mt-2 opacity-80">
              (We'll wire the actual UI and on-chain / self.xyz data next.)
            </p>
          </div>
        </div>
      </div>

      {/* watermark */}
      <div className="absolute bottom-6 left-6 text-xs text-slate-400 opacity-50 z-20">
        Forged in the 4lph4Verse • Profile Layer by Self.xyz
      </div>
    </main>
  );
}
