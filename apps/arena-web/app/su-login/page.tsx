"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Terminal, 
  Cpu, 
  AlertTriangle,
  Zap,
  Loader2
} from "lucide-react";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { cn } from "@verse/ui";
import useLogin from "@verse/arena-web/hooks/useLogin"; 

export default function SULogin() {
  const router = useRouter();
  const { login, isLoggingIn, errorMessage } = useLogin();
  
  const [accessCode, setAccessCode] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [bootSequence, setBootSequence] = useState<string[]>([]);

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Initial Access Key Check (Front-gate)
    if (accessCode !== "ARENA_OVR_99") {
      return; 
    }

    try {
        // 2. Trigger Real Backend Authentication via Hook
        // Using the fixed credentials created by your init-su script
        await login({ 
          identity: "ARCHITECT", 
          password: "AlphaVerse" // Ensure this matches your init-su.ts script
        });

      // 3. If login succeeds, start the terminal "feel"
      setShowTerminal(true);
      
      const lines = [
        "ESTABLISHING_SECURE_UPLINK...",
        "AUTHENTICITY_VERIFIED_BY_GATEWAY...",
        "AUTHORIZING_SUPER_USER_PERMISSIONS...",
        "LOADING_ARCHITECT_RESOURCES...",
        "HUB_REGISTRATION_MODULE_UNLOCKED.",
        "BYPASS_COMPLETE. REDIRECTING..."
      ];

      for (let i = 0; i < lines.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        setBootSequence(prev => [...prev, lines[i]]);
      }

      setTimeout(() => router.push("/su"), 800);

    } catch (err) {
      console.error("Tactical Bypass Failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020000] flex items-center justify-center p-6 font-mono relative overflow-hidden">
      {/* Background Visuals */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,0,0,0),rgba(255,0,0,0.03))] z-0 pointer-events-none" />
      
      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* TOP STATUS */}
        <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
             <span className="text-[10px] text-red-400 tracking-[0.3em] uppercase font-bold">Root_Terminal_Online</span>
          </div>
          <span className="text-[10px] text-red-700 uppercase font-bold tracking-widest italic">Auth_Level: 0 (Architect)</span>
        </div>

        {/* IDENTITY */}
        <div className="text-center space-y-4 py-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full" />
            <div className="relative w-20 h-20 border border-red-500/30 rounded-2xl flex items-center justify-center bg-red-950/20 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
              <Cpu size={32} className="text-red-500" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">
              SU_Command_<span className="text-red-500">Node</span>
            </h1>
            <p className="text-red-400/50 text-[9px] uppercase tracking-[0.5em] mt-2">Initialize Global Infrastructure</p>
          </div>
        </div>

        {/* INPUT INTERFACE */}
        <div className={cn(
          "bg-black/90 border border-red-500/20 rounded-2xl p-8 backdrop-blur-2xl transition-all duration-300",
          errorMessage ? "border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.2)]" : "shadow-2xl"
        )}>
          {!showTerminal ? (
            <form onSubmit={handleOverride} className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] text-red-400 uppercase font-black tracking-widest">Architect_Access_Key</label>
                  <Lock size={12} className="text-red-500/40" />
                </div>
                <div className="relative">
                  <Terminal size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
                  <input 
                    autoFocus
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="WAITING_FOR_STRING..."
                    className="w-full bg-red-500/3 border border-red-500/20 rounded-xl py-4 pl-12 pr-4 text-white font-mono placeholder:text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <NeonButton 
                variant="danger" 
                className="w-full py-8 text-[11px] tracking-[0.4em] font-black uppercase shadow-lg disabled:opacity-50"
                type="submit"
                disabled={isLoggingIn || accessCode.length < 5}
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> AUTHORIZING...</span>
                ) : "Execute_Override"}
              </NeonButton>

              {errorMessage && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase font-bold justify-center mt-4 animate-in shake-2">
                  <AlertTriangle size={14} /> {`System_Error: ${errorMessage}`}
                </div>
              )}
            </form>
          ) : (
            /* TERMINAL BOOT SEQUENCE */
            <div className="space-y-3 min-h-[140px] pt-2">
              {bootSequence.map((line, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[10px] text-red-400 animate-in fade-in slide-in-from-left-4 duration-300">
                  <Zap size={10} className="text-red-500 fill-red-500" />
                  <span className="font-mono tracking-wide">{line}</span>
                </div>
              ))}
              <div className="w-1.5 h-4 bg-red-500 animate-pulse mt-2 shadow-[0_0_10px_red]" />
            </div>
          )}
        </div>

        {/* SYSTEM STATS */}
        <div className="flex justify-between items-center px-6 pt-4 border-t border-red-500/10">
           <div className="flex gap-6">
             <div className="flex flex-col">
               <span className="text-[7px] text-red-400/40 uppercase">Network</span>
               <span className="text-[10px] text-red-400/80 font-bold">ENCRYPTED</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[7px] text-red-400/40 uppercase">Permission</span>
               <span className="text-[10px] text-red-400/80 font-bold">ARCHITECT</span>
             </div>
           </div>
           <button 
             onClick={() => router.push("/login")} 
             className="text-[9px] text-red-400/40 hover:text-red-400 transition-colors uppercase font-bold tracking-widest border-b border-transparent hover:border-red-400 pb-0.5"
           >
             Terminal_Exit
           </button>
        </div>
      </div>
    </div>
  );
} 