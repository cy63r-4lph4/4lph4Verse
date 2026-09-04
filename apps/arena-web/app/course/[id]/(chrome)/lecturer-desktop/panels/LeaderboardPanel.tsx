"use client";

import { useState, useEffect } from "react";
import { Trophy, Target, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

interface Player {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
  trend: "up" | "down" | "same";
  change: number;
  arenaUserId?: string;
}

function TrendBadge({ trend, change }: { trend: Player["trend"]; change: number }) {
  if (trend === "up")   return <span className="flex items-center gap-0.5 font-display text-[10px] font-black text-emerald-400"><ArrowUp size={9} />+{change}</span>;
  if (trend === "down") return <span className="flex items-center gap-0.5 font-display text-[10px] font-black text-red-400"><ArrowDown size={9} />-{change}</span>;
  return <span className="font-display text-[12px] font-bold text-white/20"><Minus size={10} /></span>;
}

function PodiumSlot({ player, position }: { player: Player | undefined; position: "first" | "second" | "third" }) {
  const cfgs = {
    first:  { avatarSize: "xl" as const, badge: "bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,.6)]", ring: "border-amber-500/50", score: "text-amber-400", slot: "-translate-y-4", label: "text-[12px]", platformH: "h-16 bg-amber-500/10 border-amber-500/15", crown: true },
    second: { avatarSize: "lg" as const,  badge: "bg-slate-400 text-black",    ring: "border-slate-400/30",    score: "text-white/35", slot: "",            label: "text-[10px]", platformH: "h-10 bg-white/[0.03] border-white/[0.05]",  crown: false },
    third:  { avatarSize: "lg" as const,  badge: "bg-orange-700 text-white",   ring: "border-orange-700/30",   score: "text-white/30", slot: "",            label: "text-[10px]", platformH: "h-8  bg-white/[0.02] border-white/[0.04]",  crown: false },
  }[position];

  if (!player) return <div className={cn("flex flex-col items-center flex-1", cfgs.slot)} />;

  return (
    <div className={cn("flex flex-col items-center gap-1.5 flex-1", cfgs.slot)}>
      {cfgs.crown && <Trophy size={16} className="text-amber-400 mb-1" style={{ filter: "drop-shadow(0 0 6px rgba(245,158,11,.6))", animation: "trophy-bob 2.5s ease-in-out infinite" }} />}
      <div className="relative">
        <div className={cn("absolute -inset-[3px] rounded-full border", cfgs.ring)} style={{ boxShadow: position === "first" ? "0 0 18px rgba(245,158,11,.25)" : undefined }} />
        <ArenaAvatar src={player.avatar ?? dicebearUrl(player.name)} size={cfgs.avatarSize} className="border-2 border-black/60 relative z-10" />
        <div className={cn("absolute -top-1.5 -right-1.5 z-20 w-[22px] h-[22px] rounded-[7px] border-[1.5px] border-black/50 flex items-center justify-center font-display text-[11px] font-black", cfgs.badge)}>
          {player.rank}
        </div>
      </div>
      <p className={cn("font-display font-black uppercase tracking-wide text-center max-w-[88px] truncate mt-0.5 text-white", cfgs.label)}>{player.name}</p>
      <p className={cn("font-display text-[11px] font-black", cfgs.score)}>{player.score.toLocaleString()}</p>
      <div className={cn("w-full rounded-t-xl border border-b-0 flex items-center justify-center mt-1", cfgs.platformH)}>
        <span className="font-display text-[9px] font-bold text-white/20 tracking-[.2em]">#{player.rank}</span>
      </div>
    </div>
  );
}

export function LeaderboardPanel({ courseId }: { courseId: string }) {
  const token = useArenaToken();
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !courseId) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/arena/courses/${courseId}/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setLeaderboard(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, courseId]);

  const topThree   = leaderboard.slice(0, 3);
  const restOfList = leaderboard.slice(3);
  const maxScore   = leaderboard.length > 0 ? leaderboard[0].score : 1;

  return (
    <div className="p-6 space-y-6">
      <style>{`@keyframes trophy-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>

      <div>
        <h2 className="font-display text-[16px] font-black text-white uppercase tracking-wide">Leaderboard</h2>
        <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[.2em] mt-0.5">
          {leaderboard.length} fighters ranked
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* LEFT: Podium */}
          <div className="col-span-1">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="font-display text-[8px] font-black text-white/20 uppercase tracking-[.3em] text-center mb-5">Top Fighters</p>
              <div className="relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(245,158,11,.07) 0%, transparent 70%)" }} />
                <div className="grid grid-cols-3 items-end gap-1">
                  <PodiumSlot player={topThree[1]} position="second" />
                  <PodiumSlot player={topThree[0]} position="first" />
                  <PodiumSlot player={topThree[2]} position="third" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Full list */}
          <div className="col-span-2">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
              <div className="grid grid-cols-[2.5rem_1fr_7rem_4rem] gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                {["Rank", "Fighter", "Score", "Trend"].map(h => (
                  <span key={h} className="font-display text-[8px] font-black text-white/20 uppercase tracking-[.2em]">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-white/[0.04] max-h-[calc(100vh-20rem)] overflow-y-auto styled-scrollbar">
                {leaderboard.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <Target size={24} className="text-white/10" />
                    <p className="font-display text-[9px] text-white/18 uppercase tracking-widest">No data yet</p>
                  </div>
                )}
                {leaderboard.map((player, idx) => {
                  const scorePct = maxScore > 0 ? (player.score / maxScore) * 100 : 0;
                  const isTop3 = player.rank <= 3;
                  return (
                    <div
                      key={player.rank}
                      className={cn(
                        "grid grid-cols-[2.5rem_1fr_7rem_4rem] gap-3 px-4 py-3 items-center transition-colors",
                        isTop3 ? "bg-amber-500/[0.03]" : "hover:bg-white/[0.02]"
                      )}
                    >
                      <span className={cn("font-display text-[12px] font-black text-center", isTop3 ? "text-amber-400" : "text-white/20")}>
                        {String(player.rank).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ArenaAvatar src={player.avatar ?? dicebearUrl(player.name)} size="sm" className="shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-[11px] font-black text-white/80 uppercase tracking-wide truncate">{player.name}</p>
                          <div className="mt-1.5 h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${scorePct}%`,
                                background: isTop3
                                  ? "linear-gradient(to right, rgba(245,158,11,.6), rgba(245,158,11,.3))"
                                  : "rgba(255,255,255,0.15)"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="font-display text-[12px] font-black text-white/50 text-right">
                        {player.score.toLocaleString()}
                      </span>
                      <div className="flex justify-end">
                        <TrendBadge trend={player.trend} change={player.change} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
