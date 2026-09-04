"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Users, Trophy, Zap, ChevronRight,
  Bell, Shield, Activity, Swords,
  Radio, BookOpen, TrendingUp,
} from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import useFetch from "@verse/arena-web/hooks/useFetch";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** XP progress bar with level markers */
function XpBar({ xp, level }: { xp: number; level: number }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => { const t = setTimeout(() => setFilled(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[.2em]">
          Lv {level}
        </span>
        <span className="font-display text-[9px] font-bold text-primary/60 uppercase tracking-[.15em]">
          {xp}% → Lv {level + 1}
        </span>
      </div>
      <div className="h-[4px] rounded-full bg-white/[0.07] overflow-hidden relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
          style={{
            width: filled ? `${xp}%` : "0%",
            boxShadow: "0 0 8px rgba(var(--primary-rgb), .5)",
          }}
        />
      </div>
    </div>
  );
}

/** Stat pill — streak / global rank */
function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <Icon size={13} className={color} />
      <div>
        <p className="font-display text-[8px] font-bold text-white/25 uppercase tracking-[.2em] leading-none">
          {label}
        </p>
        <p className="font-display text-[13px] font-black text-white leading-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

/** Course card */
function CourseCard({
  course,
  index,
  onClick,
}: {
  course: { id: string; code: string; name: string; score: number; rank: number };
  index: number;
  onClick: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120 + index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-2xl border overflow-hidden",
        "bg-black/35 backdrop-blur-sm border-white/[0.07]",
        "transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        "hover:border-white/[0.14] hover:bg-white/[0.03]",
        "active:scale-[0.98]"
      )}
    >
      <div className="p-4">
        {/* Row 1: code + status badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-[10px] font-black text-primary/70 uppercase tracking-[.2em]">
            {course.code}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border bg-white/[0.06] border-white/10 text-white/35 text-[9px] font-bold font-display uppercase tracking-wider">
            {course.score ?? 0} PTS
          </div>
        </div>

        {/* Row 2: course name */}
        <p className="font-display text-[15px] font-black text-white uppercase tracking-wide leading-tight mb-3">
          {course.name}
        </p>

        {/* Row 3: rank + chevron */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Trophy size={11} className="text-white/30" />
            <span className="font-display text-[10px] font-bold text-white/40 uppercase tracking-wide">
              Rank #{course.rank ?? 1}
            </span>
          </div>

          <div className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-200 bg-white/[0.04] border-white/[0.08] group-hover:bg-white/[0.08]">
            <ChevronRight
              size={15}
              className="transition-all duration-200 group-hover:translate-x-0.5 text-white/35"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArenaLobby() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useFetch<any>('/v1/gateway/profile');

  if (isLoading) {
    return (
        <EnergyBackground className="flex flex-col h-dvh items-center justify-center" variant="intense">
          <Shield className="animate-pulse text-primary mb-4" size={32} />
          <p className="font-display text-white/50 tracking-widest text-xs uppercase animate-pulse">Syncing Grid...</p>
        </EnergyBackground>
    )
  }

  if (error || !profile) {
    return (
        <EnergyBackground className="flex flex-col h-dvh items-center justify-center" variant="intense">
          <p className="font-display text-red-500 tracking-widest text-xs uppercase">Error loading profile</p>
        </EnergyBackground>
    )
  }

  const user = {
    username: profile.name,
    avatar: profile.avatar,
    level: profile.level || 1,
    rank: profile.university || "ARENA FIGHTER",
    xp: profile.xp || 0,
    streak: profile.streakCurrent || 0,
    winRate: profile.winRate || 0,
    globalRank: "-", 
  };

  const courses = profile.sectors || [];

  return (
    <>
      <style>{`
        @keyframes shimmer-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>

      <EnergyBackground className="flex flex-col h-dvh" variant="intense">

        {/* CRT scanline overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            opacity: 0.025,
            backgroundImage:
              "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.3) 50%), linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))",
            backgroundSize: "100% 2px, 3px 100%",
          }}
        />

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header className="relative z-10 shrink-0 px-4 pt-6 pb-3">
          <div className="flex items-center justify-between">

            {/* Brand */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <Shield size={13} className="text-primary" style={{ filter: "drop-shadow(0 0 6px rgba(var(--primary-rgb),.6))" }} />
                <span className="font-display text-[18px] font-black tracking-[.3em] text-white uppercase">
                  Arena
                </span>
              </div>
              <span className="font-display text-[8px] font-bold text-white/20 tracking-[.25em] uppercase ml-5">
                v2.0 · Global
              </span>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button className="relative w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:bg-white/[0.08] hover:text-white transition-all active:scale-90">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-[6px] h-[6px] rounded-full bg-red-500 border border-black" />
              </button>

              {/* Profile pill */}
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all active:scale-95"
              >
                <div className="text-right">
                  <p className="font-display text-[10px] font-black text-white uppercase tracking-wide leading-none">
                    {user.username}
                  </p>
                  <p className="font-display text-[8px] font-bold text-primary/60 uppercase tracking-wider leading-none mt-0.5">
                    {user.rank}
                  </p>
                </div>
                <ArenaAvatar
                  src={user.avatar}
                  size="sm"
                  className="border border-primary/30"
                />
              </button>
            </div>
          </div>
        </header>

        {/* ── SCROLLABLE BODY ────────────────────────────────────────────────── */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-4 pb-6 space-y-6">

          {/* ── PLAYER IDENTITY CARD ──────────────────────────────────────── */}
          <section
            className="rounded-2xl border border-white/[0.08] overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(var(--primary-rgb),.06) 0%, rgba(0,0,0,.4) 100%)" }}
          >
            <div className="p-4 flex items-center gap-4">
              {/* Avatar with level ring */}
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-[3px] rounded-full border border-primary/40"
                  style={{ boxShadow: "0 0 14px rgba(var(--primary-rgb),.25)" }}
                />
                <ArenaAvatar src={user.avatar} size="lg" className="relative z-10" />
                {/* Level badge */}
                <div className="absolute -bottom-1 -right-1 z-20 w-6 h-6 rounded-lg bg-primary flex items-center justify-center border-2 border-black">
                  <span className="font-display text-[9px] font-black text-black leading-none">{user.level}</span>
                </div>
              </div>

              {/* Name + XP bar */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-[16px] font-black text-white uppercase tracking-wide leading-none mb-1">
                  {user.username}
                </p>
                <p className="font-display text-[10px] font-bold text-primary/60 uppercase tracking-wider mb-3">
                  {user.rank}
                </p>
                <XpBar xp={user.xp} level={user.level} />
              </div>
            </div>

            {/* Stat pills row */}
            <div className="grid grid-cols-3 gap-2 px-4 pb-4">
              <StatPill icon={Zap}       label="Streak"      value={`${user.streak}d`}       color="text-primary" />
              <StatPill icon={Trophy}    label="Global"      value={user.globalRank}    color="text-amber-400" />
              <StatPill icon={TrendingUp} label="Win Rate"   value={`${user.winRate}%`}                      color="text-green-400" />
            </div>
          </section>

          {/* ── ACTIVE SECTORS ──────────────────────────────────────────────── */}
          <section className="space-y-3">
            {/* Section header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-primary" />
                <span className="font-display text-[11px] font-black text-white/70 uppercase tracking-[.2em]">
                  Your Sectors
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-[5px] h-[5px] rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 6px rgba(74,222,128,.6)" }}
                />
                <span className="font-display text-[9px] font-bold text-green-400/70 uppercase tracking-wider">
                  Grid Sync
                </span>
              </div>
            </div>

            {/* Course cards */}
            <div className="space-y-2.5">
              {courses.length === 0 ? (
                <div className="text-center py-6 border border-white/[0.08] rounded-2xl bg-white/[0.02]">
                  <p className="font-display text-white/40 text-xs uppercase tracking-wider">No sectors found</p>
                  <p className="font-display text-white/20 text-[10px] mt-1">Join a course to begin</p>
                </div>
              ) : (
                courses.map((course: any, idx: number) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={idx}
                    onClick={() => router.push(`/course/${course.id}`)}
                  />
                ))
              )}
            </div>
          </section>

        </main>

        {/* ── FOOTER CTA ────────────────────────────────────────────────────── */}
        <footer className="shrink-0 px-4 pb-6 pt-3">
          {/* Gradient fade above footer */}
          <div className="absolute bottom-[88px] left-0 right-0 h-8 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />

          <button
            onClick={() => router.push("/join-course")}
            className="relative w-full py-4 rounded-2xl overflow-hidden font-display text-[13px] font-black uppercase tracking-[.2em] text-white flex items-center justify-center gap-2.5 transition-all active:scale-[.98] outline-none"
            style={{
              background: "linear-gradient(135deg, var(--primary, #6366f1), color-mix(in srgb, var(--primary, #6366f1) 70%, black))",
              boxShadow: "0 4px 24px rgba(var(--primary-rgb), .35)",
            }}
          >
            {/* Shimmer sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,.08) 50%, transparent 65%)",
              }}
            />
            <Plus size={16} />
            Join a Course
          </button>

          {/* System status line */}
          <div className="flex justify-between items-center mt-3 px-1 opacity-30">
            <div className="flex items-center gap-1.5">
              <Swords size={10} className="text-white" />
              <span className="font-display text-[8px] font-bold text-white uppercase tracking-[.2em]">
                System Ready
              </span>
            </div>
            <span className="font-display text-[8px] font-bold text-primary uppercase tracking-[.15em]">
              Latency: 24ms
            </span>
          </div>
        </footer>

      </EnergyBackground>
    </>
  );
}
