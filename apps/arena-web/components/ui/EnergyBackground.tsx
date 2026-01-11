import { cn } from "@verse/ui";

interface EnergyBackgroundProps {
  className?: string;
  variant?: "default" | "battle" | "intense";
  children?: React.ReactNode;
}

export const EnergyBackground = ({ 
  className, 
  variant = "default",
  children 
}: EnergyBackgroundProps) => {
  return (
    <div className={cn(
      "relative min-h-screen overflow-hidden bg-arena-gradient",
      className
    )}>
      {/* Grid pattern */}
      <div className="absolute inset-0 energy-lines opacity-30" />
      
      {/* Animated energy orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left orb */}
        <div 
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full energy-pulse"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 60%)",
          }}
        />
        
        {/* Bottom-right orb */}
        <div 
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full energy-pulse"
          style={{
            background: "radial-gradient(circle, hsl(var(--secondary) / 0.1) 0%, transparent 60%)",
            animationDelay: "1.5s",
          }}
        />
        
        {variant === "battle" && (
          <>
            {/* Left red glow for battle */}
            <div 
              className="absolute top-1/3 -left-40 w-80 h-80 rounded-full energy-pulse"
              style={{
                background: "radial-gradient(circle, hsl(var(--destructive) / 0.1) 0%, transparent 60%)",
                animationDelay: "0.5s",
              }}
            />
            
            {/* Right primary glow for battle */}
            <div 
              className="absolute top-1/3 -right-40 w-80 h-80 rounded-full energy-pulse"
              style={{
                background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 60%)",
                animationDelay: "1s",
              }}
            />
          </>
        )}
        
        {variant === "intense" && (
          <>
            {/* Center intense glow */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full energy-pulse"
              style={{
                background: "radial-gradient(circle, hsl(var(--warning) / 0.1) 0%, transparent 70%)",
              }}
            />
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default EnergyBackground;
