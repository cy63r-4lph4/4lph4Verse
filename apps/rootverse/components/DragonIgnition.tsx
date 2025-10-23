"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export const DragonIgnition = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Glow backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.15, 0.4, 0.2] }}
        transition={{ duration: 6, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
      />

      {/* Dragon sigil core */}
      <motion.img
        src="/dragon_sigil.png"
        alt="4lph4Verse Dragon Sigil"
        className="w-[220px] sm:w-[320px] z-20 drop-shadow-[0_0_50px_rgba(56,189,248,0.6)]"
        initial={{ opacity: 0, scale: 0.4, rotate: 0 }}
        animate={{
          opacity: [0, 1, 1, 1, 0.9],
          scale: [0.4, 1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 5,
          times: [0, 0.2, 0.6, 1],
          ease: "easeInOut",
        }}
      />

      {/* Energy ripple */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{
          scale: [0, 1.5, 2.5],
          opacity: [0.8, 0.3, 0],
        }}
        transition={{
          duration: 3,
          delay: 0.8,
          ease: "easeOut",
          repeat: 2,
          repeatDelay: 0.5,
        }}
        className="absolute w-[400px] h-[400px] rounded-full border border-cyan-400/40 blur-xl"
      />

      {/* Light particles */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        animate={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(168,85,247,0.1), rgba(0,0,0,0))",
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      />

      {/* Genesis text */}
      <motion.h1
        className="mt-8 text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent text-center tracking-widest z-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: [0, 1], y: [40, 0] }}
        transition={{ delay: 3, duration: 1 }}
      >
        GENESIS GATEWAY
      </motion.h1>

      {/* Sub-text */}
      <motion.p
        className="mt-2 text-sm sm:text-base text-white/70 tracking-widest z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1] }}
        transition={{ delay: 4, duration: 1 }}
      >
        — Activation Complete —
      </motion.p>
    </div>
  );
};
