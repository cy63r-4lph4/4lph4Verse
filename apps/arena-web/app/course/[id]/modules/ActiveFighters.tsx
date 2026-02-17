import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { cn } from "@verse/ui";

export const ActiveFighters = ({ fighters }: { fighters: any[] }) => {
  return (
    <div className="w-full bg-black/20 border-y border-white/5 py-4 overflow-hidden relative">
      <div className="flex items-center gap-2 mb-3 px-4">
        <div className="h-1.5 w-1.5 rounded-full bg-arena-success animate-pulse" />
        <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
          Live_Fighter_Radar
        </h3>
      </div>
      
      <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar mask-fade-edges">
        {fighters.map((f) => (
          <div key={f.id} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
            <div className="relative">
              <ArenaAvatar 
                src={f.avatar} 
                size="md" 
                className={cn(
                    "grayscale hover:grayscale-0 transition-all duration-500",
                    f.isOnline && "grayscale-0 ring-2 ring-arena-success/40 ring-offset-2 ring-offset-black"
                )}
              />
              {f.isOnline && (
                <div className="absolute -top-1 -right-1 bg-arena-success p-0.5 rounded-full">
                  <div className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-muted-foreground group-hover:text-white transition-colors">
              {f.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};