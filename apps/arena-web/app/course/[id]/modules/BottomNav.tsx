"use client";

import { cn } from "@verse/ui";
import { MessageSquare, Swords, Trophy, BookOpen, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: MessageSquare, label: "Feed",      segment: "home",        href: "",             activeIcon: "text-sky-400",    activeGlow: "bg-sky-500",    activeBorder: "border-sky-500/40"    },
  { icon: Swords,        label: "Battle",    segment: "duels",       href: "/duels",       activeIcon: "text-red-400",    activeGlow: "bg-red-500",    activeBorder: "border-red-500/40"    },
  { icon: Trophy,        label: "Ranks",     segment: "leaderboard", href: "/leaderboard", activeIcon: "text-amber-400",  activeGlow: "bg-amber-500",  activeBorder: "border-amber-500/40"  },
  { icon: BookOpen,      label: "Resources", segment: "materials",   href: "/materials",   activeIcon: "text-violet-400", activeGlow: "bg-violet-500", activeBorder: "border-violet-500/40" },
] as const;

export function CourseBottomNav() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const namedSegments = NAV_ITEMS.map((i) => i.segment).filter((s) => s !== "home");
  const activeSegment = namedSegments.includes(lastSegment as any) ? lastSegment : "home";
  const courseBasePath = "/" + segments.slice(0, 2).join("/");

  return (
    <div className="max-w-md mx-auto relative">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.5)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex items-center justify-around py-2 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.segment === activeSegment;
          const Icon = item.icon;

          return (
            <Link
              key={item.segment}
              href={`${courseBasePath}${item.href}`}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl outline-none transition-all duration-200",
                isActive ? "scale-105" : "opacity-40 hover:opacity-70 hover:bg-white/[0.04] active:scale-95"
              )}
            >
              {isActive && (
                <div className={cn("absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-6 blur-xl opacity-30 rounded-full pointer-events-none", item.activeGlow)} />
              )}

              <div className="relative">
                <Icon
                  size={isActive ? 21 : 19}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={cn("transition-all duration-200", isActive ? item.activeIcon : "text-white")}
                />
                {isActive && (
                  <span className={cn("absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full", item.activeGlow)} />
                )}
              </div>

              <span className={cn("font-display text-[9px] font-bold uppercase tracking-wider leading-none transition-colors duration-200", isActive ? "text-white" : "text-white/40")}>
                {item.label}
              </span>

              {isActive && (
                <>
                  <div className={cn("absolute top-0 left-0 w-2 h-2 border-t border-l rounded-tl-lg", item.activeBorder)} />
                  <div className={cn("absolute bottom-0 right-0 w-2 h-2 border-b border-r rounded-br-lg", item.activeBorder)} />
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default CourseBottomNav;