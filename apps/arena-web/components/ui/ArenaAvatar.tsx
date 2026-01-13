import { cn } from "@verse/ui";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  glow?: boolean;
  glowColor?: "primary" | "secondary" | "destructive" | "success" | "danger" | "warning";
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
  "2xl": "w-32 h-32",
};

const glowClasses = {
  primary: "ring-primary/50 shadow-glow-sm",
  secondary: "ring-secondary/50 shadow-glow-secondary",
  destructive: "ring-destructive/50 shadow-glow-destructive",
  success: "ring-arena-success/50 shadow-[0_0_15px_hsl(var(--arena-success)/0.4)]",
  danger: "ring-arena-danger/50 shadow-[0_0_15px_hsl(var(--arena-danger)/0.4)]",
  warning: "ring-arena-warning/50 shadow-[0_0_15px_hsl(var(--arena-warning)/0.4)]",
};

// Placeholder avatars with gaming aesthetic
const placeholderColors = [
  "from-primary to-secondary",
  "from-secondary to-destructive",
  "from-success to-primary",
  "from-warning to-destructive",
  "from-primary to-success",
];

export const ArenaAvatar = ({ src, alt, size = "md", glow = false, glowColor = "primary", className }: AvatarProps) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer Hexagon/Circular Border Frame */}
      <div className={cn(
        "absolute inset-0 rounded-full border border-primary/20 animate-spin-slow",
        sizeClasses[size],
        "border-dashed"
      )} />
      
      <div className={cn(
        "relative rounded-full overflow-hidden bg-arena-card flex items-center justify-center",
        "border-2 border-arena-border",
        sizeClasses[size],
        glow && glowClasses[glowColor as keyof typeof glowClasses],
      )}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-arena-gradient">
            <span className="text-white font-display font-bold">{alt?.charAt(0)}</span>
          </div>
        )}
        
        {/* Technical Scanline Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none animate-scanline" />
      </div>
    </div>
  );
};

export default ArenaAvatar;
