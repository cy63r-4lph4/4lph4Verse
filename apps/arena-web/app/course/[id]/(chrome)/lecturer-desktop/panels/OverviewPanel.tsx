"use client";

import { useRouter } from "next/navigation";
import { Trophy, Hammer, Library, Swords, Zap, Users, Activity, ChevronRight, Target, BarChart2 } from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useQuestionBank } from "@verse/arena-web/hooks/useQuestionBank";
import { useTournaments } from "@verse/arena-web/hooks/useTournaments";
import { useCoursePresence } from "@verse/arena-web/hooks/useCoursePresence";
import { useFeed } from "@verse/arena-web/hooks/useFeed";
import type { PanelId } from "../LecturerDashboard";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

function StatCard({
  label, value, sub, accent, icon: Icon, onClick,
}: {
  label: string; value: string | number; sub?: string;
  accent: string; icon: React.ElementType; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 min-w-0 relative flex flex-col gap-2 p-5 rounded-2xl border overflow-hidden text-left transition-all",
        onClick ? "hover:scale-[1.02] active:scale-[0.98] cursor-pointer" : "cursor-default",
        accent,
      )}
    >
      <div className="flex items-center justify-between">
        <Icon size={16} className="text-current opacity-60" />
        {onClick && <ChevronRight size={12} className="text-current opacity-30" />}
      </div>
      <div>
        <p className="font-display text-[28px] font-black leading-none text-white">{value}</p>
        <p className="font-display text-[8px] font-bold uppercase tracking-[.25em] opacity-50 mt-1">{label}</p>
        {sub && <p className="font-display text-[8px] font-bold uppercase tracking-[.15em] opacity-30 mt-0.5">{sub}</p>}
      </div>
    </button>
  );
}

interface OverviewPanelProps {
  courseId: string;
  pendingForgeCount: number;
  onNavigate: (panel: PanelId) => void;
}

