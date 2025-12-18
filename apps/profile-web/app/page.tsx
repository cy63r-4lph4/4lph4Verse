"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RuneSVG } from "../components/runeSvg";
import { useAccount } from "wagmi";
import { useCheckProfile } from "@verse/sdk";
import { Wallet, ArrowRight, Loader2 } from "lucide-react";

type ViewState =
  | "DISCONNECTED"
  | "LOADING_PROFILE"
  | "HAS_PROFILE"
  | "NO_PROFILE";

export default function Page() {
  const { address } = useAccount();
  const { hasProfile, hasCache } = useCheckProfile();

  const [pUrl, setPurl] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>("DISCONNECTED");

  useEffect(() => {
    if (!address) {
      setView("DISCONNECTED");
      setPurl(null);
      return;
    }

    if (hasProfile && !hasCache) {
      setView("LOADING_PROFILE");
      return;
    }

    if (!hasProfile) {
      setView("NO_PROFILE");
      setPurl(null);
      return;
    }

    const cached = localStorage.getItem(
      `verseProfile:${address.toLowerCase()}`
    );

    if (!cached) {
      setView("LOADING_PROFILE");
      return;
    }

    try {
      const parsed = JSON.parse(cached);
      setPurl(`/${parsed.handle}`);
      setView("HAS_PROFILE");
    } catch {
      setView("LOADING_PROFILE");
    }
  }, [address, hasProfile, hasCache]);

  return (
    <>
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center justify-center min-h-screen">
        <div className="w-full flex flex-col lg:flex-row items-center gap-14 py-12">
          {/* LEFT */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block bg-clip-text text-transparent bg-linear-to-r from-cyan-300 via-blue-200 to-indigo-200 drop-shadow-[0_0_22px_rgba(80,150,255,0.35)]">
                  Own Your Existence.
                </span>
                <span className="block bg-clip-text text-transparent bg-linear-to-r from-violet-200 to-pink-300 drop-shadow-[0_0_20px_rgba(190,90,255,0.28)]">
                  Command Your Identity.
                </span>
              </h1>

              <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                VerseProfile is your sovereign identity layer — verification,
                wallets, guardians and recovery fused into a single universal
                profile across the entire 4lph4Verse.
              </p>

              {/* CTA ZONE */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {view === "HAS_PROFILE" && pUrl && (
                  <Link href={pUrl}>
                    <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-linear-to-r from-cyan-400/70 via-blue-500/70 to-violet-500/70 shadow-[0_10px_45px_rgba(80,150,255,0.20)] hover:scale-[1.06] transition">
                      Enter Your Profile
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}

                {view === "NO_PROFILE" && (
                  <Link href="/create-profile">
                    <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-linear-to-r from-cyan-400/70 via-blue-500/70 to-violet-500/70 shadow-[0_10px_45px_rgba(80,150,255,0.20)] hover:scale-[1.06] transition">
                      Create Your Profile
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}

                {view === "LOADING_PROFILE" && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-black/40 border border-white/10">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
                    <span className="text-sm text-slate-300">
                      Syncing your identity…
                    </span>
                  </div>
                )}

                {view === "DISCONNECTED" && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-black/40 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Wallet not connected
                      </p>
                      <p className="text-xs text-slate-400">
                        Connect your wallet to begin
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative w-[420px] h-[420px] hidden lg:block">
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30 bg-[radial-gradient(circle,rgba(90,160,255,0.25),transparent)]" />
              <div className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur p-6 flex items-center justify-center">
                <RuneSVG size={320} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 text-xs text-slate-400 opacity-50">
        Forged in the 4lph4Verse • Identity Layer by Self.xyz
      </div>
    </>
  );
}
