"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Library, Hammer, Trophy, BarChart3,
  Globe, Bell, LogOut, ChevronDown, CheckCircle2, Zap, Shield, MessageSquare,
} from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { Course, CurrentUser } from "@verse/arena-web/lib/course/types";
import { useNotifications } from "@verse/arena-web/hooks/useNotifications";

import { OverviewPanel } from "./panels/OverviewPanel";
import { FighterRosterPanel } from "./panels/FighterRosterPanel";
import { QuestionBankPanel } from "./panels/QuestionBankPanel";
import { ForgeReviewPanel } from "./panels/ForgeReviewPanel";
import { TournamentPanel } from "./panels/TournamentPanel";
import { LeaderboardPanel } from "./panels/LeaderboardPanel";
import { DatapadsPanel } from "./panels/DatapadsPanel";
import { ConsolePanel } from "./panels/ConsolePanel";
import { BookOpen } from "lucide-react";

export type PanelId = "overview" | "roster" | "bank" | "forge" | "tournaments" | "leaderboard" | "datapads" | "console";

const NAV_ITEMS: {
  id: PanelId;
  label: string;
  icon: React.ElementType;
  accent: string;
  accentBg: string;
  badgeKey?: "forge";
}[] = [
  { id: "overview",     label: "Overview",      icon: LayoutDashboard, accent: "text-indigo-400", accentBg: "bg-indigo-500/10 border-indigo-500/25" },
  { id: "roster",       label: "Roster",         icon: Users,           accent: "text-sky-400",    accentBg: "bg-sky-500/10 border-sky-500/25" },
  { id: "bank",         label: "Question Bank",  icon: Library,         accent: "text-violet-400", accentBg: "bg-violet-500/10 border-violet-500/25" },
  { id: "forge",        label: "Forge Queue",    icon: Hammer,          accent: "text-orange-400", accentBg: "bg-orange-500/10 border-orange-500/25", badgeKey: "forge" },
  { id: "tournaments",  label: "Tournaments",    icon: Trophy,          accent: "text-amber-400",  accentBg: "bg-amber-500/10 border-amber-500/25" },
  { id: "leaderboard",  label: "Leaderboard",    icon: BarChart3,       accent: "text-emerald-400",accentBg: "bg-emerald-500/10 border-emerald-500/25" },
  { id: "datapads",     label: "Datapads",       icon: BookOpen,        accent: "text-cyan-400",   accentBg: "bg-cyan-500/10 border-cyan-500/25" },
  { id: "console",      label: "Console",        icon: MessageSquare,   accent: "text-rose-400",   accentBg: "bg-rose-500/10 border-rose-500/25" },
];

interface LecturerDashboardProps {
  currentCourse: Course;
  allCourses: Course[];
  currentUser: CurrentUser;
  pendingForgeCount: number;
}

