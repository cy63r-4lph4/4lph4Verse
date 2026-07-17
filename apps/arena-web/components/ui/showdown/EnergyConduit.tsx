"use client";

import { motion } from "framer-motion";

interface EnergyConduitProps {
  d: string;
  isActive: boolean;
  delay?: number;
}

export function EnergyConduit({ d, isActive, delay = 0 }: EnergyConduitProps) {
  return (
    <g>
      <path d={d} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1.5" />
      <motion.path
        d={d}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.6, delay, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary) / .6))" }}
      />
      {isActive && (
        <motion.circle
          r="3"
          fill="hsl(var(--primary))"
          style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary)))" }}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 1.4, delay: delay + 0.3, repeat: Infinity, ease: "linear" }}
          // @ts-expect-error -- offsetPath is valid CSS, not yet in the motion typing
          style={{ offsetPath: `path("${d}")`, offsetRotate: "0deg" }}
        />
      )}
    </g>
  );
}