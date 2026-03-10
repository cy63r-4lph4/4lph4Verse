"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy, Skull, Minus,
  Target, TrendingUp, TrendingDown,
  RotateCcw, Swords, Home, Zap, CheckCircle2, XCircle,
} from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BattleResult {
  score:          number;
  opponentScore:  number;
  correctAnswers: number;
  totalQuestions: number;
}

interface BattleResultsProps {
  result:    BattleResult;
  onRematch: () => void;
  onExit:    () => void;
}

// ─── Mock combatant data ──────────────────────────────────────────────────────
// Replace with real data passed from ArenaPage

const PLAYER = {
  name:   "ShadowScholar99",
  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=player",
  rank:   10,
};

const OPPONENT = {
  name:   "NightHawk42",
  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nighthawk",
  rank:   14,
};

// ─── Verdict config ───────────────────────────────────────────────────────────

const VERDICT = {
  win: {
    label:      "VICTORY",
    sublabel:   "Opponent Eliminated",
    color:      "text-green-400",
    shadow:     "rgba(74,222,128,.8)",
    icon:       Trophy,
    iconColor:  "text-amber-400",
    bgAccent:   "from-green-500/[0.08]",
    rankDelta:  +3,
  },
  loss: {
    label:      "DEFEATED",
    sublabel:   "Better luck next round",
    color:      "text-red-400",
    shadow:     "rgba(239,68,68,.8)",
    icon:       Skull,
    iconColor:  "text-red-400",
    bgAccent:   "from-red-500/[0.06]",
    rankDelta:  -2,
  },
  draw: {
    label:      "DRAW",
    sublabel:   "Evenly matched",
    color:      "text-amber-400",
    shadow:     "rgba(251,191,36,.8)",
    icon:       Minus,
    iconColor:  "text-amber-400",
    bgAccent:   "from-amber-500/[0.06]",
    rankDelta:  0,
  },
} as const;

type Verdict = keyof typeof VERDICT;

// ─── VerdictHeader ────────────────────────────────────────────────────────────

function VerdictHeader({ verdict, visible }: { verdict: Verdict; visible: boolean }) {
  const cfg  = VERDICT[verdict];
  const Icon = cfg.icon;

  return (
    <div className={cn(
      "flex flex-col items-center gap-2 pt-10 pb-6 transition-all duration-700",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {/* Icon with ambient glow */}
      <div className="relative mb-1">
        <div
          className="absolute inset-0 blur-2xl rounded-full"
          style={{ background: cfg.shadow, opacity: .3, transform: "scale(2)" }}
        />
        <Icon
          size={48}
          className={cn("relative z-10", cfg.iconColor)}
          style={{ filter: `drop-shadow(0 0 12px ${cfg.shadow})` }}
        />
      </div>

      {/* Verdict text */}
      <h1
        className={cn("font-display text-[48px] font-black leading-none uppercase tracking-wide", cfg.color)}
        style={{ textShadow: `0 0 30px ${cfg.shadow}, 0 0 60px ${cfg.shadow}` }}
      >
        {cfg.label}
      </h1>
      <p className="font-display text-[11px] font-bold text-white/25 uppercase tracking-[.3em]">
        {cfg.sublabel}
      </p>
    </div>
  );
}

// ─── ScoreComparison ──────────────────────────────────────────────────────────

function ScoreComparison({
  result,
  verdict,
  visible,
}: {
  result:  BattleResult;
  verdict: Verdict;
  visible: boolean;
}) {
  const [barFilled, setBarFilled] = useState(false);
  useEffect(() => {
    if (visible) { const t = setTimeout(() => setBarFilled(true), 300); return () => clearTimeout(t); }
  }, [visible]);

  const total      = result.score + result.opponentScore;
  const playerPct  = total > 0 ? (result.score / total) * 100 : 50;
  const isWin      = verdict === "win";

  return (
    <div className={cn(
      "px-4 transition-all duration-700 delay-150",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <div
        className="rounded-2xl border border-white/[0.07] overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,.025) 0%, rgba(0,0,0,.3) 100%)" }}
      >
        {/* Top accent bar — green for win, red for loss */}
        <div className={cn(
          "h-[2px] w-full",
          verdict === "win"  ? "bg-gradient-to-r from-green-500/60 via-green-400/30 to-transparent" :
          verdict === "loss" ? "bg-gradient-to-r from-red-500/60 via-red-400/30 to-transparent" :
                               "bg-gradient-to-r from-amber-500/60 via-amber-400/30 to-transparent"
        )} />

        <div className="p-5">
          {/* Both fighters */}
          <div className="flex items-center justify-between gap-4 mb-5">

            {/* Player */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="relative">
                <ArenaAvatar
                  src={PLAYER.avatar}
                  size="lg"
                  glow
                  glowColor={isWin ? "success" : "danger"}
                />
                {isWin && (
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center"
                    style={{ boxShadow: "0 0 8px rgba(251,191,36,.7)" }}
                  >
                    <Trophy size={9} className="text-black" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="font-display text-[10px] font-black text-white/40 uppercase tracking-wider truncate max-w-[80px]">
                  {PLAYER.name}
                </p>
                <p
                  className="font-display text-[28px] font-black leading-tight"
                  style={{
                    color: isWin ? "hsl(var(--primary))" : "rgba(255,255,255,.5)",
                    textShadow: isWin ? "0 0 12px hsl(var(--primary) / .5)" : "none",
                  }}
                >
                  {result.score}
                </p>
              </div>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center shrink-0 gap-1">
              <div className="w-px h-6 bg-gradient-to-b from-transparent to-white/15" />
              <span className="font-display text-[13px] font-black text-white/20 italic">VS</span>
              <div className="w-px h-6 bg-gradient-to-t from-transparent to-white/15" />
            </div>

            {/* Opponent */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="relative">
                <ArenaAvatar
                  src={OPPONENT.avatar}
                  size="lg"
                  glow
                  glowColor={!isWin && verdict !== "draw" ? "success" : "danger"}
                />
                {!isWin && verdict === "loss" && (
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center"
                    style={{ boxShadow: "0 0 8px rgba(251,191,36,.7)" }}
                  >
                    <Trophy size={9} className="text-black" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="font-display text-[10px] font-black text-white/40 uppercase tracking-wider truncate max-w-[80px]">
                  {OPPONENT.name}
                </p>
                <p
                  className="font-display text-[28px] font-black leading-tight"
                  style={{
                    color: !isWin && verdict !== "draw" ? "#ef4444" : "rgba(255,255,255,.35)",
                    textShadow: !isWin && verdict !== "draw" ? "0 0 12px rgba(239,68,68,.5)" : "none",
                  }}
                >
                  {result.opponentScore}
                </p>
              </div>
            </div>
          </div>

          {/* Relative score bar */}
          <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: barFilled ? `${playerPct}%` : "50%",
                background: isWin
                  ? "linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / .7))"
                  : "linear-gradient(to right, rgba(239,68,68,.8), rgba(239,68,68,.5))",
                boxShadow: isWin
                  ? "0 0 8px hsl(var(--primary) / .6)"
                  : "0 0 8px rgba(239,68,68,.5)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="font-display text-[8px] font-bold text-white/20 uppercase tracking-wider">You</span>
            <span className="font-display text-[8px] font-bold text-white/20 uppercase tracking-wider">Opp</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StatBreakdown ────────────────────────────────────────────────────────────

function StatBreakdown({
  result,
  verdict,
  visible,
}: {
  result:  BattleResult;
  verdict: Verdict;
  visible: boolean;
}) {
  const playerAccuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  // Simulate opponent accuracy
  const opponentCorrect  = verdict === "win"
    ? Math.max(0, result.correctAnswers - Math.floor(Math.random() * 2 + 1))
    : Math.min(result.totalQuestions, result.correctAnswers + Math.floor(Math.random() * 2 + 1));
  const opponentAccuracy = Math.round((opponentCorrect / result.totalQuestions) * 100);
  const rankDelta        = VERDICT[verdict].rankDelta;

  const stats = [
    {
      label:       "Accuracy",
      player:      `${playerAccuracy}%`,
      opponent:    `${opponentAccuracy}%`,
      playerWins:  playerAccuracy >= opponentAccuracy,
      icon:        Target,
    },
    {
      label:       "Correct",
      player:      `${result.correctAnswers}/${result.totalQuestions}`,
      opponent:    `${opponentCorrect}/${result.totalQuestions}`,
      playerWins:  result.correctAnswers >= opponentCorrect,
      icon:        CheckCircle2,
    },
  ];

  return (
    <div className={cn(
      "px-4 space-y-3 transition-all duration-700 delay-300",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>

      {/* Stat rows */}
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.025]"
          >
            {/* Player value */}
            <div className="flex-1 flex flex-col items-center">
              <span className={cn(
                "font-display text-[18px] font-black leading-none",
                stat.playerWins ? "text-white" : "text-white/35"
              )}>
                {stat.player}
              </span>
              {stat.playerWins && (
                <CheckCircle2 size={10} className="text-green-400 mt-1" />
              )}
            </div>

            {/* Label */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <Icon size={12} className="text-white/20" />
              <span className="font-display text-[8px] font-bold text-white/20 uppercase tracking-[.2em]">
                {stat.label}
              </span>
            </div>

            {/* Opponent value */}
            <div className="flex-1 flex flex-col items-center">
              <span className={cn(
                "font-display text-[18px] font-black leading-none",
                !stat.playerWins ? "text-white" : "text-white/35"
              )}>
                {stat.opponent}
              </span>
              {!stat.playerWins && (
                <CheckCircle2 size={10} className="text-green-400 mt-1" />
              )}
            </div>
          </div>
        );
      })}

      {/* Rank change pill */}
      <div className={cn(
        "flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border",
        rankDelta > 0  ? "bg-green-500/[0.06] border-green-500/20" :
        rankDelta < 0  ? "bg-red-500/[0.06]   border-red-500/20"   :
                         "bg-white/[0.03]      border-white/[0.07]"
      )}>
        {rankDelta > 0
          ? <TrendingUp  size={13} className="text-green-400" />
          : rankDelta < 0
          ? <TrendingDown size={13} className="text-red-400" />
          : <Minus size={13} className="text-white/25" />
        }
        <span className={cn(
          "font-display text-[11px] font-black uppercase tracking-[.2em]",
          rankDelta > 0 ? "text-green-400" : rankDelta < 0 ? "text-red-400" : "text-white/30"
        )}>
          {rankDelta > 0 ? `+${rankDelta}` : rankDelta} Rank {rankDelta > 0 ? "↑" : rankDelta < 0 ? "↓" : "—"}
        </span>

        {/* New rank */}
        <span className="font-display text-[9px] font-bold text-white/20 uppercase tracking-wider ml-1">
          · Now #{PLAYER.rank - rankDelta}
        </span>
      </div>
    </div>
  );
}

// ─── ResultActions ────────────────────────────────────────────────────────────

function ResultActions({
  verdict,
  onRematch,
  onNewBattle,
  onHome,
  visible,
}: {
  verdict:     Verdict;
  onRematch:   () => void;
  onNewBattle: () => void;
  onHome:      () => void;
  visible:     boolean;
}) {
  return (
    <div className={cn(
      "px-4 pb-10 pt-2 space-y-3 transition-all duration-700 delay-500",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {/* Primary: Rematch */}
      <button
        onClick={onRematch}
        className="relative w-full py-4 rounded-2xl overflow-hidden font-display text-[13px] font-black uppercase tracking-[.25em] text-white flex items-center justify-center gap-2.5 transition-all active:scale-[.98] outline-none"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), color-mix(in srgb, hsl(var(--primary)) 70%, black))",
          boxShadow: "0 4px 24px hsl(var(--primary) / .35), 0 0 0 1px hsl(var(--primary) / .2)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,.07) 50%, transparent 65%)" }}
        />
        <RotateCcw size={15} />
        Rematch
      </button>

      {/* Secondary row */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onNewBattle}
          className="py-3.5 rounded-2xl border border-white/[0.10] bg-white/[0.04] font-display text-[11px] font-black uppercase tracking-[.2em] text-white/70 flex items-center justify-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all active:scale-[.98]"
        >
          <Swords size={13} />
          New Battle
        </button>
        <button
          onClick={onHome}
          className="py-3.5 rounded-2xl border border-white/[0.10] bg-white/[0.04] font-display text-[11px] font-black uppercase tracking-[.2em] text-white/70 flex items-center justify-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all active:scale-[.98]"
        >
          <Home size={13} />
          Home
        </button>
      </div>

      {/* XP earned flash */}
      {verdict !== "loss" && (
        <div className="flex items-center justify-center gap-2 py-2">
          <Zap size={11} className="text-primary" />
          <span className="font-display text-[9px] font-bold text-primary/50 uppercase tracking-[.25em]">
            {verdict === "win" ? "+120 XP Earned" : "+40 XP · Draw Bonus"}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BattleResults({ result, onRematch, onExit }: BattleResultsProps) {
  const router  = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const verdict: Verdict =
    result.score > result.opponentScore  ? "win"  :
    result.score < result.opponentScore  ? "loss" :
                                           "draw";

  return (
    <EnergyBackground
      variant={verdict === "win" ? "default" : "battle"}
      className="h-full flex flex-col"
    >
      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-md mx-auto flex flex-col gap-4">

          <VerdictHeader verdict={verdict} visible={visible} />

          <ScoreComparison result={result} verdict={verdict} visible={visible} />

          <StatBreakdown result={result} verdict={verdict} visible={visible} />

          <ResultActions
            verdict={verdict}
            onRematch={onRematch}
            onNewBattle={() => router.push("/duels")}
            onHome={onExit}
            visible={visible}
          />

        </div>
      </div>
    </EnergyBackground>
  );
}