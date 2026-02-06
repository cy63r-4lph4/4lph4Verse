"use client";
import { useRouter } from "next/navigation";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { 
  Plus, Users, Trophy, Zap, ChevronRight, 
  Bell, User, Shield, Terminal, Activity,
  Target, Radio
} from "lucide-react";
import { cn } from "@verse/ui";

const userData = {
  username: "SHADOW_SCHOLAR", // Uppercase to match vibe
  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=player1",
  level: 12,
  rank: "ELITE_GUARD",
  xp: 85,
};

const userCourses = [
  { id: "phy101", code: "PHY-101", name: "Intro to Physics", members: 47, status: "IN_BATTLE", intensity: "HIGH" },
  { id: "math201", code: "MATH-201", name: "Calculus II", members: 32, status: "IDLE", intensity: "LOW" },
  { id: "chem150", code: "CHEM-150", name: "Organic Chem", members: 28, status: "SCANNING", intensity: "MED" },
];

const ArenaLobby = () => {
  const router = useRouter();

  return (
    <EnergyBackground className="flex flex-col h-dvh overflow-hidden" variant="intense">
      
      {/* HUD Header */}
      <header className="relative z-10 px-6 pt-8 flex items-center justify-between border-b border-white/5 pb-4 bg-black/20 backdrop-blur-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-primary animate-pulse" />
            <span className="font-display text-lg font-black tracking-[0.3em] text-white">ARENA_OS</span>
          </div>
          <span className="text-[8px] font-mono text-muted-foreground tracking-[0.2em]">VER_2.0.26 // REGION_GLOBAL</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all">
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#var(--primary-rgb)]" />
          </button>
          <div className="h-8 w-px bg-white/10 mx-1" />
          <button onClick={() => router.push("/profile")} className="group flex items-center gap-3 pl-1">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-white mb-0 leading-none">{userData.username}</p>
                <p className="text-[7px] font-mono text-primary leading-none uppercase tracking-tighter">Clearance_L1</p>
             </div>
             <ArenaAvatar src={userData.avatar} size="sm" className="border border-primary/40" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
        
        {/* Vital Signs / Quick Stats */}
        <section className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "STREAK", val: "05", icon: Zap, color: "text-primary" },
            { label: "LEVEL", val: "12", icon: Target, color: "text-secondary" },
            { label: "GLOBAL", val: "#482", icon: Trophy, color: "text-amber-400" }
          ].map((stat) => (
            <div key={stat.label} className="bg-arena-card border border-white/5 p-3 rounded-xl relative overflow-hidden group">
              <stat.icon size={12} className={cn("absolute -right-1 -bottom-1 opacity-10 rotate-12 transition-transform group-hover:scale-150", stat.color)} />
              <p className="text-[7px] font-mono text-muted-foreground tracking-widest uppercase mb-1">{stat.label}</p>
              <p className="font-display text-lg font-bold text-white">{stat.val}</p>
              <div className="absolute bottom-0 left-0 h-[1px] bg-primary/20 w-full" />
            </div>
          ))}
        </section>

        {/* ACTIVE SECTORS (Courses) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h2 className="font-display text-sm font-black tracking-widest uppercase text-white">Active Sectors</h2>
            </div>
            <span className="text-[9px] font-mono text-muted-foreground px-2 py-0.5 border border-white/10 rounded">GRID_SYNC: OK</span>
          </div>

          <div className="grid gap-4">
            {userCourses.map((course, idx) => (
              <button 
                key={course.id}
                onClick={() => router.push(`/course/${course.id}`)}
                className="group relative bg-arena-card border border-white/10 rounded-xl p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Tactical Status Tab */}
                <div className="absolute top-0 right-4 -translate-y-1/2 flex gap-1">
                   <div className={cn(
                     "px-2 py-0.5 rounded text-[7px] font-mono font-bold tracking-tighter border",
                     course.status === "IN_BATTLE" ? "bg-destructive/10 border-destructive/40 text-destructive" : "bg-primary/10 border-primary/40 text-primary"
                   )}>
                     {course.status}
                   </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-primary font-bold">[{course.code}]</span>
                      <h3 className="font-display text-md font-bold text-white uppercase tracking-tight group-hover:text-glow-primary transition-all">
                        {course.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-muted-foreground" />
                        <span className="text-[9px] font-mono text-muted-foreground">{course.members} UPLINKS</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Radio size={12} className="text-muted-foreground" />
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">INTENSITY: {course.intensity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-primary/50 transition-all">
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Decorative scanning line */}
                <div className="absolute bottom-2 left-4 right-4 h-[1px] bg-white/5 overflow-hidden">
                   <div className="h-full w-1/3 bg-primary/40 animate-[shimmer_2s_infinite]" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Action Footer */}
      <footer className="p-6 bg-linear-to-t from-black via-black/80 to-transparent">
        <NeonButton 
          onClick={() => router.push("/join-course")}
          className="w-full shadow-glow-primary py-6"
        >
          <Plus size={18} className="mr-2" />
          <span className="tracking-[0.2em]">INITIALIZE NEW SECTOR</span>
        </NeonButton>
        
        <div className="mt-4 flex justify-between items-center opacity-40">
           <div className="flex gap-2">
              <Terminal size={12} />
              <span className="text-[8px] font-mono uppercase tracking-widest">System_Ready</span>
           </div>
           <span className="text-[8px] font-mono uppercase tracking-widest text-primary">Latency: 24ms</span>
        </div>
      </footer>

      {/* Global HUD Scanning Line Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </EnergyBackground>
  );
};

export default ArenaLobby;