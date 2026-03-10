"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings, Trophy, Swords, Target, Zap,
  ChevronRight, LogOut, ShieldCheck, TrendingUp,
  Lock, Star,
} from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROFILE = {
  name:           "SHADOW_OPERATOR",
  avatar:         "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=shadow",
  university:     "University of Ghana",
  rank:           10,
  totalPoints:    2210,
  wins:           47,
  losses:         23,
  winRate:        67,
  streakCurrent:  3,
  streakBest:     8,
  level:          12,
  xp:             85,           // percent to next level
  globalRank:     482,
};

const COURSES = [
  { id: "phy101",  code: "PHY-101",  name: "Introduction to Physics",  rank: 4  },
  { id: "math201", code: "MATH-201", name: "Calculus II",               rank: 11 },
  { id: "chem150", code: "CHEM-150", name: "Organic Chemistry",         rank: 7  },
];

const ACHIEVEMENTS = [
  { icon: "🔥", name: "Hot Streak",    description: "Win 5 in a row",      unlocked: true  },
  { icon: "⚡", name: "Overclock",     description: "Answer under 3s",      unlocked: true  },
  { icon: "🎯", name: "Deadshot",      description: "100% accuracy",        unlocked: false },
  { icon: "👑", name: "Top Tier",      description: "Reach top 3",          unlocked: false },
  { icon: "🛡️", name: "Unbreakable",  description: "10 win streak",         unlocked: false },
  { icon: "💀", name: "Executioner",   description: "50 battle wins",        unlocked: true  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function XpBar({ xp, level }: { xp: number; level: number }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => { const t = setTimeout(() => setFilled(true), 400); return () => clearTimeout(t); }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[.2em]">
          Level {level}
        </span>
        <span className="font-display text-[9px] font-bold text-primary/60 uppercase tracking-[.15em]">
          {xp}% → Lv {level + 1}
        </span>
      </div>
      <div className="h-[4px] rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary to-primary/60 transition-all duration-1000"
          style={{
            width: filled ? `${xp}%` : "0%",
            boxShadow: "0 0 8px hsl(var(--primary) / .5)",
          }}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subValue,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  subValue?: string;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200 + index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 rounded-2xl border transition-all duration-500",
        "bg-white/2.5 border-white/6",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}
    >
      <Icon size={16} className={cn("mb-2", color)} />
      <p className="font-display text-[20px] font-black text-white leading-none">{value}</p>
      {subValue && (
        <p className="font-display text-[9px] font-bold text-white/25 mt-0.5">{subValue}</p>
      )}
      <p className="font-display text-[8px] font-bold text-white/30 uppercase tracking-[.2em] mt-1">
        {label}
      </p>
    </div>
  );
}

