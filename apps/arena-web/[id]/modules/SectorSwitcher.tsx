"use client";
import { useState } from "react";
import { ChevronDown, Globe, Bell, Zap, Menu } from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

export const CourseHeader  = ({ currentCourse, courses, currentUser }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2">
      {/* Glass Container */}
      <div className="max-w-7xl mx-auto h-16 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-3 relative overflow-hidden">
        
        {/* Subtle Background Scanline Animation */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline" />

        {/* LEFT: Sector Selector (Optimized for Tap) */}
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all active:scale-95"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/40 text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
              <Globe size={18} className={isOpen ? "animate-spin-slow" : ""} />
            </div>
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-center gap-1">
                <span className="font-display text-sm font-black text-white uppercase tracking-tight">
                  {currentCourse.code}
                </span>
                <ChevronDown size={12} className={cn("text-primary/70 transition-transform", isOpen && "rotate-180")} />
              </div>
              <span className="text-[8px] font-mono text-primary/50 uppercase tracking-widest mt-0.5">
                SEC_0{courses.findIndex((c: any) => c.id === currentCourse.id) + 1}
              </span>
            </div>
          </button>
        </div>

        {/* CENTER: Compact Live Monitor (Visible on all screens) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-[10px] font-mono font-bold text-white tracking-tighter">
              {currentCourse.members} <span className="text-white/40 font-normal">ACTV</span>
            </span>
          </div>
          <div className="h-[2px] w-8 bg-primary/30 rounded-full mt-1 overflow-hidden">
             <div className="h-full bg-primary w-2/3 animate-progress-slide" />
          </div>
        </div>

        {/* RIGHT: Notifications & Profile */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-white/60 hover:text-primary transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-black" />
          </button>
          
          <div className="h-8 w-[1px] bg-white/10 mx-1 hidden xs:block" />
          
          <button className="flex items-center gap-2 pl-1 group">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-white leading-none">@{currentUser.name}</p>
                <p className="text-[8px] font-mono text-primary uppercase">Rank #{currentUser.rank}</p>
             </div>
             <ArenaAvatar 
                src={currentUser.avatar} 
                size="sm" 
                glow 
                glowColor="primary" 
                className="border-white/10"
             />
          </button>
        </div>
      </div>

      {/* DROPDOWN OVERLAY (Mobile Optimized) */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 bg-black/90 border border-primary/30 rounded-2xl shadow-2xl backdrop-blur-2xl p-2 animate-in slide-in-from-top-2 duration-200 z-50">
          <div className="grid grid-cols-1 gap-1">
            {courses.map((course: any) => (
              <button
                key={course.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all",
                  course.id === currentCourse.id ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-primary">
                    {course.code.split(' ')[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{course.name}</p>
                    <p className="text-[10px] text-white/40 uppercase">{course.code}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-primary">{course.members} FIGHTERS</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};