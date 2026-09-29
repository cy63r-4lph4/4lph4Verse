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
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full flex flex-col lg:flex-row items-center gap-16 py-12">
          {/* LEFT: Copy */}
          <div className="flex-1 text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-sm bg-alpha-cyan/10 border border-alpha-cyan/30 text-alpha-cyan text-xs font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-alpha-cyan animate-pulse" />
                Identity Link Active
              </div>

              <h1 className="text-hero font-bold tracking-tight">
                <span className="block text-white">
                  Own Your <span className="text-alpha-cyan text-glow">Existence.</span>
                </span>
                <span className="block text-white mt-2">
                  Command Your <span className="text-alpha-magenta text-glow-magenta">Identity.</span>
                </span>
              </h1>

              <p className="mt-8 text-xl sm:text-2xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-mono">
                <span className="text-slate-500">{'>'} SYS.INIT: </span> 
                VerseProfile is your sovereign identity layer — verification, wallets, and recovery fused into a single universal signature across the 4lph4Verse.
              </p>

              {/* ACTION ZONE (Terminal Box) */}
              <div className="mt-12 max-w-md mx-auto lg:mx-0 p-1 rounded-sm bg-gradient-to-br from-alpha-cyan/20 via-transparent to-alpha-magenta/20">
                <div className="relative p-6 bg-[#03040A]/90 backdrop-blur-md border border-white/5 rounded-sm box-glow">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-alpha-cyan" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-alpha-magenta" />

                  {view === "HAS_PROFILE" && pUrl && (
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="text-xs text-alpha-cyan font-mono mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-alpha-cyan rounded-full" />
                        PROFILE DETECTED
                      </div>
                      <Link href={pUrl} className="w-full">
                        <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-alpha-cyan/10 hover:bg-alpha-cyan/20 border border-alpha-cyan/50 text-alpha-cyan font-mono text-sm tracking-wider uppercase transition-all duration-300 group">
                          [ Access Terminal ]
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  )}

                  {view === "NO_PROFILE" && (
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="text-xs text-slate-400 font-mono mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                        NO PROFILE DETECTED
                      </div>
                      <Link href="/create-profile" className="w-full">
                        <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-alpha-cyan/10 border border-white/20 hover:border-alpha-cyan/50 text-white hover:text-alpha-cyan font-mono text-sm tracking-wider uppercase transition-all duration-300 group">
                          [ Initialize Profile ]
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  )}

                  {view === "LOADING_PROFILE" && (
                    <div className="flex items-center justify-center gap-4 py-2">
                      <Loader2 className="w-5 h-5 animate-spin text-alpha-cyan" />
                      <span className="text-sm text-alpha-cyan font-mono tracking-widest animate-pulse">
                        SYNCING IDENTITY...
                      </span>
                    </div>
                  )}

                  {view === "DISCONNECTED" && (
                    <div className="flex items-center gap-4 py-1">
                      <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm">
                        <Wallet className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-mono text-slate-300 uppercase tracking-widest">
                          Awaiting Uplink
                        </p>
                        <p className="text-xs font-mono text-slate-500 mt-1">
                          Connect wallet to authenticate
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Rune/Graphic */}
          <div className="shrink-0 flex items-center justify-center z-10">
            <motion.div 
              className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Outer glowing rings */}
              <div className="absolute inset-0 rounded-full border border-alpha-cyan/20 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-alpha-magenta/20 animate-[spin_15s_linear_infinite_reverse]" />
              
              <div className="absolute inset-0 rounded-full blur-[80px] opacity-20 bg-[radial-gradient(circle,var(--alpha-cyan),transparent_70%)]" />
              
              <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                <RuneSVG size={280} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer / Status bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 pointer-events-none z-50">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1 h-1 bg-alpha-cyan" />
            V.1.0.0
          </div>
          <div>
            Identity Layer // Self.xyz
          </div>
          <div className="flex items-center gap-2">
            SECURE
            <span className="inline-block w-1 h-1 bg-alpha-cyan" />
          </div>
        </div>
      </div>
    </>
  );
}
