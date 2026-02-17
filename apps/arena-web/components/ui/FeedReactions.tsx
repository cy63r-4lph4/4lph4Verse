import { useState } from "react";
import { cn } from "@verse/ui";

interface Reaction {
  emoji: string;
  label: string;
  count: number;
  active: boolean;
}

interface FeedReactionsProps {
  initialReactions?: Partial<Record<string, number>>;
  onReact?: (type: string) => void;
}

const reactionTypes = [
  { emoji: "👍", label: "Respect", key: "respect" },
  { emoji: "🔥", label: "Hype", key: "hype" },
  { emoji: "😤", label: "Rivalry", key: "rivalry" },
  { emoji: "💀", label: "Brutal", key: "brutal" },
];

export const FeedReactions = ({ initialReactions = {}, onReact }: FeedReactionsProps) => {
  const [reactions, setReactions] = useState<Record<string, { count: number; active: boolean }>>(() =>
    reactionTypes.reduce((acc, r) => ({
      ...acc,
      [r.key]: { count: initialReactions[r.key] || 0, active: false }
    }), {})
  );

  const handleReact = (key: string) => {
    setReactions(prev => ({
      ...prev,
      [key]: {
        count: prev[key].active ? prev[key].count - 1 : prev[key].count + 1,
        active: !prev[key].active
      }
    }));
    onReact?.(key);
  };

  return (
    <div className="flex items-center gap-1">
      {reactionTypes.map((r) => (
        <button
          key={r.key}
          onClick={() => handleReact(r.key)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200",
            "hover:bg-muted/50 active:scale-110",
            reactions[r.key].active 
              ? "bg-primary/20 text-primary ring-1 ring-primary/30" 
              : "bg-muted/30 text-muted-foreground"
          )}
        >
          <span className={cn(
            "transition-transform duration-200",
            reactions[r.key].active && "animate-bounce-once"
          )}>
            {r.emoji}
          </span>
          {reactions[r.key].count > 0 && (
            <span className="font-mono">{reactions[r.key].count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FeedReactions;
