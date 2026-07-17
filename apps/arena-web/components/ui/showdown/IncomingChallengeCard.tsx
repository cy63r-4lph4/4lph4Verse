"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@verse/ui";
import { Swords, Radio, X } from "lucide-react";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { IncomingChallenge } from "@verse/arena-web/hooks/useDuelChallenges";
function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

interface IncomingChallengeCardProps {
  challenge: IncomingChallenge;
  onAccept: () => void;
  onDecline: () => void;
  onDismiss: () => void;
}

export function IncomingChallengeCard({
  challenge,
  onAccept,
  onDecline,
  onDismiss,
}: IncomingChallengeCardProps) {
  const [pulse, setPulse] = useState(true);

  // Auto-collapses into a corner badge after a few seconds if ignored —
  // never force a decision, but keep it visible.
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none sm:items-center"
      >
        {/* backdrop only while "fresh" — after that it recedes to a non-blocking toast */}
        {pulse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
            onClick={() => setPulse(false)}
          />
        )}

        <motion.div
          initial={{ y: 60, scale: 0.9, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
          className={cn(
            "relative w-full max-w-sm rounded-3xl border border-primary/30 bg-black/85 backdrop-blur-xl p-5 pointer-events-auto overflow-hidden",
            pulse && "shadow-[0_0_60px_hsl(var(--primary)/.25)]",
          )}
        >
          {/* scan line */}
          <motion.div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />

          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <X size={13} />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Radio size={11} className="text-primary animate-pulse" />
            <span className="font-display text-[9px] font-black text-primary uppercase tracking-[.3em]">
              Incoming Challenge
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ArenaAvatar
              src={dicebearUrl(challenge.fromUsername)}
              size="lg"
              glow
              glowColor="danger"
            />
            <div className="flex-1 min-w-0">
              <p className="font-display text-base font-black text-white uppercase tracking-wide truncate">
                {challenge.fromUsername}
              </p>
              <p className="font-display text-[9px] font-bold text-white/35 uppercase tracking-[.2em] mt-0.5">
                Has issued a duel request
              </p>
            </div>
            <Swords size={20} className="text-primary shrink-0" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <button
              onClick={onDecline}
              className="py-3 rounded-2xl border border-white/10 bg-white/[0.03] font-display text-[10px] font-black uppercase tracking-[.2em] text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-all active:scale-95"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="py-3 rounded-2xl bg-primary text-black font-display text-[10px] font-black uppercase tracking-[.2em] hover:brightness-110 transition-all active:scale-95"
              style={{ boxShadow: "0 0 20px hsl(var(--primary) / .4)" }}
            >
              Accept Duel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}