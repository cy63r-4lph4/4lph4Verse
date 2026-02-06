"use client";
import { cn } from "@verse/ui";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg" | "xl" | "responsive";
  glow?: boolean;
}

const variantClasses = {
  // Primary (Cyan/Blue)
  primary: "bg-primary text-primary-foreground shadow-primary/20",
  // Danger (Red - for SU Override)
  danger: "bg-destructive text-destructive-foreground shadow-destructive/20 border-destructive/50",
  // Success (Green - for Sector Deployed)
  success: "bg-arena-success text-white shadow-arena-success/20",
  // Warning (Amber - for Intel Assets)
  warning: "bg-arena-warning text-black shadow-arena-warning/20",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "bg-transparent text-foreground hover:bg-white/10",
  outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
};

const sizeClasses = {
  sm: "px-4 py-2 text-[10px] rounded-lg",
  md: "px-6 py-3 text-xs rounded-xl",
  lg: "px-8 py-4 text-sm rounded-xl",
  xl: "px-10 py-5 text-base rounded-2xl",
  responsive: "px-8 py-4 text-sm md:px-12 md:py-6 md:text-base rounded-xl md:rounded-2xl",
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, children, ...props }, ref) => {
    
    // Determine which border color to use for the corner accents based on variant
    const accentColor = {
      primary: "border-primary",
      danger: "border-destructive",
      success: "border-arena-success",
      warning: "border-arena-warning",
      secondary: "border-secondary",
      ghost: "border-white",
      outline: "border-primary",
    }[variant];

    return (
      <button
        ref={ref}
        className={cn(
          "relative group font-mono font-bold tracking-[0.2em] uppercase transition-all duration-300",
          "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {/* Tactical Corner Accents */}
        <div className={cn(
          "absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-top-2 group-hover:-left-2",
          accentColor
        )} />
        <div className={cn(
          "absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-bottom-2 group-hover:-right-2",
          accentColor
        )} />

        <div className={cn(
          "relative z-10 flex items-center justify-center gap-3 overflow-hidden",
          variantClasses[variant],
          sizeClasses[size],
          // Enhanced Glow Logic using Tailwind shadow utilities or inline vars
          glow && "shadow-lg group-hover:shadow-2xl transition-shadow duration-300",
          variant === "danger" && glow && "hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]",
          variant === "primary" && glow && "hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]"
        )}>
          {/* Subtle Scanline Overlay for the button face */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
          
          <span className="relative z-10">{children}</span>
          
          {/* The "Signal" Pulse */}
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </div>
        </div>
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";
export default NeonButton;