export function LecturerDashboard({
  currentCourse,
  allCourses,
  currentUser,
  pendingForgeCount,
}: LecturerDashboardProps) {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<PanelId>("overview");
  const [sectorOpen, setSectorOpen] = useState(false);
  const { incoming } = useNotifications(currentCourse.id);

  const badges: Record<string, number> = {
    forge: pendingForgeCount,
  };

  const activeItem = NAV_ITEMS.find((n) => n.id === activePanel)!;

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* ════════════ SIDEBAR ════════════ */}
      <aside
        className="flex flex-col w-64 shrink-0 h-full border-r border-white/[0.06] overflow-hidden relative"
        style={{ background: "linear-gradient(180deg, rgba(10,10,20,0.99) 0%, rgba(5,5,12,0.99) 100%)" }}
      >
        {/* Scanlines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
          }}
        />
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />

        {/* Brand / Sector Switcher */}
        <div className="relative px-3 pt-4 pb-2">
          <button
            onClick={() => setSectorOpen(o => !o)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.04] transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0"
              style={{ boxShadow: "0 0 14px hsl(var(--primary) / .15)" }}
            >
              <Globe size={15} className="text-primary" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-display text-[12px] font-black text-white uppercase tracking-wide truncate leading-tight">
                {currentCourse.code}
              </p>
              <p className="font-display text-[8px] font-bold text-primary/40 uppercase tracking-[.2em] leading-none mt-0.5">
                Sector {String(allCourses.findIndex(c => c.id === currentCourse.id) + 1).padStart(2, "0")} · Instructor
              </p>
            </div>
            <ChevronDown size={11} className={cn("text-white/25 transition-transform duration-200 shrink-0", sectorOpen && "rotate-180")} />
          </button>

          {sectorOpen && (
            <div className="mt-1 bg-black/95 border border-white/[0.08] rounded-2xl p-1.5 shadow-2xl animate-in slide-in-from-top-1 duration-150 z-50 relative">
              {allCourses.map(course => {
                const isActive = course.id === currentCourse.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => { router.push(`/course/${course.id}`); setSectorOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left",
                      isActive ? "bg-primary/15 border border-primary/20" : "hover:bg-white/[0.04] border border-transparent"
                    )}
                  >
                    <div className={cn("w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 font-display text-[8px] font-black",
                      isActive ? "bg-primary/15 border-primary/30 text-primary" : "bg-white/[0.04] border-white/[0.08] text-white/30"
                    )}>
                      {course.code.split("-")[0].slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[10px] font-black text-white uppercase tracking-wide truncate">{course.name}</p>
                      <p className="font-display text-[8px] font-bold text-white/30 uppercase tracking-wider">{course.code}</p>
                    </div>
                    {isActive && <CheckCircle2 size={10} className="text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        {/* Live pulse */}
        <div className="px-5 py-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: "0 0 5px rgba(74,222,128,.7)" }} />
          <span className="font-display text-[8px] font-black text-green-400/55 uppercase tracking-[.25em]">
            {currentCourse.members} fighters online
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto styled-scrollbar">
          <p className="px-3 pt-1 pb-2 font-display text-[7px] font-black text-white/18 uppercase tracking-[.3em]">
            Command Panels
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            const badge = item.badgeKey ? badges[item.badgeKey] : 0;

            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative group",
                  isActive
                    ? cn("border", item.accentBg)
                    : "hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                )}
                <Icon
                  size={14}
                  className={cn("shrink-0 transition-colors", isActive ? item.accent : "text-white/28 group-hover:text-white/55")}
                />
                <span className={cn(
                  "flex-1 text-left font-display text-[10px] font-black uppercase tracking-wide transition-colors",
                  isActive ? "text-white" : "text-white/38 group-hover:text-white/70"
                )}>
                  {item.label}
                </span>
                {badge > 0 && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded-full font-display text-[8px] font-black text-black bg-amber-400"
                    style={{ boxShadow: "0 0 7px rgba(251,191,36,.5)" }}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Instructor identity card */}
        <div className="mx-2.5 mb-3 p-3 rounded-2xl border border-orange-500/15 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(0,0,0,0.3) 100%)" }}>
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-400/50 via-orange-500/30 to-transparent rounded-l-2xl" />
          <div className="flex items-center gap-2.5 pl-1">
            <ArenaAvatar src={currentUser.avatar} size="sm" glow glowColor="primary" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Shield size={8} className="text-orange-400 shrink-0" style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,.7))" }} />
                <p className="font-display text-[10px] font-black text-white uppercase tracking-wide truncate">{currentUser.name}</p>
              </div>
              <p className="font-display text-[7px] font-bold text-orange-400/45 uppercase tracking-[.2em]">Instructor · Elevated Access</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2 pl-1">
            <button
              onClick={() => router.push(`/course/${currentCourse.id}/notifications`)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all relative"
            >
              <Bell size={10} className="text-white/35" />
              <span className="font-display text-[7px] font-bold text-white/30 uppercase tracking-wider">Alerts</span>
              {incoming.length > 0 && <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />}
            </button>
            <button
              onClick={() => { localStorage.removeItem("arena_token"); window.location.href = "/login"; }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-red-500/10 hover:border-red-500/25 transition-all"
            >
              <LogOut size={10} className="text-white/30" />
            </button>
          </div>
        </div>
      </aside>

      {/* ════════════ MAIN CONTENT ════════════ */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/[0.06]"
          style={{ background: "rgba(7,7,16,0.97)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = activeItem.icon;
              return (
                <>
                  <div className={cn("w-8 h-8 rounded-xl border flex items-center justify-center", activeItem.accentBg)}>
                    <Icon size={14} className={activeItem.accent} />
                  </div>
                  <div>
                    <p className="font-display text-[12px] font-black text-white uppercase tracking-wide leading-tight">
                      {activeItem.label}
                    </p>
                    <p className="font-display text-[8px] font-bold text-white/22 uppercase tracking-[.2em]">
                      {currentCourse.name}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/18 bg-orange-500/[0.04]">
              <Zap size={9} className="text-orange-400" style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,.7))" }} />
              <span className="font-display text-[7px] font-black text-orange-400/65 uppercase tracking-[.2em]">
                Instructor Console
              </span>
              <div className="w-1 h-1 rounded-full bg-orange-400 ml-0.5" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
        </header>

        {/* Panel area */}
        <main className="flex-1 min-h-0 overflow-y-auto styled-scrollbar bg-[rgba(6,6,14,0.98)]">
          {activePanel === "overview"    && <OverviewPanel    courseId={currentCourse.id} pendingForgeCount={pendingForgeCount} onNavigate={setActivePanel} />}
          {activePanel === "roster"      && <FighterRosterPanel courseId={currentCourse.id} />}
          {activePanel === "bank"        && <QuestionBankPanel  courseId={currentCourse.id} />}
          {activePanel === "forge"       && <ForgeReviewPanel   courseId={currentCourse.id} />}
          {activePanel === "tournaments" && <TournamentPanel    courseId={currentCourse.id} />}
          {activePanel === "leaderboard" && <LeaderboardPanel   courseId={currentCourse.id} />}
          {activePanel === "datapads"    && <DatapadsPanel      courseId={currentCourse.id} />}
          {activePanel === "console"     && <ConsolePanel       courseId={currentCourse.id} currentUser={currentUser} />}
        </main>
      </div>
    </div>
  );
}
