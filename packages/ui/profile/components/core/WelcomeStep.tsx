"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PrimaryButton } from "../ui/PrimaryButton";
import { GlassCard } from "../ui/GlassCard";

type WelcomeStepProps = {
  onNext: () => void;
};

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <GlassCard>
      <div className="relative text-center py-10">
        {/* 🪩 Animated aura / background glow */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto mb-10 flex items-center justify-center"
        >
          <div className="absolute h-56 w-56 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 opacity-30 blur-3xl animate-pulse" />
          <Image
            src="/Verse-logo.png"
            alt="4lph4Verse Logo"
            width={200}
            height={200}
            className="relative z-10 animate-float"
          />
        </motion.div>

        {/* 👋 Greeting */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-orbitron text-lg sm:text-xl text-indigo-300 tracking-wide mb-2"
        >
          Hi there, Rebel
        </motion.h2>

        {/* 🌌 Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-orbitron text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"
        >
          Welcome to the 4lph4Verse
        </motion.h1>

        {/* 🧠 Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-4 text-gray-300 max-w-lg mx-auto leading-relaxed"
        >
          Let’s forge your <span className="text-indigo-400">Verse Identity</span>  
          and unlock the <span className="text-emerald-400">ecosystem</span>.  
          Your journey begins here.
        </motion.p>

        {/* 🚀 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <PrimaryButton
            onClick={onNext}
            className="px-8 py-3 text-lg relative overflow-hidden"
          >
            <span className="relative z-10">🚀 Begin Setup</span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 opacity-40 blur-xl animate-pulse" />
          </PrimaryButton>
        </motion.div>
      </div>
    </GlassCard>
  );
}
