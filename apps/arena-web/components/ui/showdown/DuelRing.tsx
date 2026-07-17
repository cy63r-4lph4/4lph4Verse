"use client";

import { cn } from "@verse/ui";
import { motion, AnimatePresence } from "framer-motion";

interface DuelRingProps {
  pct: number;
  seconds: number;
  isCountingDown?: boolean;
  size?: number;
}

export function DuelRing({ pct, seconds, isCountingDown, size = 88 }: DuelRingProps) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const color = isCountingDown
    ? "hsl(var(--primary))"
    : pct > 50
      ? "hsl(var(--primary))"
      : pct > 25
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="4" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{
            strokeDashoffset: circ * (1 - pct / 100),
            stroke: color,
          }}
          transition={{ duration: 0.15, ease: "linear" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <AnimatePresence mode="wait">
        <motion.span
          key={seconds}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute font-display text-lg font-black text-white tabular-nums"
        >
          {seconds}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}