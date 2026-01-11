import { cn } from "@verse/ui";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
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
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-display font-semibold tracking-wide transition-all duration-300",
          "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          glow && variant === "primary" && "pulse-glow",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export default NeonButton;
