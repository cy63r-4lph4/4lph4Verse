import { cn } from "@verse/ui";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  glow?: boolean;
  glowColor?: "primary" | "secondary" | "success" | "danger" | "warning";
}

const SIZE = {
  xs:    "w-6 h-6   text-[10px]",
  sm:    "w-8 h-8   text-xs",
  md:    "w-12 h-12 text-sm",
  lg:    "w-16 h-16 text-base",
  xl:    "w-24 h-24 text-xl",
  "2xl": "w-32 h-32 text-2xl",
};

const GLOW_SHADOW: Record<string, string> = {
  primary:   "0 0 0 1.5px hsl(var(--primary) / .5), 0 0 14px hsl(var(--primary) / .4)",
  secondary: "0 0 0 1.5px hsl(var(--secondary) / .5), 0 0 14px hsl(var(--secondary) / .4)",
  success:   "0 0 0 1.5px hsl(var(--arena-success) / .5), 0 0 14px hsl(var(--arena-success) / .4)",
  danger:    "0 0 0 1.5px hsl(var(--arena-danger) / .5), 0 0 14px hsl(var(--arena-danger) / .4)",
  warning:   "0 0 0 1.5px hsl(var(--arena-warning) / .5), 0 0 14px hsl(var(--arena-warning) / .4)",
};

export function ArenaAvatar({
  src,
  alt,
  size = "md",
  glow = false,
  glowColor = "primary",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn("relative rounded-full shrink-0", SIZE[size], className)}
      style={glow ? { boxShadow: GLOW_SHADOW[glowColor] } : undefined}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-arena-card border border-arena-border">
        {src ? (
          <img
            src={src}
            alt={alt ?? ""}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-arena-gradient">
            <span className="font-display font-black text-white leading-none select-none">
              {alt?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          </div>
        )}

        {/* Gloss overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 50%)" }}
        />
      </div>
    </div>
  );
}

export default ArenaAvatar;