import { cn } from "@verse/ui";

interface EnergyBackgroundProps {
  className?: string;
  variant?: "default" | "battle" | "intense";
  children?: React.ReactNode;
}

export const EnergyBackground = ({ className, variant = "default", children }: EnergyBackgroundProps) => {
  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-[#050505] text-white", className)}>
      {/* 1. Tactical Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
      
      {/* 2. Vignette (Dark Corners) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-1" />

      {/* 3. Dynamic Energy Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none blur-[100px]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10" style={{ animationDelay: '2s' }} />
        
        {variant === "battle" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[30%] bg-destructive/10 skew-y-12" />
        )}
      </div>

      {/* 4. Content */}
      <div className="relative z-10  h-full">
        {children}
      </div>
    </div>
  );
};

export default EnergyBackground;
