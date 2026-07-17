"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe, Bell, CheckCircle2 } from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { Course, CurrentUser } from "@verse/arena-web/lib/course/types";
import { useNotifications } from "@verse/arena-web/hooks/useNotifications";

interface CourseHeaderProps {
  currentCourse: Course;
  courses: Course[];
  currentUser: CurrentUser;
}

export function CourseHeader({ currentCourse, courses, currentUser }: CourseHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { incoming } = useNotifications(currentCourse.id);


  return (
    <div className="relative px-4 pt-4 pb-2">

      {/* ── GLASS PILL ──────────────────────────────────────────────────── */}
      <div className="h-14 bg-black/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex items-center justify-between px-3 relative overflow-hidden">

        {/* Scanline shimmer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            backgroundSize: "100% 4px",
          }}
        />

        {/* LEFT: sector switcher */}
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.05] transition-all active:scale-95 outline-none"
        >
          <div
            className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0"
            style={{ boxShadow: "0 0 10px hsl(var(--primary) / .2)" }}
          >
            <Globe
              size={16}
              className={cn("text-primary transition-transform duration-700", open && "animate-spin")}
              style={{ animationDuration: "3s" }}
            />
          </div>
          <div className="flex flex-col items-start leading-none">
            <div className="flex items-center gap-1">
              <span className="font-display text-[13px] font-black text-white uppercase tracking-tight">
                {currentCourse.code}
              </span>
              <ChevronDown
                size={11}
                className={cn("text-primary/60 transition-transform duration-200", open && "rotate-180")}
              />
            </div>
            <span className="font-display text-[8px] font-bold text-primary/40 uppercase tracking-[.2em] mt-0.5">
              Sector {String(courses.findIndex(c => c.id === currentCourse.id) + 1).padStart(2, "0")}
            </span>
          </div>
        </button>

        {/* CENTER: live member count */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
              style={{ boxShadow: "0 0 6px rgba(74,222,128,.7)" }}
            />
            <span className="font-display text-[11px] font-black text-white leading-none">
              {currentCourse.members}
              <span className="font-bold text-white/30 ml-1 text-[9px]">online</span>
            </span>
          </div>
          <div className="h-[2px] w-8 bg-primary/20 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full w-1/2 bg-primary rounded-full"
              style={{ animation: "progress-slide 2s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* RIGHT: bell + avatar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => router.push(`/course/${currentCourse.id}/notifications`)}
            className="relative w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors active:scale-90"
          >
            <Bell size={18} />
            {incoming.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-black" />
            )}
          </button>

          <div className="w-px h-6 bg-white/[0.08]" />

          {/* Profile — now wired */}
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 pl-1 active:scale-95 transition-all outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="font-display text-[10px] font-black text-white uppercase leading-none">
                {currentUser.name}
              </p>
              <p className="font-display text-[8px] font-bold text-primary/50 uppercase tracking-wider leading-none mt-0.5">
                Rank #{currentUser.rank}
              </p>
            </div>
            <ArenaAvatar
              src={currentUser.avatar}
              size="sm"
              glow
              glowColor="primary"
            />
          </button>
        </div>
      </div>

      {/* ── COURSE DROPDOWN ───────────────────────────────────────────────── */}
      {open && (
        <div className="absolute top-[76px] left-4 right-4 z-[60] bg-black/90 border border-white/[0.08] rounded-2xl backdrop-blur-2xl p-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {courses.map(course => {
            const isActive = course.id === currentCourse.id;
            return (
              <button
                key={course.id}
                onClick={() => {
                  router.push(`/course/${course.id}`);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary/15 border border-primary/25"
                    : "hover:bg-white/[0.05] border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg border flex items-center justify-center",
                    isActive
                      ? "bg-primary/15 border-primary/30"
                      : "bg-white/[0.04] border-white/[0.08]"
                  )}>
                    <span className={cn(
                      "font-display text-[9px] font-black uppercase",
                      isActive ? "text-primary" : "text-white/30"
                    )}>
                      {course.code.split("-")[0]}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-display text-[12px] font-black text-white uppercase tracking-wide">
                      {course.name}
                    </p>
                    <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
                      {course.code} · {course.members} fighters
                    </p>
                  </div>
                </div>
                {isActive && <CheckCircle2 size={13} className="text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}