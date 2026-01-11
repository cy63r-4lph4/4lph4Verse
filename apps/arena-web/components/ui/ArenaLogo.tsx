import { cn } from "@verse/ui";

interface ArenaLogoProps {
  size?: "sm" | "md" | "lg" | "xl"|"responsive";
  className?: string;
  showTagline?: boolean;
}

const sizeClasses = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl md:text-6xl",
  xl: "text-6xl md:text-8xl",
  responsive: "text-5xl sm:text-6xl md:text-8xl", 
};

export const ArenaLogo = ({ size = "lg", className, showTagline = false }: ArenaLogoProps) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative group">
        {/* Core Glow */}
        <div className="absolute inset-0 blur-3xl opacity-30 bg-primary animate-pulse" />
        
        {/* The Text with Metallic Gradient */}
        <h1 className={cn(
    "font-display font-black tracking-[0.2em] md:tracking-[0.25em] relative z-10",
    "bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50",
    sizeClasses[size]
)}>
  ARENA
</h1>
        
        {/* DeskMate Badge - Styled like a tech seal */}
        <div className="flex items-center justify-center gap-2 mt-[-4px] relative z-20">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-80">
            by DeskMate
          </span>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
      </div>
      
      {showTagline && (
        <div className="overflow-hidden mt-6">
          <p className="text-muted-foreground/80 text-sm tracking-[0.4em] uppercase animate-slide-up italic font-light">
            Study. Challenge. <span className="text-primary font-medium">Ascend.</span>
          </p>
        </div>
      )}
    </div>
  );
};