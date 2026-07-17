import { cn } from "@verse/ui";
import React from "react";
import { motion } from "framer-motion";

interface EnergyBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "battle" | "intense" | "duel";
  children?: React.ReactNode;
}

export const EnergyBackground = ({
  className,
  variant = "default",
  children,
  style,
  ...props
}: EnergyBackgroundProps) => {
  return (
    <div
      style={style}
      {...props}
      // Removed min-h-screen — callers control height via className
      className={cn("relative bg-[#050505] text-white", className)}
    >
      {/* Tactical Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />

      {/* Energy orbs — overflow-hidden is scoped here, NOT on the root */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none blur-[100px]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {variant === "battle" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[30%] bg-destructive/10 skew-y-12" />
        )}

        {variant === "intense" && (
          <>
            <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/15 animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-[5%] left-[5%] w-[35%] h-[35%] rounded-full bg-secondary/10 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </>
        )}
      </div>

      {/* Duel variant — motion lines */}
      {variant === "duel" && (
        <>
          <motion.div
            className="absolute top-1/2 left-0 w-full h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / .4), transparent)" }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <div className="absolute top-[20%] left-[15%] w-[40%] h-[40%] rounded-full bg-primary/15 blur-[100px] animate-pulse pointer-events-none" />
          <div
            className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] rounded-full bg-secondary/15 blur-[100px] animate-pulse pointer-events-none"
            style={{ animationDelay: "1.2s" }}
          />
        </>
      )}

      {/* Content — h-full so flex-col children fill the parent correctly */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default EnergyBackground;