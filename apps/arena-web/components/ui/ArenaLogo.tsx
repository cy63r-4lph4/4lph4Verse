
import { cn } from "@verse/ui";

interface ArenaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
}

const sizeClasses = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
  xl: "text-7xl",
};

export const ArenaLogo = ({ size = "lg", className, showTagline = false }: ArenaLogoProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative">
        {/* Glow effect behind */}
        <div 
          className="absolute inset-0 blur-2xl opacity-50"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          }}
        />
        
        {/* Main logo */}
        <h1 
          className={cn(
            "font-display font-black tracking-[0.2em] text-primary relative z-10 text-white",
            sizeClasses[size]
          )}
        >
          ARENA
        </h1>
        
        {/* DeskMate subtitle */}
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">by</span>
          <span className="text-xs font-medium text-secondary tracking-wider">DeskMate</span>
        </div>
      </div>
      
      {showTagline && (
        <p className="text-muted-foreground text-sm tracking-wide mt-4 animate-slide-up">
          Study. Challenge. Ascend.
        </p>
      )}
    </div>
  );
};

export default ArenaLogo;