export function OverviewPanel({ courseId, pendingForgeCount, onNavigate }: OverviewPanelProps) {
  const router = useRouter();
  const { data: questions = [] } = useQuestionBank(courseId);
  const { data: tournaments = [] } = useTournaments(courseId);
  const presence = useCoursePresence(courseId);
  const { data: feedItems = [], isLoading: feedLoading } = useFeed(courseId);

  const liveTourneys = tournaments.filter((t: any) => ["lobby", "seeding", "live"].includes(t.status));
  const onlineFighters = presence.filter(p => p.status === "online");

  const difficultyBreakdown = {
    easy:   questions.filter((q: any) => q.difficulty === "easy").length,
    medium: questions.filter((q: any) => q.difficulty === "medium").length,
    hard:   questions.filter((q: any) => q.difficulty === "hard").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── STATS ROW */}
      <section>
        <p className="font-display text-[8px] font-black text-white/18 uppercase tracking-[.3em] mb-3">Live Stats</p>
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Fighters Online" value={onlineFighters.length}
            sub={`${presence.length} total`}
            accent="bg-sky-500/[0.06] border-sky-500/20 text-sky-400"
            icon={Users} onClick={() => onNavigate("roster")}
          />
          <StatCard
            label="Question Bank" value={questions.length}
            sub={`${difficultyBreakdown.easy}E / ${difficultyBreakdown.medium}M / ${difficultyBreakdown.hard}H`}
            accent="bg-violet-500/[0.06] border-violet-500/20 text-violet-400"
            icon={Library} onClick={() => onNavigate("bank")}
          />
          <StatCard
            label="Pending Forge" value={pendingForgeCount}
            sub="awaiting review"
            accent={pendingForgeCount > 0
              ? "bg-amber-500/[0.07] border-amber-500/25 text-amber-400"
              : "bg-white/[0.03] border-white/[0.07] text-white/40"}
            icon={Hammer} onClick={() => onNavigate("forge")}
          />
          <StatCard
            label="Live Tournaments" value={liveTourneys.length}
            sub={`${tournaments.length} total`}
            accent={liveTourneys.length > 0
              ? "bg-red-500/[0.07] border-red-500/20 text-red-400"
              : "bg-white/[0.03] border-white/[0.07] text-white/40"}
            icon={Trophy} onClick={() => onNavigate("tournaments")}
          />
        </div>
      </section>

      {/* ── LOWER TWO-COLUMN */}
      <div className="grid grid-cols-3 gap-5">
        {/* LEFT: Live Session Monitor (2/3) */}
        <section className="col-span-2 space-y-4">
          {/* Online presence */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: "0 0 5px rgba(74,222,128,.7)" }} />
                <p className="font-display text-[10px] font-black text-white uppercase tracking-[.25em]">Live Session Monitor</p>
              </div>
              <span className="font-display text-[8px] font-bold text-white/25 uppercase tracking-wider">{onlineFighters.length} active</span>
            </div>
            <div className="p-4">
              {onlineFighters.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Activity size={20} className="text-white/10" />
                  <p className="font-display text-[9px] font-bold text-white/18 uppercase tracking-[.25em]">No fighters online right now</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {onlineFighters.map(f => (
                    <div key={f.arenaUserId}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-green-500/20 transition-colors">
                      <div className="relative">
                        <ArenaAvatar src={dicebearUrl(f.username)} size="sm" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-black" style={{ boxShadow: "0 0 4px rgba(74,222,128,.6)" }} />
                      </div>
                      <p className="font-display text-[10px] font-black text-white uppercase tracking-wide truncate">{f.username}</p>
                    </div>
                  ))}
                  {presence.filter(p => p.status === "recent").map(f => (
                    <div key={f.arenaUserId}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                      <div className="relative">
                        <ArenaAvatar src={dicebearUrl(f.username)} size="sm" className="opacity-40 grayscale" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-black" />
                      </div>
                      <p className="font-display text-[10px] font-black text-white/30 uppercase tracking-wide truncate">{f.username}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question bank breakdown */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <BarChart2 size={12} className="text-violet-400" />
                <p className="font-display text-[10px] font-black text-white uppercase tracking-[.25em]">Question Bank Breakdown</p>
              </div>
              <button onClick={() => onNavigate("bank")} className="font-display text-[8px] font-bold text-primary/60 uppercase tracking-wider hover:text-primary transition-colors">
                Manage →
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Easy",   count: difficultyBreakdown.easy,   color: "bg-emerald-500", text: "text-emerald-400",  total: questions.length },
                { label: "Medium", count: difficultyBreakdown.medium, color: "bg-amber-500",   text: "text-amber-400",   total: questions.length },
                { label: "Hard",   count: difficultyBreakdown.hard,   color: "bg-red-500",     text: "text-red-400",     total: questions.length },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className={cn("font-display text-[9px] font-black uppercase tracking-wider w-12 shrink-0", row.text)}>{row.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", row.color)}
                      style={{ width: row.total > 0 ? `${(row.count / row.total) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="font-display text-[10px] font-black text-white/50 w-8 text-right shrink-0">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT: Activity Feed + Quick Actions (1/3) */}
        <section className="space-y-4">
          {/* Quick actions */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="font-display text-[10px] font-black text-white uppercase tracking-[.25em]">Quick Actions</p>
            </div>
            <div className="p-3 space-y-2">
              {[
                {
                  label: "Launch Tournament", icon: Trophy, color: "text-amber-400",
                  bg: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15",
                  action: () => router.push(`/course/${courseId}/duels/tournament/create`),
                },
                {
                  label: "Review Forge Queue", icon: Hammer, color: "text-orange-400",
                  bg: "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/15",
                  action: () => onNavigate("forge"),
                },
                {
                  label: "Add Questions", icon: Library, color: "text-violet-400",
                  bg: "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/15",
                  action: () => onNavigate("bank"),
                },
                {
                  label: "View Leaderboard", icon: Target, color: "text-emerald-400",
                  bg: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15",
                  action: () => onNavigate("leaderboard"),
                },
              ].map(({ label, icon: Icon, color, bg, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all active:scale-[0.98] text-left",
                    bg,
                  )}
                >
                  <Icon size={13} className={color} />
                  <span className="font-display text-[10px] font-black text-white/80 uppercase tracking-wide">{label}</span>
                  <ChevronRight size={11} className="ml-auto text-white/20" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <Activity size={11} className="text-primary animate-pulse" />
              <p className="font-display text-[10px] font-black text-white uppercase tracking-[.25em]">Recent Activity</p>
            </div>
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto styled-scrollbar">
              {feedLoading && (
                <p className="font-display text-[8px] text-white/20 uppercase tracking-widest text-center py-6">Loading…</p>
              )}
              {!feedLoading && feedItems.length === 0 && (
                <p className="font-display text-[8px] text-white/18 uppercase tracking-widest text-center py-6">No activity yet</p>
              )}
              {feedItems.slice(0, 8).map((item: any) => (
                <div key={item.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <ArenaAvatar src={dicebearUrl(item.authorName ?? item.author ?? "?")} size="sm" className="shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[9px] font-black text-white uppercase tracking-wide truncate">
                      {item.authorName ?? item.author}
                    </p>
                    <p className="font-display text-[8px] font-bold text-white/30 leading-relaxed line-clamp-2 mt-0.5">
                      {item.content ?? item.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
