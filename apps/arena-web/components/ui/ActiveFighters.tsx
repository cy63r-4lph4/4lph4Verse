import ArenaAvatar from "./ArenaAvatar";
import { cn } from "@verse/ui";

interface Fighter {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

interface ActiveFightersProps {
  fighters: Fighter[];
  onFighterClick?: (fighter: Fighter) => void;
}

export const ActiveFighters = ({ fighters, onFighterClick }: ActiveFightersProps) => {
  return (
    <div className="py-4">
      <h3 className="text-xs font-medium text-muted-foreground mb-3 px-1">
        Recently Active Fighters
      </h3>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {fighters.map((fighter) => (
          <button
            key={fighter.id}
            onClick={() => onFighterClick?.(fighter)}
            className="flex flex-col items-center gap-1 min-w-[56px] group"
          >
            <div className="relative">
              <ArenaAvatar 
                src={fighter.avatar} 
                alt={fighter.name} 
                size="md"
                className="group-hover:ring-2 ring-primary/50 transition-all"
              />
              {fighter.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-arena-success border-2 border-arena-darker" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground truncate max-w-[56px] group-hover:text-foreground transition-colors">
              {fighter.name.split(/(?=[A-Z0-9])/)[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActiveFighters;