function AchievementCard({ achievement, index }: { achievement: typeof ACHIEVEMENTS[number]; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100 + index * 60);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={cn(
        "relative p-3 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center gap-1",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        achievement.unlocked
          ? "bg-primary/6 border-primary/20"
          : "bg-white/2 border-white/5"
      )}
      style={achievement.unlocked ? { boxShadow: "0 0 16px hsl(var(--primary) / .07)" } : undefined}
    >
      {/* Lock badge for locked achievements */}
      {!achievement.unlocked && (
        <div className="absolute top-2 right-2">
          <Lock size={9} className="text-white/20" />
        </div>
      )}

      <div className={cn("text-xl", !achievement.unlocked && "grayscale opacity-30")}>
        {achievement.icon}
      </div>
      <p className={cn(
        "font-display text-[10px] font-black uppercase tracking-wide leading-tight",
        achievement.unlocked ? "text-white" : "text-white/25"
      )}>
        {achievement.name}
      </p>
      <p className={cn(
        "font-display text-[8px] font-semibold uppercase tracking-wider leading-tight",
        achievement.unlocked ? "text-white/40" : "text-white/15"
      )}>
        {achievement.description}
      </p>

      {/* Unlocked glow dot */}
      {achievement.unlocked && (
        <div
          className="absolute top-2 right-2 w-[5px] h-[5px] rounded-full bg-primary"
          style={{ boxShadow: "0 0 6px hsl(var(--primary) / .7)" }}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Profile() {
  const router = useRouter();
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <EnergyBackground className="flex flex-col min-h-dvh">

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-14 px-4 flex items-center justify-between bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / .6))" }} />
          <span className="font-display text-[11px] font-black text-white/40 uppercase tracking-[.25em]">
            Identity Confirmed
          </span>
        </div>
        <button className="w-9 h-9 rounded-xl border border-white/10 bg-white/4 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all active:scale-90">
          <Settings size={15} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 pb-10 space-y-6 pt-5">

          {/* ── OPERATOR CARD ───────────────────────────────────────────────── */}
          <section
            className="relative rounded-2xl border border-white/8 overflow-hidden p-5"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / .06) 0%, rgba(0,0,0,.45) 100%)" }}
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-primary/60 via-primary/30 to-transparent" />

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <ArenaAvatar
                  src={PROFILE.avatar}
                  size="xl"
                  glow
                  glowColor="primary"
                />
                {/* Level badge */}
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center border-2 border-black font-display text-[10px] font-black text-black"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  {PROFILE.level}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 pt-1">
                <p className="font-display text-[18px] font-black text-white uppercase tracking-wide leading-none truncate">
                  {PROFILE.name}
                </p>
                <p className="font-display text-[10px] font-bold text-primary/50 uppercase tracking-[.2em] mt-1 mb-3">
                  {PROFILE.university}
                </p>

                {/* Rank + Points row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25">
                    <Trophy size={10} className="text-amber-400" />
                    <span className="font-display text-[10px] font-black text-amber-400 uppercase tracking-wide">
                      Rank #{PROFILE.rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/8">
                    <Zap size={10} className="text-primary" />
                    <span className="font-display text-[10px] font-black text-white/70 uppercase tracking-wide">
                      {PROFILE.totalPoints.toLocaleString()} pts
                    </span>
                  </div>
                </div>

                {/* XP bar */}
                <XpBar xp={PROFILE.xp} level={PROFILE.level} />
              </div>
            </div>
          </section>

          {/* ── COMBAT STATS ────────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-3 px-1">
              <span className="font-display text-[10px] font-bold text-white/25 uppercase tracking-[.3em] whitespace-nowrap">
                Combat Stats
              </span>
              <div className="h-px flex-1 bg-linear-to-r from-white/8 to-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <StatCard icon={Swords}     label="Wins"        value={PROFILE.wins}           subValue={`${PROFILE.losses} losses`} color="text-primary"    index={0} />
              <StatCard icon={Target}     label="Win Rate"    value={`${PROFILE.winRate}%`}  subValue="67 of 70"                   color="text-secondary"  index={1} />
              <StatCard icon={TrendingUp} label="Best Streak" value={PROFILE.streakBest}     subValue={`Now: ${PROFILE.streakCurrent}`} color="text-amber-400" index={2} />
            </div>
          </section>

          {/* ── ACHIEVEMENTS ────────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-3">
                <span className="font-display text-[10px] font-bold text-white/25 uppercase tracking-[.3em]">
                  Medals
                </span>
                <div className="h-px w-16 bg-linear-to-r from-white/[0.08] to-transparent" />
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={10} className="text-amber-400" />
                <span className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
                  {unlockedCount}/{ACHIEVEMENTS.length} Unlocked
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ACHIEVEMENTS.map((a, i) => (
                <AchievementCard key={i} achievement={a} index={i} />
              ))}
            </div>
          </section>

          {/* ── ACTIVE SECTORS ──────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-3 px-1">
              <span className="font-display text-[10px] font-bold text-white/25 uppercase tracking-[.3em] whitespace-nowrap">
                Active Sectors
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
            </div>
            <div className="space-y-2">
              {COURSES.map((course) => (
                <button
                  key={course.id}
                  onClick={() => router.push(`/course/${course.id}`)}
                  className="group w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.045] hover:border-white/[0.10] transition-all active:scale-[.98]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="font-display text-[9px] font-black text-primary leading-none">
                        {course.code.split("-")[0]}
                      </span>
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-display text-[12px] font-black text-white uppercase tracking-wide truncate">
                        {course.name}
                      </p>
                      <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider mt-0.5">
                        {course.code} · Rank #{course.rank}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={15}
                    className="text-white/25 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* ── SIGN OUT ────────────────────────────────────────────────────── */}
          <section className="pt-2">
            <button
              onClick={() => router.push("/")}
              className="w-full py-3.5 rounded-2xl border border-red-500/20 bg-red-500/[0.05] text-red-400 font-display text-[11px] font-black uppercase tracking-[.2em] flex items-center justify-center gap-2.5 hover:bg-red-500/[0.10] hover:border-red-500/35 transition-all active:scale-[.98]"
            >
              <LogOut size={13} />
              Terminate Session
            </button>
          </section>

        </div>
      </div>
    </EnergyBackground>
  );
}