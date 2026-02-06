import { cn } from "@verse/ui";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "easy" | "medium" | "hard" | "gold" | "silver" | "bronze" | "info" | "legendary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

const variantClasses = {
  default: "bg-muted text-muted-foreground border-arena-border",
  easy: "difficulty-easy border",
  medium: "difficulty-medium border",
  hard: "difficulty-hard border",
  gold: "rank-gold text-background font-bold",
  silver: "rank-silver text-background font-bold",
  bronze: "rank-bronze text-foreground font-bold",
  info: "bg-secondary/20 text-secondary border-secondary/30 border",
  legendary: "bg-arena-warning/20 text-arena-warning border-arena-warning/30 border",
  success: "bg-arena-success/20 text-arena-success border-arena-success/30 border",
  warning: "bg-arena-warning/20 text-arena-warning border-arena-warning/30 border",
  danger: "bg-arena-danger/20 text-arena-danger border-arena-danger/30 border",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export const Badge = ({ children, variant = "default", size = "sm", className }: BadgeProps) => {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
