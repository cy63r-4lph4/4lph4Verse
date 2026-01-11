import { cn } from "@verse/ui";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl"|"responsive";
  glow?: boolean;
}

const variantClasses = {
  primary: "bg-primary text-primary-foreground btn-neon",
  secondary: "bg-secondary text-secondary-foreground btn-neon-secondary",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
  xl: "px-10 py-5 text-xl rounded-2xl",
  responsive: "px-8 py-4 text-lg md:px-12 md:py-6 md:text-xl rounded-xl md:rounded-2xl",
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative group font-display font-bold tracking-widest uppercase transition-all duration-300",
          "hover:scale-105 active:scale-95 disabled:opacity-50",
          variant === "primary" && "text-primary-foreground",
          className
        )}
        {...props}
      >
        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className={cn(
          "relative z-10 flex items-center justify-center gap-3",
          variantClasses[variant],
          sizeClasses[size],
          glow && "shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_35px_rgba(var(--primary-rgb),0.6)]"
        )}>
          {children}
          <div className="w-2 h-2 bg-current rounded-full animate-ping opacity-75" />
        </div>
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export default NeonButton;
