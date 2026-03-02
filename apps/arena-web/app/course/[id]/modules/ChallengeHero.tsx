"use client";

import { useState } from "react";
import { Swords, Users, Skull, Shuffle, Lock, ChevronDown, Zap } from "lucide-react";
import { cn } from "@verse/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BattleMode {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  locked: boolean;
  accent: string;         // tailwind text color
  glow: string;           // box-shadow color (inline style)
  gradient: string;       // card bg gradient
}

interface ChallengeHeroProps {
  onSelectMode?: (id: string) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODES: BattleMode[] = [
  {
    id: "duel",
    icon: Swords,
    label: "1v1 Duel",
    desc: "Challenge a rival",
    locked: false,
    accent: "text-orange-400",
    glow: "rgba(251,146,60,0.5)",
    gradient: "from-orange-500/20 via-red-500/10 to-transparent",
  },
  {
    id: "royale",
    icon: Users,
    label: "Battle Royale",
    desc: "5 fighters, 1 winner",
    locked: true,
    accent: "text-yellow-400",
    glow: "rgba(250,204,21,0.4)",
    gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
  },
  {
    id: "elimination",
    icon: Skull,
    label: "Elimination",
    desc: "Survive the rounds",
    locked: true,
    accent: "text-purple-400",
    glow: "rgba(192,132,252,0.4)",
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "random",
    icon: Shuffle,
    label: "Random Match",
    desc: "Fight anyone, anytime",
    locked: true,
    accent: "text-sky-400",
    glow: "rgba(56,189,248,0.4)",
    gradient: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
];

// ─── Sub-component: Mode Card ─────────────────────────────────────────────────

function ModeCard({
  mode,
  onSelect,
}: {
  mode: BattleMode;
  onSelect: (id: string) => void;
}) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (mode.locked) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    onSelect(mode.id);
  };

  return (
    <button
      onClick={handleClick}
      disabled={mode.locked}
      className={cn(
        "relative w-full flex flex-col items-center gap-2.5 p-4 rounded-2xl",
        "border transition-all duration-200 select-none outline-none",
        "bg-gradient-to-b",
        mode.gradient,
        mode.locked
          ? "border-white/5 opacity-50 cursor-not-allowed grayscale"
          : "border-white/15 active:scale-95 active:brightness-110",
        pressed && "scale-95"
      )}
      style={
        !mode.locked
          ? {
              boxShadow: `0 0 0 0 ${mode.glow}`,
            }
          : undefined
      }
    >
      {/* Icon bubble */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          "bg-black/30 border border-white/10",
          !mode.locked && "group-active:scale-110"
        )}
      >
        <mode.icon
          size={22}
          className={cn(mode.locked ? "text-white/30" : mode.accent)}
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <p
          className={cn(
            "font-bold text-[13px] leading-tight tracking-wide",
            mode.locked ? "text-white/30" : "text-white"
          )}
        >
          {mode.label}
        </p>
        <p className="text-[10px] text-white/40 mt-0.5 leading-tight">
          {mode.desc}
        </p>
      </div>

      {/* Lock badge */}
      {mode.locked && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 border border-white/10 rounded-full px-1.5 py-0.5">
          <Lock size={8} className="text-white/40" />
          <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">
            Soon
          </span>
        </div>
      )}

      {/* Unlocked: subtle animated border glow on hover */}
      {!mode.locked && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${mode.glow}`,
          }}
        />
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChallengeHero({ onSelectMode }: ChallengeHeroProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full select-none">
      {/* ── BIG TAP BUTTON ──────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl transition-all duration-300",
          "active:scale-[0.98] outline-none",
          open ? "rounded-b-none" : ""
        )}
        style={{
          background:
            "linear-gradient(135deg, #ff6b00 0%, #ff3c00 40%, #c0392b 100%)",
          boxShadow: open
            ? "0 0 40px rgba(255,80,0,0.5), 0 8px 32px rgba(0,0,0,0.6)"
            : "0 0 24px rgba(255,80,0,0.35), 0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        {/* Diagonal shine stripe */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
          }}
        />

        {/* Subtle inner pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              rgba(0,0,0,0.3) 8px,
              rgba(0,0,0,0.3) 9px
            )`,
          }}
        />

        {/* Content row */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            {/* Icon with pulse ring */}
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-black/20 border border-white/20 flex items-center justify-center">
                <Swords
                  size={28}
                  className={cn(
                    "text-white transition-transform duration-300",
                    open ? "rotate-45" : "rotate-0"
                  )}
                />
              </div>
              {/* Ping ring — only when closed to draw the eye */}
              {!open && (
                <div className="absolute -inset-1 rounded-xl border border-white/30 animate-ping opacity-40" />
              )}
            </div>

            <div className="text-left">
              <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.2em] mb-0.5">
                Ready to fight?
              </p>
              <h2
                className="text-3xl font-black text-white uppercase leading-none"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
              >
                Challenge
              </h2>
            </div>
          </div>

          {/* XP chip + chevron */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 bg-black/25 border border-white/15 rounded-full px-2.5 py-1">
              <Zap size={10} className="text-yellow-300 fill-yellow-300" />
              <span className="text-[10px] font-bold text-yellow-200 tracking-wide">
                +50 XP
              </span>
            </div>
            <ChevronDown
              size={18}
              className={cn(
                "text-white/60 transition-transform duration-300",
                open && "rotate-180"
              )}
            />
          </div>
        </div>

        {/* Bottom edge highlight */}
        {!open && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        )}
      </button>

      {/* ── MODE GRID (CSS grid-rows expand trick — no JS height) ───────── */}
      <div
        className={cn(
          "grid transition-all duration-400 ease-out overflow-hidden",
          "bg-[#0e0e0e] border border-t-0 rounded-b-2xl",
          open
            ? "grid-rows-[1fr] opacity-100 border-white/10"
            : "grid-rows-[0fr] opacity-0 border-transparent"
        )}
      >
        <div className="min-h-0">
          <div className="p-3 pt-4">
            {/* Section label */}
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] text-center mb-3">
              Select Battle Mode
            </p>

            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {MODES.map((mode) => (
                <ModeCard
                  key={mode.id}
                  mode={mode}
                  onSelect={(id) => {
                    onSelectMode?.(id);
                    setOpen(false);
                  }}
                />
              ))}
            </div>

            {/* Dismiss hint */}
            <button
              onClick={() => setOpen(false)}
              className="w-full mt-3 py-2 text-[10px] font-semibold text-white/20 hover:text-white/40 uppercase tracking-[0.3em] transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeHero;