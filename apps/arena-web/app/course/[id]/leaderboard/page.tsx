"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Target, Trophy } from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Player {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  trend: "up" | "down" | "same";
  change: number;
  isCurrentUser?: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const LEADERBOARD: Player[] = [
  { rank: 1,  name: "NIGHT_HAWK",       score: 2840, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nighthawk", trend: "up",   change: 2 },
  { rank: 2,  name: "BLAZE_MASTER",     score: 2720, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze",     trend: "down", change: 1 },
  { rank: 3,  name: "STORM_ACE",        score: 2650, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=storm",     trend: "up",   change: 3 },
  { rank: 4,  name: "CYBER_QUEEN",      score: 2580, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=cyber",     trend: "same", change: 0 },
  { rank: 5,  name: "PHANTOM_S",        score: 2510, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=phantom",   trend: "up",   change: 1 },
  { rank: 6,  name: "NOVA_KING",        score: 2480, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nova",      trend: "down", change: 2 },
  { rank: 7,  name: "FROST_ELITE",      score: 2420, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=frost",     trend: "up",   change: 4 },
  { rank: 8,  name: "THUNDER_PRO",      score: 2350, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=thunder",   trend: "same", change: 0 },
  { rank: 9,  name: "VENOM_WOLF",       score: 2280, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=venom",     trend: "down", change: 3 },
  { rank: 10, name: "SHADOW_OPERATOR",  score: 2210, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=shadow",    trend: "up",   change: 2, isCurrentUser: true },
];

// ─── Trend indicator ──────────────────────────────────────────────────────────

function TrendBadge({ trend, change }: { trend: Player["trend"]; change: number }) {
  if (trend === "up")   return <span className="font-display text-[11px] font-black text-green-400 leading-none">↑ +{change}</span>;
  if (trend === "down") return <span className="font-display text-[11px] font-black text-red-400   leading-none">↓ -{change}</span>;
  return <span className="font-display text-[14px] font-bold text-white/20 leading-none">—</span>;
}

// ─── Podium slot ──────────────────────────────────────────────────────────────

function PodiumSlot({ player, position }: { player: Player; position: "first" | "second" | "third" }) {
  const cfg = {
    first: {
      avatarSize: "w-[72px] h-[72px]",
      avatarBorder: "border-amber-500/50",
      ring: "border-amber-500/55",
      ringGlow: "0 0 22px rgba(245,158,11,.4), inset 0 0 12px rgba(245,158,11,.12)",
      badge: "bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,.55)]",
      nameColor: "text-white text-[12px]",
      scoreColor: "text-amber-400",
      platform: "h-14 bg-gradient-to-b from-amber-500/18 to-amber-500/4 border-amber-500/20",
      platformLabelColor: "text-amber-500/35",
      slot: "-translate-y-5",
    },
    second: {
      avatarSize: "w-[56px] h-[56px]",
      avatarBorder: "border-white/10",
      ring: "border-slate-400/35",
      ringGlow: "0 0 10px rgba(148,163,184,.15)",
      badge: "bg-slate-400 text-black",
      nameColor: "text-white/55 text-[11px]",
      scoreColor: "text-white/30",
      platform: "h-10 bg-white/[0.03] border-white/[0.06]",
      platformLabelColor: "text-white/12",
      slot: "",
    },
    third: {
      avatarSize: "w-[56px] h-[56px]",
      avatarBorder: "border-white/10",
      ring: "border-orange-700/35",
      ringGlow: "0 0 10px rgba(180,120,60,.15)",
      badge: "bg-orange-700 text-white",
      nameColor: "text-white/55 text-[11px]",
      scoreColor: "text-white/30",
      platform: "h-8 bg-white/[0.02] border-white/[0.04]",
      platformLabelColor: "text-white/10",
      slot: "",
    },
  }[position];

  return (
    <div className={cn("flex flex-col items-center gap-1.5 flex-1", cfg.slot)}>
      {position === "first" && (
        <Trophy
          size={18}
          className="text-amber-400 mb-1"
          style={{
            filter: "drop-shadow(0 0 8px rgba(245,158,11,.6))",
            animation: "trophy-bob 2.5s ease-in-out infinite",
          }}
        />
      )}

      <div className="relative">
        <div
          className={cn("absolute -inset-[3px] rounded-full border", cfg.ring)}
          style={{ boxShadow: cfg.ringGlow }}
        />
        <ArenaAvatar
          src={player.avatar}
          size={position === "first" ? "xl" : "lg"}
          className={cn("border-2 border-black/60 relative z-10", cfg.avatarBorder)}
        />
        <div
          className={cn(
            "absolute -top-1.5 -right-1.5 z-20 w-[22px] h-[22px] rounded-[7px]",
            "border-[1.5px] border-black/50 flex items-center justify-center",
            "font-display text-[11px] font-black",
            cfg.badge
          )}
        >
          {player.rank}
        </div>
      </div>

      <p className={cn("font-display font-black uppercase tracking-wide text-center max-w-[82px] truncate mt-1", cfg.nameColor)}>
        {player.name}
      </p>
      <p className={cn("font-display text-[11px] font-black tracking-wide", cfg.scoreColor)}>
        {player.score.toLocaleString()}
      </p>

      <div className={cn("w-full rounded-t-xl border border-b-0 flex items-center justify-center mt-1", cfg.platform)}>
        <span className={cn("font-display text-[9px] font-bold tracking-[.2em]", cfg.platformLabelColor)}>
          #{player.rank}
        </span>
      </div>
    </div>
  );
}

// ─── Player row ───────────────────────────────────────────────────────────────

function PlayerRow({ player, maxScore, index }: { player: Player; maxScore: number; index: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80 + index * 55);
    return () => clearTimeout(t);
  }, [index]);

  const scorePct = (player.score / maxScore) * 100;

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-2xl border overflow-hidden",
        "transition-all duration-500",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        player.isCurrentUser
          ? "bg-indigo-500/[0.08] border-indigo-500/35"
          : "bg-white/[0.025] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.09]"
      )}
      style={player.isCurrentUser ? { boxShadow: "0 0 24px rgba(99,102,241,.1), inset 0 0 20px rgba(99,102,241,.03)" } : undefined}
    >
      {/* Current user left accent bar */}
      {player.isCurrentUser && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-gradient-to-b from-indigo-400 to-indigo-600" />
      )}

      {/* Rank */}
      <span className={cn("font-display text-[13px] font-black w-7 text-center shrink-0 leading-none", player.isCurrentUser ? "text-indigo-400" : "text-white/20")}>
        {String(player.rank).padStart(2, "0")}
      </span>

      {/* Avatar */}
      <ArenaAvatar
        src={player.avatar}
        size="sm"
        className={cn(
          "shrink-0 border-2",
          player.isCurrentUser
            ? "border-indigo-500/35 shadow-[0_0_10px_rgba(99,102,241,.2)]"
            : "border-black/60"
        )}
      />

      {/* Name + score bar */}
      <div className="flex-1 min-w-0">
        <p className={cn("font-display text-[12px] font-black uppercase tracking-wide truncate leading-tight", player.isCurrentUser ? "text-indigo-300" : "text-white/85")}>
          {player.name}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", player.isCurrentUser ? "bg-indigo-500/65" : "bg-white/20")}
              style={{ width: mounted ? `${scorePct}%` : "0%", transitionDelay: `${index * 55 + 350}ms` }}
            />
          </div>
          <span className={cn("font-display text-[9px] font-bold shrink-0", player.isCurrentUser ? "text-indigo-400" : "text-white/28")}>
            {player.score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Trend + YOU tag */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <TrendBadge trend={player.trend} change={player.change} />
        {player.isCurrentUser && (
          <span className="font-display text-[8px] font-black text-indigo-400 bg-indigo-500/12 border border-indigo-500/25 rounded-md px-1.5 py-px tracking-[.2em] uppercase leading-tight">
            You
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Leaderboard() {
  const router = useRouter();

  const topThree   = LEADERBOARD.slice(0, 3);
  const restOfList = LEADERBOARD.slice(3);
  const maxScore   = LEADERBOARD[0].score;

  const currentUser = LEADERBOARD.find((p) => p.isCurrentUser);
  const nextRank    = currentUser ? LEADERBOARD.find((p) => p.rank === currentUser.rank - 1) : undefined;
  const pointsGap   = nextRank ? nextRank.score - (currentUser?.score ?? 0) : 0;
  const progressPct = nextRank ? Math.round(((currentUser?.score ?? 0) / nextRank.score) * 100) : 100;

  return (
    <>
      <style>{`
        @keyframes trophy-bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>

      <EnergyBackground className="min-h-dvh flex flex-col">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 h-14 px-4 flex items-center justify-between bg-black/70 backdrop-blur-xl border-b border-white/[0.05]">
          <button onClick={() => router.back()} className="flex items-center gap-2 group outline-none">
            <div className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center transition-all group-hover:bg-white/[0.08] group-active:scale-90">
              <ArrowLeft size={15} className="text-white/60" />
            </div>
            <span className="font-display text-[10px] font-bold text-white/35 uppercase tracking-[.2em]">Back</span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <p className="font-display text-[10px] font-black text-white/25 uppercase tracking-[.25em]">CS_101</p>
            <p className="font-display text-[13px] font-black text-white uppercase tracking-wide leading-tight">Sector Rankings</p>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-amber-400 animate-pulse" />
            <span className="font-display text-[10px] font-bold text-amber-400/65 uppercase tracking-wider">3d 14h</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto px-4 pb-8">

            {/* ── PODIUM ────────────────────────────────────────────────── */}
            <section className="relative pt-8 pb-0">
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,.08) 0%, transparent 70%)" }}
              />
              <div className="relative grid grid-cols-3 items-end gap-2">
                <PodiumSlot player={topThree[1]} position="second" />
                <PodiumSlot player={topThree[0]} position="first"  />
                <PodiumSlot player={topThree[2]} position="third"  />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            </section>

            {/* ── TARGET LOCK ───────────────────────────────────────────── */}
            {currentUser && nextRank && (
              <section className="mt-5">
                <div
                  className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.06] p-4"
                  style={{ boxShadow: "0 0 24px rgba(99,102,241,.07)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.06] to-transparent pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target size={12} className="text-indigo-400" />
                        <span className="font-display text-[10px] font-black text-indigo-400 uppercase tracking-[.2em]">
                          Next Target · Rank #{currentUser.rank - 1}
                        </span>
                      </div>
                      <span className="font-display text-[10px] font-bold text-white/25 uppercase tracking-wider">
                        {pointsGap} pts away
                      </span>
                    </div>
                    <div className="h-[5px] rounded-full bg-white/[0.06] border border-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-1000"
                        style={{ width: `${progressPct}%`, boxShadow: "0 0 8px rgba(99,102,241,.45)" }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="font-display text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
                        You · {currentUser.score.toLocaleString()}
                      </span>
                      <span className="font-display text-[9px] font-bold text-white/22 uppercase tracking-wider">
                        {nextRank.name} · {nextRank.score.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── RANKINGS LIST ─────────────────────────────────────────── */}
            <section className="mt-6 space-y-2">
              <div className="flex items-center gap-3 mb-3 px-1">
                <span className="font-display text-[10px] font-bold text-white/22 uppercase tracking-[.3em] whitespace-nowrap">
                  Full Rankings
                </span>
                <div className="h-px flex-1 bg-linear-to-r from-white/[0.07] to-transparent" />
              </div>
              {restOfList.map((player, idx) => (
                <PlayerRow key={player.rank} player={player} maxScore={maxScore} index={idx} />
              ))}
            </section>

          </div>
        </div>
      </EnergyBackground>
    </>
  );
}