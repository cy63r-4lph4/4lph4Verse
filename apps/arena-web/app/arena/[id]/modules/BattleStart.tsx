"use client";

import { useState, useEffect } from "react";
import { Swords, Shield, Wifi } from "lucide-react";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { cn } from "@verse/ui";

// ─── Mock data ────────────────────────────────────────────────────────────────
// Replace with real data derived from quizId prop

const PLAYER = {
  name:   "ShadowScholar99",
  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=player",
  level:  12,
  rank:   10,
  wins:   47,
};

const OPPONENT = {
  name:   "NightHawk42",
  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nighthawk",
  level:  9,
  rank:   14,
  wins:   31,
};

const QUIZ = {
  name:       "Newton's Laws",
  course:     "PHY-101",
  questions:  10,
  difficulty: "MEDIUM" as const,
};

const DIFFICULTY_CFG = {
  EASY:   { color: "text-green-400",  border: "border-green-400/30",  bg: "bg-green-400/10"  },
  MEDIUM: { color: "text-amber-400",  border: "border-amber-400/30",  bg: "bg-amber-400/10"  },
  HARD:   { color: "text-red-400",    border: "border-red-400/30",    bg: "bg-red-400/10"    },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface BattleStartProps {
  quizId?: string;
  onReady: () => void;
}

// ─── Scanning animation dots ──────────────────────────────────────────────────

function ScanningDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/60"
          style={{ animation: `scanning-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

// ─── Fighter card ─────────────────────────────────────────────────────────────

interface FighterCardProps {
  player: typeof PLAYER;
  side: "left" | "right";
  label: string;
  glowColor: "primary" | "danger";
  revealed: boolean;
}

function FighterCard({ player, side, label, glowColor, revealed }: FighterCardProps) {
  const isLeft = side === "left";

  const labelColor    = glowColor === "primary" ? "text-primary"  : "text-red-400";
  const auraColor     = glowColor === "primary"
    ? "hsl(var(--primary) / .25)"
    : "rgba(239,68,68,.2)";
  const statBarColor  = glowColor === "primary" ? "bg-primary"    : "bg-red-500";
  const borderAccent  = glowColor === "primary"
    ? "border-primary/20"
    : "border-red-500/20";

  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center gap-3 transition-all duration-700",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* Avatar + aura */}
      <div className="relative">
        {/* Ambient aura — behind avatar */}
        <div
          className="absolute -inset-4 rounded-full blur-2xl pointer-events-none"
          style={{ background: auraColor, animation: "pulse 2.5s ease-in-out infinite" }}
        />
        <ArenaAvatar
          src={player.avatar}
          size="2xl"
          glow
          glowColor={glowColor === "primary" ? "primary" : "danger"}
        />
      </div>

      {/* Label + Name */}
      <div className="flex flex-col items-center gap-0.5">
        <span className={cn("font-display text-[9px] font-black uppercase tracking-[.3em]", labelColor)}>
          {label}
        </span>
        <span className="font-display text-[13px] font-black text-white uppercase tracking-wide text-center leading-tight">
          {player.name}
        </span>
      </div>

      {/* Stats mini-card */}
      <div className={cn(
        "w-full rounded-xl border px-3 py-2.5 flex flex-col gap-2",
        "bg-white/[0.03]",
        borderAccent
      )}>
        {/* Level + Rank row */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <span className="font-display text-[16px] font-black text-white leading-none">{player.level}</span>
            <span className="font-display text-[8px] font-bold text-white/25 uppercase tracking-wider">Level</span>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div className="flex flex-col items-center">
            <span className="font-display text-[16px] font-black text-white leading-none">#{player.rank}</span>
            <span className="font-display text-[8px] font-bold text-white/25 uppercase tracking-wider">Rank</span>
          </div>
          <div className="h-8 w-px bg-white/[0.06]" />
          <div className="flex flex-col items-center">
            <span className="font-display text-[16px] font-black text-white leading-none">{player.wins}</span>
            <span className="font-display text-[8px] font-bold text-white/25 uppercase tracking-wider">Wins</span>
          </div>
        </div>

        {/* Win bar — visual relative strength indicator */}
        <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-1000", statBarColor)}
            style={{
              width: revealed ? `${Math.min((player.wins / 60) * 100, 100)}%` : "0%",
              boxShadow: glowColor === "primary"
                ? "0 0 8px hsl(var(--primary) / .6)"
                : "0 0 8px rgba(239,68,68,.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── VS divider ───────────────────────────────────────────────────────────────

function VsDivider({ active }: { active: boolean }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-2 shrink-0 transition-all duration-500",
      active ? "opacity-100 scale-100" : "opacity-0 scale-75"
    )}>
      {/* Top line */}
      <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />

      {/* VS badge */}
      <div
        className="w-12 h-12 rounded-2xl border border-amber-400/30 bg-amber-400/10 flex items-center justify-center"
        style={{ boxShadow: "0 0 20px rgba(251,191,36,.2)" }}
      >
        <span
          className="font-display text-[18px] font-black text-amber-400 italic leading-none"
          style={{ textShadow: "0 0 12px rgba(251,191,36,.8)" }}
        >
          VS
        </span>
      </div>

      {/* Bottom line */}
      <div className="w-px h-8 bg-gradient-to-t from-transparent to-white/20" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BattleStart({ quizId, onReady }: BattleStartProps) {
  const [phase, setPhase] = useState<"scanning" | "found">("scanning");

  useEffect(() => {
    const t = setTimeout(() => setPhase("found"), 2200);
    return () => clearTimeout(t);
  }, []);

  const diffCfg = DIFFICULTY_CFG[QUIZ.difficulty];
  const isReady = phase === "found";

  return (
    <>
      <style>{`
        @keyframes scanning-dot {
          0%, 100% { opacity: .25; transform: scale(.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>

      <EnergyBackground variant="battle" className="h-full flex flex-col">

        {/* ── MISSION HEADER ────────────────────────────────────────────────── */}
        <div
          className="shrink-0 pt-10 pb-6 px-6 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top duration-700"
        >
          {/* Course + status row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
              <Shield size={9} className="text-primary" />
              <span className="font-display text-[9px] font-black text-primary/70 uppercase tracking-[.2em]">
                {QUIZ.course}
              </span>
            </div>

            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black font-display uppercase tracking-[.15em]", diffCfg.bg, diffCfg.border, diffCfg.color)}>
              {QUIZ.difficulty}
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
              <span className="font-display text-[9px] font-black text-white/30 uppercase tracking-[.15em]">
                {QUIZ.questions}Q
              </span>
            </div>
          </div>

          {/* Quiz name */}
          <h2
            className="font-display text-[26px] font-black text-white uppercase tracking-wide text-center leading-tight"
            style={{ textShadow: "0 0 30px hsl(var(--primary) / .3)" }}
          >
            {QUIZ.name}
          </h2>

          {/* Connection status */}
          <div className="flex items-center gap-2 h-5">
            {isReady ? (
              <div className="flex items-center gap-2 animate-in fade-in duration-300">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 6px rgba(74,222,128,.8)" }}
                />
                <span className="font-display text-[9px] font-bold text-green-400/70 uppercase tracking-[.2em]">
                  Opponent Locked
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wifi size={10} className="text-primary/50 animate-pulse" />
                <span className="font-display text-[9px] font-bold text-white/25 uppercase tracking-[.2em]">
                  Scanning Sector
                </span>
                <ScanningDots />
              </div>
            )}
          </div>
        </div>

        {/* ── FACE-OFF ──────────────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-5 min-h-0">
          <div className="w-full flex items-center gap-3">

            {/* Player */}
            <FighterCard
              player={PLAYER}
              side="left"
              label="You"
              glowColor="primary"
              revealed={true}
            />

            {/* VS */}
            <VsDivider active={true} />

            {/* Opponent */}
            {isReady ? (
              <FighterCard
                player={OPPONENT}
                side="right"
                label="Opponent"
                glowColor="danger"
                revealed={isReady}
              />
            ) : (
              // Scanning placeholder — same dimensions as FighterCard
              <div className="flex-1 flex flex-col items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-32 h-32 rounded-full border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 bg-white/[0.02]">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-primary/40 border-t-primary"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                </div>

                {/* Label + name placeholder */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-display text-[9px] font-black uppercase tracking-[.3em] text-red-400/50">
                    Opponent
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-[13px] font-black text-white/20 uppercase">
                      Searching
                    </span>
                    <ScanningDots />
                  </div>
                </div>

                {/* Stats placeholder */}
                <div className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-8 h-4 rounded bg-white/[0.05] animate-pulse" />
                        <div className="w-6 h-2 rounded bg-white/[0.03] animate-pulse" />
                      </div>
                    ))}
                  </div>
                  <div className="h-[3px] rounded-full bg-white/[0.04]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <div className="shrink-0 px-5 pb-10 pt-4 animate-in fade-in slide-in-from-bottom duration-1000">
          <button
            onClick={onReady}
            disabled={!isReady}
            className={cn(
              "relative w-full py-4 rounded-2xl overflow-hidden",
              "font-display text-[13px] font-black uppercase tracking-[.25em]",
              "flex items-center justify-center gap-2.5",
              "transition-all duration-300 active:scale-[.98] outline-none",
              isReady
                ? "text-white cursor-pointer"
                : "text-white/20 cursor-not-allowed bg-white/[0.03] border border-white/[0.06]"
            )}
            style={isReady ? {
              background: "linear-gradient(135deg, hsl(var(--primary)), color-mix(in srgb, hsl(var(--primary)) 70%, black))",
              boxShadow: "0 4px 28px hsl(var(--primary) / .4), 0 0 0 1px hsl(var(--primary) / .2)",
            } : undefined}
          >
            {/* Shimmer sweep on ready state */}
            {isReady && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,.08) 50%, transparent 65%)",
                }}
              />
            )}

            <Swords size={15} className={isReady ? "text-white" : "text-white/20"} />
            {isReady ? "Initiate Battle" : "Connecting to Peer…"}
          </button>

          {/* Subtext */}
          <p className="text-center font-display text-[9px] font-bold text-white/15 uppercase tracking-[.2em] mt-3">
            {isReady
              ? `${QUIZ.questions} questions · First to answer wins each round`
              : "Scanning sector for available opponents"}
          </p>
        </div>

      </EnergyBackground>
    </>
  );
}