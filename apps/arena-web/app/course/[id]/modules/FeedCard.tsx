"use client";
import { Swords, Trophy, Zap, Brain, Megaphone, Clock, ChevronRight, Share2 } from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

// We'll use a polymorphic type approach for the different card states
export type FeedItem = {
  id: string;
  type: "battle" | "rank" | "quiz" | "announcement";
  timestamp: string;
  data: any; // Simplified for the example
};

export const FeedCard = ({ item }: { item: FeedItem }) => {
  const isBattle = item.type === "battle";
  const isRank = item.type === "rank";

  return (
    <div className={cn(
      "group relative flex flex-col w-full overflow-hidden transition-all duration-300",
      "bg-black/40 border border-white/5 hover:border-primary/30 rounded-xl",
      "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px]",
      item.type === "battle" ? "before:bg-red-500" : "before:bg-primary"
    )}>
      
      {/* HEADER: LOG INFO */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          {item.type === "battle" && <Swords size={14} className="text-red-500" />}
          {item.type === "rank" && <Trophy size={14} className="text-amber-500" />}
          {item.type === "quiz" && <Brain size={14} className="text-primary" />}
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
            LOG_REF: {item.id.slice(0, 8)} // {item.timestamp}
          </span>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Share2 size={12} className="text-muted-foreground hover:text-white" />
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4">
        {item.type === "battle" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              {/* Winner */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <ArenaAvatar src={item.data.winner.avatar} size="lg" glow glowColor="success" />
                <div className="text-center">
                  <p className="text-xs font-bold text-white uppercase">{item.data.winner.name}</p>
                  <p className="text-[10px] font-mono text-arena-success">SCORE: {item.data.winner.score}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-muted-foreground italic">VS</span>
                <div className="h-px w-8 bg-white/10" />
              </div>

              {/* Loser */}
              <div className="flex flex-col items-center gap-2 flex-1 opacity-60">
                <ArenaAvatar src={item.data.loser.avatar} size="lg" />
                <div className="text-center">
                  <p className="text-xs font-bold text-white uppercase">{item.data.loser.name}</p>
                  <p className="text-[10px] font-mono text-red-500">SCORE: {item.data.loser.score}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <p className="text-[10px] font-mono text-primary uppercase">Objective: {item.data.quizName}</p>
            </div>
          </div>
        )}

        {item.type === "rank" && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <ArenaAvatar src={item.data.user.avatar} size="lg" glow glowColor="warning" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black rounded px-1 text-[8px] font-black italic">
                PROMOTED
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                {item.data.user.name} attained {item.data.newRank}
              </h4>
              <p className="text-[10px] font-mono text-muted-foreground mt-1">
                Combat Rating adjusted by +124 points
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER: REACTIONS/SOCIAL */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.01] border-t border-white/5">
        <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 transition-colors group/btn">
          <Zap size={14} className="text-muted-foreground group-hover/btn:text-primary transition-colors" />
          <span className="text-[10px] font-mono text-muted-foreground">14_BOOSTS</span>
        </button>
        <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 transition-colors group/btn">
          <Clock size={14} className="text-muted-foreground group-hover/btn:text-white" />
          <span className="text-[10px] font-mono text-muted-foreground">REPLY</span>
        </button>
      </div>
    </div>
  );
};