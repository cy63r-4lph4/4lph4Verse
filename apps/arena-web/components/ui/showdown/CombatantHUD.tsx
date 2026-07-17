"use client";

import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { motion } from "framer-motion";

interface CombatantHUDProps {
  name: string;
  avatar: string;
  score: number;
  side: "left" | "right";
  answered?: boolean;
  isWinner?: boolean;
  isEliminated?: boolean;
}

export function CombatantHUD({
  name,
  avatar,
  score,
  side,
  answered,
  isWinner,
  isEliminated,
}: CombatantHUDProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col items-center gap-3 flex-1 rounded-2xl border p-5",
        "bg-black/30 backdrop-blur-sm transition-all duration-500",
        isWinner && "border-primary/50 bg-primary/[0.06]",
        isEliminated && "opacity-40 grayscale",
        !isWinner && !isEliminated && "border-white/[0.07]",
      )}
      style={
        isWinner
          ? { boxShadow: "0 0 32px hsl(var(--primary) / .18), inset 0 0 20px hsl(var(--primary) / .05)" }
          : undefined
      }
    >
      {/* corner brackets, tactical signature */}
      <div className={cn("absolute w-4 h-4 border-white/10", side === "left" ? "top-0 left-0 border-t border-l rounded-tl-lg" : "top-0 right-0 border-t border-r rounded-tr-lg")} />
      <div className={cn("absolute w-4 h-4 border-white/10", side === "left" ? "bottom-0 left-0 border-b border-l rounded-bl-lg" : "bottom-0 right-0 border-b border-r rounded-br-lg")} />

      <div className="relative">
        <ArenaAvatar
          src={avatar}
          size="xl"
          glow={answered || isWinner}
          glowColor={isWinner ? "primary" : "secondary"}
        />
        {answered && !isWinner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-2 border-black flex items-center justify-center"
          >
            <span className="font-display text-[9px] font-black text-black">✓</span>
          </motion.div>
        )}
      </div>

      <p className="font-display text-[13px] font-black text-white uppercase tracking-wide text-center truncate max-w-[140px]">
        {name}
      </p>

      <motion.p
        key={score}
        initial={{ scale: 1.3, color: "hsl(var(--primary))" }}
        animate={{ scale: 1, color: "#fbbf24" }}
        transition={{ duration: 0.4 }}
        className="font-display text-2xl font-black tabular-nums"
      >
        {score.toLocaleString()}
      </motion.p>

      <span className="font-display text-[8px] font-bold text-white/25 uppercase tracking-[.25em]">
        {isWinner ? "Victor" : isEliminated ? "Eliminated" : answered ? "Locked In" : "Combatant"}
      </span>
    </motion.div>
  );
}