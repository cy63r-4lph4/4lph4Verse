"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { PrimaryButton } from "../ui/PrimaryButton";
import  { VerseProfile } from "@verse/sdk/types";

type SuccessStepProps = {
  profile: VerseProfile;
  dapp?: string;
  onContinue: () => void;
};

export function SuccessStep({ profile, dapp, onContinue }: SuccessStepProps) {
  return (
    <GlassCard>
      <div className="relative text-center py-12 overflow-hidden">
        {/* 🌌 Animated background glows */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-50px] left-[-50px] h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-400/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-60px] right-[-60px] h-72 w-72 rounded-full bg-gradient-to-br from-emerald-500/30 to-purple-500/30 blur-3xl animate-pulse delay-300" />
        </div>

        {/* ✨ Glowing checkmark */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 shadow-[0_0_30px_rgba(34,211,238,0.8)]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <Check className="h-12 w-12 text-white" />
          </motion.div>
        </motion.div>

        {/* 🏆 Title */}
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-orbitron text-3xl font-bold text-white tracking-wide"
        >
          Identity Forged
        </motion.h3>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-gray-300"
        >
          Welcome to the 4lph4Verse,{" "}
          <span className="text-indigo-400">@{profile.handle}</span>.
        </motion.p>

        {/* 🌠 Confetti */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: "50%",
                y: "50%",
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: `${Math.random() * 200 - 100}%`,
                y: "120%",
                rotate: 360,
                opacity: 0,
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-sm bg-gradient-to-r from-pink-500 via-indigo-400 to-emerald-400"
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <PrimaryButton onClick={onContinue} className="px-6 py-3 text-lg">
            {dapp ? `Enter ${capitalize(dapp)} →` : "Enter the Verse →"}
          </PrimaryButton>
        </motion.div>
      </div>
    </GlassCard>
  );
}

function capitalize(str?: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
