import { useState } from "react";
import { cn } from "@/lib/utils";
import { Swords, Users, Skull, Shuffle, X } from "lucide-react";
import NeonButton from "./NeonButton";

interface ChallengeHeroProps {
  onSelectMode?: (mode: string) => void;
}

const challengeModes = [
  { id: "duel", icon: Swords, label: "Duel", desc: "1v1 head-to-head" },
  { id: "royale", icon: Users, label: "Battle Royale", desc: "5 fighters, 1 winner" },
  { id: "elimination", icon: Skull, label: "Elimination", desc: "Survive the arena" },
  { id: "random", icon: Shuffle, label: "Random Match", desc: "Fight anyone" },
];

export const ChallengeHero = ({ onSelectMode }: ChallengeHeroProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Main CTA */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full relative overflow-hidden rounded-2xl p-6 transition-all duration-500",
          "bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20",
          "border border-primary/30 hover:border-primary/50",
          "group",
          expanded && "rounded-b-none border-b-0"
        )}
      >
        {/* Animated glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-shimmer" />
        
        {/* Breathing glow */}
        <div className="absolute inset-0 bg-primary/5 animate-pulse-slow" />
        
        {/* Content */}
        <div className="relative flex items-center justify-center gap-4">
          <Swords 
            size={32} 
            className="text-primary group-hover:scale-110 transition-transform duration-300" 
          />
          <div className="text-left">
            <h2 className="font-display text-2xl font-bold text-foreground tracking-wide">
              CHALLENGE
            </h2>
            <p className="text-sm text-muted-foreground">
              Face a rival or enter the arena
            </p>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-2xl" />
      </button>

      {/* Expanded Mode Selection */}
      {expanded && (
        <div className="bg-arena-card/95 backdrop-blur-md border border-primary/30 border-t-0 rounded-b-2xl p-4 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm text-muted-foreground">Select Battle Mode</h3>
            <button 
              onClick={() => setExpanded(false)}
              className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {challengeModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  onSelectMode?.(mode.id);
                  setExpanded(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                  "bg-muted/30 border border-arena-border hover:border-primary/50",
                  "hover:bg-primary/10 group"
                )}
              >
                <mode.icon 
                  size={24} 
                  className="text-muted-foreground group-hover:text-primary transition-colors" 
                />
                <div className="text-center">
                  <p className="font-semibold text-foreground text-sm">{mode.label}</p>
                  <p className="text-[10px] text-muted-foreground">{mode.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeHero;
