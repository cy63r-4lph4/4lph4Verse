import { cn } from "@verse/ui";
import ArenaAvatar from "./ArenaAvatar";
import { Trophy, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

interface Player {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  trend?: "up" | "down" | "same";
}

interface MiniLeaderboardProps {  
  players: Player[];
  currentUserRank?: number;
  currentUserProgress?: number;
  onViewFull?: () => void;
}

const rankColors: Record<number, string> = {
  1: "text-arena-gold",
  2: "text-arena-silver",
  3: "text-arena-bronze",
};

const rankBgColors: Record<number, string> = {
  1: "bg-arena-gold/20",
  2: "bg-arena-silver/20",
  3: "bg-arena-bronze/20",
};

export const MiniLeaderboard = ({ 
  players, 
  currentUserRank = 7, 
  currentUserProgress = 65,
  onViewFull 
}: MiniLeaderboardProps) => {
  return (
    <div className="rounded-xl bg-arena-card/80 backdrop-blur-sm border border-arena-border/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-arena-gold" />
          <h3 className="font-display text-sm font-semibold text-foreground">
            Top Fighters — This Week
          </h3>
        </div>
      </div>

      {/* Top 3 */}
      <div className="space-y-2 mb-4">
        {players.slice(0, 3).map((player) => (
          <div
            key={player.rank}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg transition-colors",
              "hover:bg-muted/30"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              rankBgColors[player.rank],
              rankColors[player.rank]
            )}>
              {player.rank}
            </div>
            <ArenaAvatar src={player.avatar} alt={player.name} size="sm" />
            <span className="flex-1 text-sm font-medium text-foreground truncate">
              {player.name}
            </span>
            <div className="flex items-center gap-2">
              {player.trend === "up" && <TrendingUp size={12} className="text-arena-success" />}
              {player.trend === "down" && <TrendingDown size={12} className="text-arena-danger" />}
              <span className="text-xs text-muted-foreground font-mono">
                {player.score.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Current User Position */}
      <div className="border-t border-arena-border/50 pt-4 mb-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Your position</span>
          <span className="font-display font-bold text-foreground">#{currentUserRank}</span>
        </div>
        <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${currentUserProgress}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {100 - currentUserProgress} points to next rank
        </p>
      </div>

      {/* View Full */}
      <button
        onClick={onViewFull}
        className="w-full flex items-center justify-center gap-1 text-sm text-primary hover:underline"
      >
        View Full Rankings <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default MiniLeaderboard;
