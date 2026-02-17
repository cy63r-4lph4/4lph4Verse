"use client";
import { cn } from "@verse/ui";
import { MessageSquare, Swords, Trophy, LayoutGrid, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: MessageSquare, label: "COMM_FEED", path: "/course", color: "text-blue-500" },
  { icon: Swords, label: "BATTLE_OPS", path: "/quizzes", color: "text-red-500" },
  { icon: Trophy, label: "RANKINGS", path: "/leaderboard", color: "text-amber-500" },
  { icon: LayoutGrid, label: "RESOURCES", path: "/materials", color: "text-primary" },
];

export const CourseBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      {/* Outer Dock Container */}
      <div className="max-w-md mx-auto relative group">
        
        {/* Dock Background with Neon Top Wire */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300",
                  isActive ? "scale-110" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                )}
              >
                {/* Active Light Leak Effect */}
                {isActive && (
                  <div className={cn(
                    "absolute -top-1 inset-x-4 h-8 blur-xl opacity-20 transition-all",
                    item.color.replace('text', 'bg')
                  )} />
                )}

                <div className="relative">
                  <Icon 
                    size={20} 
                    className={cn(
                      "transition-all duration-300",
                      isActive ? item.color : "text-white"
                    )} 
                  />
                  
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <div className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full animate-pulse",
                      item.color.replace('text', 'bg')
                    )} />
                  )}
                </div>

                <span className={cn(
                  "text-[8px] font-mono font-bold tracking-[0.15em] transition-colors",
                  isActive ? "text-white" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>

                {/* Corner Accents for Active Tab */}
                {isActive && (
                  <>
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary/40 rounded-tl-md" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary/40 rounded-br-md" />
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};