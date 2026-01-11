'use client'
import { ArenaLogo } from "@verse/arena-web/components/ui/ArenaLogo";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <EnergyBackground className="flex flex-col items-center justify-center">
      {/* Using dynamic viewport height (dvh) ensures mobile browsers 
         don't hide the bottom content behind the address bar. 
      */}
      <div className="flex flex-col items-center justify-between h-dvh  max-w-7xl px-6 py-10 md:py-16">
        
        {/* Header: System Status - Pushed to top safe area */}
        <div className="w-full flex justify-between items-center opacity-40">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary animate-pulse rounded-full" />
            <span className="text-[9px] md:text-[10px] tracking-[0.3em] font-mono">SYS_READY</span>
          </div>
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] font-mono">V.1.0-BETA</span>
        </div>

        {/* Main Content: Centered perfectly for thumbs */}
        <div className="flex flex-col items-center w-full">
          <div className="animate-scale-in w-full flex justify-center">
            {/* Responsive size: smaller on mobile, massive on desktop */}
            <ArenaLogo size="responsive" showTagline />
          </div>

          <div className="mt-12 md:mt-20 animate-slide-up w-full max-w-sm px-4" style={{ animationDelay: "0.4s" }}>
            <NeonButton
              size="responsive"
              onClick={() => router.push("/setup")}
              className="w-full" 
            >
              Enter the Arena
            </NeonButton>
          </div>
        </div>

        {/* Footer: Live Status - Bottom weighted for "App" feel */}
        <div className="w-full flex flex-col items-center gap-6 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-center text-[10px] text-muted-foreground/60 tracking-[0.2em] font-medium">
            <span className="flex items-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
              1,240 Fighters Active
            </span>
            <span className="flex items-center gap-2 uppercase">
              <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
              42 Arenas Engaged
            </span>
          </div>
        </div>
      </div>
    </EnergyBackground>
  );
}