"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

interface VersusIgnitionProps {
  playerA: { name: string; avatar: string };
  playerB: { name: string; avatar: string };
  countdownSeconds: number;
  roundLabel: string;
}

export function VersusIgnition({ playerA, playerB, countdownSeconds, roundLabel }: VersusIgnitionProps) {
  const [impact, setImpact] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setImpact(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center gap-10 py-16 overflow-hidden">
      {/* shockwave ring on impact */}
      <AnimatePresence>
        {impact && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-24 h-24 rounded-full border-2 border-primary/60 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-[10px] font-black text-primary/70 uppercase tracking-[.4em]"
      >
        {roundLabel} · Engagement Imminent
      </motion.p>

      <div className="relative flex items-center gap-8">
        <motion.div
          initial={{ x: -220, opacity: 0, rotate: -8 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <ArenaAvatar src={playerA.avatar} size="xl" glow glowColor="primary" />
          <p className="font-display text-sm font-black text-white uppercase tracking-wide">{playerA.name}</p>
        </motion.div>

        <motion.div
          animate={impact ? { scale: [1, 1.6, 1], rotate: [0, 15, -15, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl border border-primary/30 bg-black/40"
        >
          <span
            className="font-display text-xl font-black text-primary"
            style={{ textShadow: "0 0 16px hsl(var(--primary) / .8)" }}
          >
            VS
          </span>
        </motion.div>

        <motion.div
          initial={{ x: 220, opacity: 0, rotate: 8 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <ArenaAvatar src={playerB.avatar} size="xl" glow glowColor="secondary" />
          <p className="font-display text-sm font-black text-white uppercase tracking-wide">{playerB.name}</p>
        </motion.div>
      </div>

      <motion.div
        key={countdownSeconds}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        className="font-display text-6xl font-black text-white tabular-nums"
        style={{ textShadow: "0 0 24px hsl(var(--primary) / .5)" }}
      >
        {countdownSeconds}
      </motion.div>
    </div>
  );
}