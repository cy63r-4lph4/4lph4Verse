"use client";
import { useState } from "react";
import { Swords, Users, Skull, Shuffle, X, Radio, Target } from "lucide-react";
import { cn } from "@verse/ui";

const challengeModes = [
  { id: "duel", icon: Swords, label: "DUEL_1V1", desc: "Head-to-head combat", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
  { id: "royale", icon: Users, label: "ROYALE", desc: "Multi-fighter survival", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { id: "elimination", icon: Skull, label: "WIPE_OUT", desc: "Sudden death mode", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { id: "random", icon: Shuffle, label: "AUTO_MATCH", desc: "Randomized target", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
];

export const ChallengeHero = ({ onSelectMode }: { onSelectMode?: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full perspective-1000">
      <div className={cn(
        "relative overflow-hidden transition-all duration-500 ease-out border",
        "bg-black/40 backdrop-blur-xl rounded-2xl",
        isExpanded ? "border-primary/50 ring-1 ring-primary/20 shadow-glow-primary" : "border-white/10 shadow-2xl",
      )}>
        
        {/* SCANNING OVERLAY (The "Radar" line) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="w-full h-[2px] bg-primary animate-scan shadow-[0_0_15px_rgba(var(--primary-rgb),1)]" />
        </div>

        {/* MAIN TERMINAL UI */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 flex items-center justify-between group relative z-10"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className={cn(
                "p-4 rounded-xl transition-all duration-300",
                isExpanded ? "bg-primary text-black scale-110" : "bg-primary/10 text-primary"
              )}>
                <Target size={32} className={cn(isExpanded ? "animate-spin-slow" : "animate-pulse")} />
              </div>
              <div className="absolute -inset-1 border border-primary/20 rounded-xl animate-ping opacity-20" />
            </div>

            <div className="text-left">
              <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase">
                {isExpanded ? "SELECT_PROTOCOL" : "INITIATE_STRIKE"}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                <Radio size={10} className="text-primary animate-pulse" />
                <span>Status: Scanning for rivals...</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="text-[10px] font-mono text-white text-right mb-1">XP_BOOST: ACTIVE</div>
            <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary animate-shimmer" />
            </div>
          </div>
        </button>

        {/* MODE GRID (The "Slide Down" Drawer) */}
        <div className={cn(
          "grid transition-all duration-500 ease-in-out overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100 py-4 px-4 border-t border-white/10" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="min-h-0">
            <div className="grid grid-cols-2 gap-3">
              {challengeModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onSelectMode?.(mode.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 group/item",
                    "bg-white/[0.02] hover:bg-white/[0.05]",
                    mode.border,
                    "hover:scale-[1.02] active:scale-95"
                  )}
                >
                  <mode.icon size={24} className={cn("transition-all duration-300 group-hover/item:scale-110", mode.color)} />
                  <div className="text-center">
                    <p className="font-display font-bold text-white text-[11px] tracking-widest uppercase">{mode.label}</p>
                    <p className="text-[8px] font-mono text-muted-foreground mt-1 uppercase leading-tight">{mode.desc}</p>
                  </div>
                  
                  {/* Item Glow */}
                  <div className={cn("absolute inset-0 opacity-0 group-hover/item:opacity-10 rounded-xl transition-opacity", mode.bg)} />
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsExpanded(false)}
              className="w-full mt-4 py-2 text-[9px] font-mono text-muted-foreground hover:text-white uppercase tracking-[0.3em] transition-colors"
            >
              [ ABORT_SELECTION ]
            </button>
          </div>
        </div>

        {/* Mechanical Accents */}
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-1 h-1 bg-primary/40 rounded-full" />
          <div className="w-1 h-1 bg-primary/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};