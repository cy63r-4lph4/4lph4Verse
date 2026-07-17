"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft, Shuffle, Users, Clock, Hammer,
  Flame, Skull, FileText, Target, Zap
} from "lucide-react";
import { cn } from "@verse/ui";

// Tactical Components
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

// --- VALIDATED DATA STRUCTURES ---
const quizzes = [
  { id: 1, name: "Newton's Laws", difficulty: "easy", players: 23, creator: "Prof. Martinez", creatorAvatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=prof" },
  { id: 2, name: "Kinematics Challenge", difficulty: "medium", players: 18, creator: "NightHawk42", creatorAvatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nighthawk" },
  { id: 3, name: "Thermodynamics", difficulty: "hard", players: 12, creator: "Prof. Martinez", creatorAvatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=prof" },
  { id: 4, name: "Wave Mechanics", difficulty: "medium", players: 15, creator: "BlazeMaster", creatorAvatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze" },
  { id: 5, name: "Energy & Work", difficulty: "easy", players: 31, creator: "StormAce99", creatorAvatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=storm" },
];

const hazardStyles = {
  easy: "border-l-arena-success/50 bg-arena-success/5 hover:bg-arena-success/10",
  medium: "border-l-arena-warning/50 bg-arena-warning/5 hover:bg-arena-warning/10",
  hard: "border-l-arena-danger/50 bg-arena-danger/5 hover:bg-arena-danger/10",
};

export default function QuizSelection() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredQuizzes = quizzes.filter(q =>
    activeFilter === "All" || q.difficulty.toLowerCase() === activeFilter.toLowerCase()
  );
  const segments = pathname.split("/").filter(Boolean);
  const courseBasePath = "/" + segments.slice(0, 2).join("/");

  const handleRandomBattle = () => {
    const randomIdx = Math.floor(Math.random() * quizzes.length);
    router.push(`/battle-start?quiz=${quizzes[randomIdx].id}`);
  };

  return (
    <EnergyBackground className="min-h-screen pb-40">
      {/* 1. TACTICAL HEADER */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary group"
        >
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Sector_Exit</span>
        </button>
        <div className="text-right">
          <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Select_Mission</p>
          <p className="text-[8px] font-mono text-muted-foreground uppercase">Ops_Online: {quizzes.length}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">

        {/* 2. ENCOUNTER GENERATOR */}
        <section>
          <button
            onClick={handleRandomBattle}
            className="w-full relative group overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/5 p-5 transition-all active:scale-95"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Shuffle size={24} className="text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">Random_Encounter</h3>
                <p className="text-[10px] font-mono text-secondary uppercase tracking-widest">System Picked Challenge</p>
              </div>
              <Zap size={16} className="text-secondary animate-pulse" />
            </div>
          </button>
        </section>

        {/* 3. SUPPORT WINGS */}
        <section className="grid grid-cols-2 gap-3">
          <button onClick={() => router.push(`${courseBasePath}/forge`)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="relative">
              <Hammer size={20} className="text-arena-warning" />
              <Flame size={10} className="absolute -top-1 -right-1 text-orange-500 animate-pulse" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/70">The_Forge</span>
          </button>

          <button onClick={() => router.push(`${courseBasePath}/contributions`)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <FileText size={20} className="text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/70">My_Intel</span>
          </button>
        </section>

        {/* 4. PRACTICE DUNGEON */}
        <section>
          <button onClick={() => router.push(`${courseBasePath}/practice`)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Skull size={20} className="text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-[11px] font-black text-white uppercase">Practice_Dungeon</h4>
              <p className="text-[9px] font-mono text-red-500/60 uppercase">Review_Missed_Data</p>
            </div>
          </button>
        </section>

        {/* 5. MISSION FILTER */}
        <section className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {["All", "Easy", "Medium", "Hard"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border",
                activeFilter === filter
                  ? "bg-primary border-primary text-black"
                  : "bg-transparent border-white/10 text-white/40 hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </section>

        {/* 6. MISSION LIST */}
        <section className="space-y-3 pb-10">
          <div className="flex items-center gap-2 px-1">
            <Target size={12} className="text-primary" />
            <span className="text-[10px] font-mono text-primary/50 uppercase tracking-[0.3em]">Available_Contracts</span>
          </div>

          {filteredQuizzes.length > 0 ? filteredQuizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => router.push(`/battle-start?quiz=${quiz.id}`)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-l-4 border border-white/5 transition-all active:scale-[0.98] group",
                hazardStyles[quiz.difficulty as keyof typeof hazardStyles]
              )}
            >
              <div className="flex items-center gap-4">
                <ArenaAvatar src={quiz.creatorAvatar} size="md" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-white uppercase truncate">{quiz.name}</h3>
                    <span className="text-[8px] font-mono text-white/30 uppercase">{quiz.difficulty}</span>
                  </div>
                  <p className="text-[9px] font-mono text-muted-foreground uppercase mt-1">
                    Contractor: {quiz.creator}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-white/30">
                  <div className="flex items-center gap-1"><Users size={10} /><span>{quiz.players}</span></div>
                  <div className="flex items-center gap-1"><Clock size={10} /><span>10Q</span></div>
                </div>
              </div>
            </button>
          )) : (
            <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-xs font-mono text-muted-foreground uppercase">No missions found in this sector</p>
            </div>
          )}
        </section>
      </main>

    </EnergyBackground>
  );
}