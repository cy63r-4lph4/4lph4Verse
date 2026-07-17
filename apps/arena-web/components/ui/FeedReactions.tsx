import { cn } from "@verse/ui";

interface FeedReactionsProps {
  counts?: Partial<Record<string, number>>;
  activeKeys?: string[];
  onReact?: (type: string) => void;
}

const reactionTypes = [
  { emoji: "👍", label: "Respect", key: "respect" },
  { emoji: "🔥", label: "Hype", key: "hype" },
  { emoji: "😤", label: "Rivalry", key: "rivalry" },
  { emoji: "💀", label: "Brutal", key: "brutal" },
];

export const FeedReactions = ({ counts = {}, activeKeys = [], onReact }: FeedReactionsProps) => {
  return (
    <div className="flex items-center gap-1">
      {reactionTypes.map((r) => {
        const count = counts[r.key] ?? 0;
        const isActive = activeKeys.includes(r.key);
        return (
          <button
            key={r.key}
            onClick={() => onReact?.(r.key)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200",
              "hover:bg-muted/50 active:scale-110",
              isActive
                ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                : "bg-muted/30 text-muted-foreground",
            )}
          >
            <span className={cn("transition-transform duration-200", isActive && "animate-bounce-once")}>
              {r.emoji}
            </span>
            {count > 0 && <span className="font-mono">{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default FeedReactions;