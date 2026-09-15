"use client";

import { useParams, useRouter } from "next/navigation";
import { Skull, Flame, ArrowRight, Brain, Zap, Target } from "lucide-react";
import { cn } from "@verse/ui";

export default function PracticeHubPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const courseBasePath = `/course/${params.id}`;

  return (
    <div className="min-h-screen w-full pb-40">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <div className="text-left">
          <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Training_Grounds</p>
          <p className="text-[8px] font-mono text-red-400 uppercase tracking-widest">Active_Simulation</p>
        </div>
      </header>

      <main className="max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-4 pt-6 md:pt-12 space-y-8">
        
        {/* LORE / INTRO */}
        <section className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <Skull size={32} className="text-red-400" />
          </div>
          <h1 className="font-display text-4xl text-white tracking-tight uppercase">The Dungeon</h1>
          <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
            A brutal, relentless survival simulation. Your rank is safe here, but your ego is not. 
            The system analyzes your past weaknesses and forces you to face them.
          </p>
        </section>

        {/* HOW IT WORKS */}
        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard 
            icon={Brain}
            title="Adaptive Weakness"
            description="The dungeon prioritizes questions you've previously failed in showdowns. Spaced repetition through suffering."
            color="amber"
          />
          <InfoCard 
            icon={Target}
            title="Zero Margin"
            description="You get exactly 3 lives. No lifelines. One wrong answer costs a life. How deep can you go?"
            color="red"
          />
          <InfoCard 
            icon={Zap}
            title="Profile XP"
            description="Build your streak multiplier. Correct answers grant raw XP to level up your global profile."
            color="emerald"
          />
        </section>

        {/* CALL TO ACTION */}
        <section className="pt-8">
          <button
            onClick={() => router.push(`${courseBasePath}/dungeon`)}
            className="w-full md:w-auto md:mx-auto flex items-center justify-center gap-3 px-8 py-5 rounded-2xl 
                       bg-gradient-to-r from-red-600 to-red-500 text-white font-display text-lg uppercase tracking-[.2em]
                       border border-red-400/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]
                       hover:shadow-[0_0_50px_rgba(239,68,68,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            <Flame size={20} className="animate-pulse" />
            Enter the Dungeon
            <ArrowRight size={20} className="text-white/50" />
          </button>
        </section>

      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description, color }: {
  icon: any;
  title: string;
  description: string;
  color: "red" | "amber" | "emerald";
}) {
  const colors = {
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  const textColors = {
    red: "text-red-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-start gap-4">
      <div className={cn("p-3 rounded-xl border", colors[color])}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className={cn("font-display text-sm uppercase tracking-widest mb-2", textColors[color])}>{title}</h3>
        <p className="text-white/40 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}