"use client";

import { useState } from "react";
import { Swords, Users, Skull, Shuffle, Lock, ChevronDown, Zap, X } from "lucide-react";
import { cn } from "@verse/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BattleMode {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  locked: boolean;
  accent: string;   // Tailwind text color
  glow: string;   // inline box-shadow color
  gradient: string;   // card bg gradient classes
}

interface ChallengeHeroProps {
  onSelectMode?: (id: string) => void;
}

// ─── Mode definitions ─────────────────────────────────────────────────────────

const MODES: BattleMode[] = [
  {
    id: "duel",
    icon: Swords,
    label: "1v1 Duel",
    desc: "Challenge a rival",
    locked: false,
    accent: "text-primary",
    glow: "rgba(99,102,241,0.4)",
    gradient: "from-primary/15 via-primary/5 to-transparent",
  },
  {
    id: "royale",
    icon: Users,
    label: "Royale",
    desc: "5 fighters, 1 winner",
    locked: true,
    accent: "text-amber-400",
    glow: "rgba(245,158,11,0.4)",
    gradient: "from-amber-500/15 via-amber-400/5 to-transparent",
  },
  {
    id: "elimination",
    icon: Skull,
    label: "Elimination",
    desc: "Survive the rounds",
    locked: true,
    accent: "text-violet-400",
    glow: "rgba(167,139,250,0.4)",
    gradient: "from-violet-500/15 via-violet-400/5 to-transparent",
  },
  {
    id: "random",
    icon: Shuffle,
    label: "Random",
    desc: "Fight anyone, anytime",
    locked: true,
    accent: "text-sky-400",
    glow: "rgba(56,189,248,0.4)",
    gradient: "from-sky-500/15 via-sky-400/5 to-transparent",
  },
];

// ─── Mode card ────────────────────────────────────────────────────────────────

function ModeCard({
  mode,
  onSelect,
}: {
  mode: BattleMode;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => !mode.locked && onSelect(mode.id)}
      disabled={mode.locked}
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 rounded-2xl",
        "border bg-gradient-to-b transition-all duration-200 outline-none select-none",
        mode.gradient,
        mode.locked
          ? "border-white/[0.05] opacity-40 cursor-not-allowed grayscale"
          : "border-white/[0.12] active:scale-[0.96] active:brightness-110"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          "bg-black/30 border border-white/[0.08] shrink-0",
        )}
        style={!mode.locked ? { boxShadow: `0 0 14px ${mode.glow}` } : undefined}
      >
        <mode.icon
          size={18}
          className={mode.locked ? "text-white/25" : mode.accent}
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className={cn(
          "font-display text-[11px] font-black uppercase tracking-wide leading-tight",
          mode.locked ? "text-white/25" : "text-white"
        )}>
          {mode.label}
        </p>
        <p className="font-display text-[8px] font-bold text-white/30 uppercase tracking-wider mt-0.5 leading-tight">
          {mode.desc}
        </p>
      </div>

      {/* Lock badge */}
      {mode.locked && (
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/50 border border-white/[0.08] rounded-full px-1.5 py-0.5">
          <Lock size={7} className="text-white/30" />
          <span className="font-display text-[7px] font-black text-white/25 uppercase tracking-wider">
            Soon
          </span>
        </div>
      )}

      {/* Hover glow overlay */}
      {!mode.locked && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: `inset 0 0 16px ${mode.glow}` }}
        />
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChallengeHero({ onSelectMode }: ChallengeHeroProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full select-none">

      {/* ── TRIGGER BUTTON ──────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "relative w-full overflow-hidden transition-all duration-300 outline-none",
          "active:scale-[.98]",
          open ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"
        )}
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, color-mix(in srgb, hsl(var(--primary)) 70%, black) 100%)",
          boxShadow: open
            ? "0 0 40px hsl(var(--primary) / .45), 0 8px 32px rgba(0,0,0,.6)"
            : "0 0 24px hsl(var(--primary) / .3), 0 8px 24px rgba(0,0,0,.5)",
        }}
      >
        {/* Diagonal shine */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,.07) 50%, transparent 60%)" }}
        />

        {/* Diagonal stripe texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,.4) 8px, rgba(0,0,0,.4) 9px)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between px-4 py-4">

          {/* Left: icon + text */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl bg-black/20 border border-white/20 flex items-center justify-center">
                <Swords
                  size={22}
                  className={cn("text-white transition-transform duration-300", open && "rotate-45")}
                />
              </div>
              {!open && (
                <div className="absolute -inset-1 rounded-xl border border-white/25 animate-ping opacity-40" />
              )}
            </div>

            {/* Text — min-w-0 + truncate so it never overflows on small screens */}
            <div className="min-w-0">
              <p className="font-display text-[9px] font-black text-white/50 uppercase tracking-[.25em] leading-none mb-1">
                Ready to fight?
              </p>
              <h2 className="font-display text-[22px] font-black text-white uppercase leading-none tracking-wide">
                Challenge
              </h2>
            </div>
          </div>

          {/* Right: XP chip + chevron — shrink-0 so it never gets squeezed */}
          <div className="flex flex-col items-end gap-2 shrink-0 ml-3">
            <div className="flex items-center gap-1 bg-black/25 border border-white/15 rounded-full px-2 py-1">
              <Zap size={9} className="text-yellow-300 fill-yellow-300 shrink-0" />
              <span className="font-display text-[9px] font-black text-yellow-200 tracking-wide">
                +50 XP
              </span>
            </div>
            <ChevronDown
              size={16}
              className={cn("text-white/50 transition-transform duration-300", open && "rotate-180")}
            />
          </div>
        </div>

        {/* Bottom edge shimmer — only when closed */}
        {!open && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        )}
      </button>

      {/* ── MODE GRID (grid-rows expand trick) ───────────────────────────── */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-out overflow-hidden",
          "border border-t-0 rounded-b-2xl",
          open
            ? "grid-rows-[1fr] opacity-100 border-white/[0.08]"
            : "grid-rows-[0fr] opacity-0 border-transparent"
        )}
        style={{ background: "#0a0a0a" }}
      >
        <div className="min-h-0">
          <div className="p-3 pt-4 space-y-3">

            {/* Label */}
            <p className="font-display text-[9px] font-black text-white/25 uppercase tracking-[.3em] text-center">
              Select Battle Mode
            </p>

            {/* 2×2 grid — gap-2 instead of gap-2.5 for tighter fit on small screens */}
            <div className="grid grid-cols-2 gap-2">
              {MODES.map(mode => (
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

            {/* Dismiss */}
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] font-display text-[9px] font-black text-white/25 uppercase tracking-[.3em] hover:bg-white/[0.05] hover:text-white/40 transition-all active:scale-[.98]"
            >
              <X size={10} />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeHero;