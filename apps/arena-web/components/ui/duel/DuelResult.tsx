"use client";

import { useEffect, useState } from "react";
import { Trophy, Skull, Minus, Target, CheckCircle2, RotateCcw, Home } from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

type Verdict = "win" | "loss" | "draw";

const VERDICT_CFG: Record<Verdict, { label: string; sublabel: string; color: string; shadow: string; icon: any; iconColor: string }> = {
  win: { label: "VICTORY", sublabel: "Opponent bested", color: "text-green-400", shadow: "rgba(74,222,128,.8)", icon: Trophy, iconColor: "text-amber-400" },
  loss: { label: "DEFEATED", sublabel: "Better luck next round", color: "text-red-400", shadow: "rgba(239,68,68,.8)", icon: Skull, iconColor: "text-red-400" },
  draw: { label: "DRAW", sublabel: "Evenly matched", color: "text-amber-400", shadow: "rgba(251,191,36,.8)", icon: Minus, iconColor: "text-amber-400" },
};

interface DuelResultProps {
  verdict: Verdict;
  myName: string;
  opponentName: string;
  myScore: number;
  opponentScore: number;
  myCorrectCount: number;
  totalQuestions: number;
  onRematch: () => void;
  onHome: () => void;
}

export function DuelResult({
  verdict, myName, opponentName, myScore, opponentScore, myCorrectCount, totalQuestions, onRematch, onHome,
}: DuelResultProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const cfg = VERDICT_CFG[verdict];
  const Icon = cfg.icon;
  const total = myScore + opponentScore;
  const myPct = total > 0 ? (myScore / total) * 100 : 50;
  const accuracy = totalQuestions > 0 ? Math.round((myCorrectCount / totalQuestions) * 100) : 0;
  const isWin = verdict === "win";

  return (
    <EnergyBackground variant={isWin ? "duel" : "battle"} className="h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-md mx-auto flex flex-col gap-4">
          <div className={cn("flex flex-col items-center gap-2 pt-10 pb-6 transition-all duration-700", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
            <div className="relative mb-1">
              <div className="absolute inset-0 blur-2xl rounded-full" style={{ background: cfg.shadow, opacity: 0.3, transform: "scale(2)" }} />
              <Icon size={48} className={cn("relative z-10", cfg.iconColor)} style={{ filter: `drop-shadow(0 0 12px ${cfg.shadow})` }} />
            </div>
            <h1 className={cn("font-display text-[48px] font-black leading-none uppercase tracking-wide", cfg.color)} style={{ textShadow: `0 0 30px ${cfg.shadow}, 0 0 60px ${cfg.shadow}` }}>
              {cfg.label}
            </h1>
            <p className="font-display text-[11px] font-bold text-white/25 uppercase tracking-[.3em]">{cfg.sublabel}</p>
          </div>

          <div className={cn("px-4 transition-all duration-700 delay-150", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(255,255,255,.025) 0%, rgba(0,0,0,.3) 100%)" }}>
              <div className="p-5">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <ArenaAvatar src={dicebearUrl(myName)} size="lg" glow glowColor={isWin ? "success" : "danger"} />
                    <div className="text-center">
                      <p className="font-display text-[10px] font-black text-white/40 uppercase tracking-wider truncate max-w-[80px]">{myName}</p>
                      <p className="font-display text-[28px] font-black leading-tight" style={{ color: isWin ? "hsl(var(--primary))" : "rgba(255,255,255,.5)" }}>{myScore}</p>
                    </div>
                  </div>
                  <span className="font-display text-[13px] font-black text-white/20 italic shrink-0">VS</span>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <ArenaAvatar src={dicebearUrl(opponentName)} size="lg" glow glowColor={!isWin && verdict !== "draw" ? "success" : "danger"} />
                    <div className="text-center">
                      <p className="font-display text-[10px] font-black text-white/40 uppercase tracking-wider truncate max-w-[80px]">{opponentName}</p>
                      <p className="font-display text-[28px] font-black leading-tight" style={{ color: !isWin && verdict !== "draw" ? "#ef4444" : "rgba(255,255,255,.35)" }}>{opponentScore}</p>
                    </div>
                  </div>
                </div>

                <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{
                    width: `${myPct}%`,
                    background: isWin ? "linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / .7))" : "linear-gradient(to right, rgba(239,68,68,.8), rgba(239,68,68,.5))",
                  }} />
                </div>
              </div>
            </div>
          </div>

          <div className={cn("px-4 transition-all duration-700 delay-300", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.025]">
              <div className="flex-1 flex flex-col items-center">
                <span className="font-display text-[18px] font-black leading-none text-white">{accuracy}%</span>
                <CheckCircle2 size={10} className="text-green-400 mt-1" />
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Target size={12} className="text-white/20" />
                <span className="font-display text-[8px] font-bold text-white/20 uppercase tracking-[.2em]">Accuracy</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="font-display text-[18px] font-black leading-none text-white">{myCorrectCount}/{totalQuestions}</span>
              </div>
            </div>
          </div>

          <div className={cn("px-4 pb-10 pt-2 space-y-3 transition-all duration-700 delay-500", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onRematch} className="py-3.5 rounded-2xl border border-white/[0.10] bg-white/[0.04] font-display text-[11px] font-black uppercase tracking-[.2em] text-white/70 flex items-center justify-center gap-2 active:scale-[.98] transition-all">
                <RotateCcw size={13} />
                Rematch
              </button>
              <button onClick={onHome} className="py-3.5 rounded-2xl border border-white/[0.10] bg-white/[0.04] font-display text-[11px] font-black uppercase tracking-[.2em] text-white/70 flex items-center justify-center gap-2 active:scale-[.98] transition-all">
                <Home size={13} />
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </EnergyBackground>
  );
}