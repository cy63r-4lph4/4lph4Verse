"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Users, Globe, Bell, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";


interface Course {
  id: string;
  code: string;
  name: string;
  members: number;
}

export const CourseHeader = ({ 
  currentCourse, 
  courses, 
  currentUser 
}: { 
  currentCourse: Course; 
  courses: Course[];
  currentUser: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-xl border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* SECTOR SELECTOR */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 p-2 rounded-xl transition-all group border border-transparent hover:bg-white/5"
          >
            <div className="relative">
              <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                <Globe size={22} className={cn(isOpen ? "animate-spin-slow" : "animate-pulse")} />
              </div>
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary/50" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-primary/50" />
            </div>

            <div className="text-left hidden xs:block">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-black text-white tracking-tight leading-none uppercase">
                  {currentCourse.code}
                </h1>
                <ChevronDown size={14} className={cn("text-primary transition-transform", isOpen && "rotate-180")} />
              </div>
              <p className="text-[9px] font-mono text-primary/60 uppercase tracking-[0.2em] mt-1">
                System_Node: {currentCourse.id.slice(0, 5)}
              </p>
            </div>
          </button>

          {/* DROPDOWN OVERLAY */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-3 w-80 bg-arena-darker/95 border border-primary/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-in zoom-in-95 duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Active_Sectors</span>
                  <ShieldCheck size={12} className="text-primary/40" />
                </div>
                <div className="space-y-1">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                        course.id === currentCourse.id 
                          ? "bg-primary/10 border border-primary/20 text-white" 
                          : "hover:bg-white/5 border border-transparent text-muted-foreground"
                      )}
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold font-display tracking-wide">{course.code}</p>
                        <p className="text-[10px] opacity-50 uppercase">{course.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary">
                        <Users size={12} />
                        {course.members}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER MONITOR (Live Status) */}
        <div className="hidden md:flex flex-col items-center">
            <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-white/5 border border-white/10">
                <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-muted-foreground uppercase">Sync_Rate</span>
                    <span className="text-xs font-bold text-arena-success">99.8%</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-muted-foreground uppercase">Uplink</span>
                    <span className="text-xs font-bold text-primary">ACTIVE</span>
                </div>
            </div>
        </div>

        {/* USER UTILS */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white uppercase">{currentUser.name}</p>
            <p className="text-[9px] font-mono text-primary uppercase tracking-tighter">LVL {currentUser.level} Elite</p>
          </div>
          <div className="relative group">
            <ArenaAvatar src={currentUser.avatar} size="md" glow glowColor="primary" className="cursor-pointer" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-arena-dark border border-primary/50 flex items-center justify-center">
               <Zap size={8} className="text-primary fill-primary" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};