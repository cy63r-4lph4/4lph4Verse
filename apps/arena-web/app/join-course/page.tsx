"use client";
import { useState, useMemo } from "react";
import { Link2, Plus, ShieldCheck, Target, Lock, AlertTriangle, Loader2, Search, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { InputField } from "@verse/arena-web/components/ui/InputField";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import useJoinSector from "@verse/arena-web/hooks/useJoinSector";
import useFetch from "@verse/arena-web/hooks/useFetch";
import { cn } from "@verse/ui";

interface ArenaCourse {
  id: string;
  title: string;
  accessKey: string;
  schoolId: string;
}

const JoinCourse = () => {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { join, isVerifying, errorMessage } = useJoinSector();
  
  const { data: availableSectors = [], isLoading: sectorsLoading } = useFetch<ArenaCourse[]>(
    "/v1/gateway/available-sectors",
    "available-sectors"
  );

  const suggestedSectors = useMemo(() => {
    if (accessKey.length < 2) return [];
    const term = accessKey.toUpperCase();
    return availableSectors.filter(s =>
      s.accessKey.includes(term) || s.title.toUpperCase().includes(term)
    ).slice(0, 6);
  }, [accessKey, availableSectors]);

  const handleJoin = async () => {
    if (accessKey.trim()) {
      try {
        await join(accessKey.trim().toUpperCase());
      } catch (e) {
        console.error("Uplink failed");
      }
    }
  };

  return (
    <EnergyBackground className="flex flex-col h-dvh overflow-hidden">
      <div className="flex-1 flex flex-col px-6 py-12 max-w-lg mx-auto w-full overflow-y-auto no-scrollbar">

        {/* Step Header */}
        <div className="text-center mb-12 animate-fade-scale-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Target size={12} className="text-primary animate-pulse" />
            <span className="text-[10px] font-mono text-primary tracking-[0.2em] uppercase">Sector Selection</span>
          </div>
          <h1 className="font-display text-2xl font-black text-white tracking-widest uppercase mb-2 text-glow">
            Enter Course
          </h1>
          <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
            Acquiring Battleground Access
          </p>
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="w-full space-y-8">
            <div className="relative group">
              <InputField
                label="Sector Access Key"
                prefixText="ARENA_ID"
                value={accessKey}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                    setAccessKey(e.target.value.toUpperCase());
                    setShowSuggestions(true);
                }}
                placeholder="E.G. CS50-CAMBRIDGE"
                autoComplete="off"
                className={cn(
                  "text-center text-lg md:text-xl font-display tracking-[0.2em] uppercase py-6 transition-all",
                  errorMessage && "border-destructive/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                )}
              />

              {/* Input Icon: Location Ping */}
              <div className="absolute right-4 top-[48px] pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <div className={cn(
                    "absolute h-2 w-2 rounded-full bg-primary transition-all duration-500",
                    isVerifying || sectorsLoading ? "animate-ping" : "opacity-40"
                  )} />
                  <Search size={14} className={cn(
                    "relative transition-colors duration-300",
                    isVerifying || sectorsLoading ? "text-primary" : "text-muted-foreground/30"
                  )} />
                </div>
              </div>

              {/* TACTICAL DROPDOWN (Mirrored from Setup) */}
              {showSuggestions && (accessKey.length >= 2 || sectorsLoading) && (
                <div className="absolute z-100 w-full mt-2 bg-arena-dark/95 border border-primary/30 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">
                  
                  {/* HUD Header */}
                  <div className="p-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <p className="text-[8px] font-mono text-primary tracking-[0.2em] px-2 flex items-center gap-2">
                      {sectorsLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={10} className="animate-spin" /> SCANNING_GRID...
                        </span>
                      ) : (
                        <>AVAILABLE_UPLINKS [{suggestedSectors.length}]</>
                      )}
                    </p>
                    <div className="flex gap-1 pr-2">
                      <div className="w-1 h-1 bg-primary/40 rounded-full" />
                      <div className="w-1 h-1 bg-primary/20 rounded-full" />
                    </div>
                  </div>

                  {/* Scrollable Results */}
                  <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                    {suggestedSectors.length > 0 ? (
                      suggestedSectors.map((s, index) => (
                        <button
                          key={s.id}
                          style={{ animationDelay: `${index * 40}ms` }}
                          className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-all flex items-center justify-between group/item animate-in fade-in slide-in-from-left-2"
                          onClick={() => {
                            setAccessKey(s.accessKey);
                            setShowSuggestions(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-[11px] font-display tracking-wider uppercase text-white/80 group-hover/item:text-primary transition-colors">
                                {s.title}
                            </span>
                            <span className="text-[7px] text-muted-foreground/50 font-mono tracking-tighter">
                              KEY_AUTH_{s.accessKey}
                            </span>
                          </div>
                          <Check size={14} className="opacity-0 group-hover/item:opacity-100 text-primary transition-all -translate-x-2 group-hover/item:translate-x-0" />
                        </button>
                      ))
                    ) : !sectorsLoading && (
                      <div className="px-4 py-8 text-center">
                        <p className="text-[10px] font-mono text-destructive uppercase tracking-widest animate-pulse">
                          [ NO_SECTOR_IDENTIFIED ]
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error HUD Overlay */}
              {errorMessage && !showSuggestions && (
                <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-2 text-destructive animate-in fade-in slide-in-from-top-1">
                  <AlertTriangle size={12} />
                  <span className="text-[9px] font-mono uppercase tracking-tighter italic font-bold">
                    {`> ERR: ${errorMessage}`}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4">
                <NeonButton
                size="responsive"
                onClick={handleJoin}
                disabled={!accessKey.trim() || isVerifying}
                className="w-full shadow-glow-primary"
                >
                {isVerifying ? "ESTABLISHING UPLINK..." : "INITIALIZE SYNC"}
                </NeonButton>
            </div>

            {/* Tactical Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-linear-to-r from-transparent to-arena-border" />
              <span className="text-muted-foreground/40 font-mono text-[9px] tracking-widest">OR</span>
              <div className="flex-1 h-px bg-linear-to-l from-transparent to-arena-border" />
            </div>

            {/* Alternative Tactical Options */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-arena-card border border-arena-border hover:border-primary/40 transition-all group">
                <Link2 size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground group-hover:text-white">Uplink</span>
              </button>

              <button
                disabled
                className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-black/40 border border-white/5 cursor-not-allowed group overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-tr from-destructive/10 to-transparent opacity-50" />
                <Lock size={16} className="text-muted-foreground/40 relative z-10" />
                <span className="text-[8px] font-bold tracking-widest uppercase text-muted-foreground/40 relative z-10">LOCKED</span>
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/90 flex items-center justify-center p-2 text-center">
                  <p className="text-[7px] text-destructive leading-tight font-mono uppercase tracking-tighter">Requires Level 1 Clearance</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Footer */}
        <div className="mt-auto pt-8 text-center space-y-6 shrink-0">
          <div className="flex flex-col items-center opacity-30">
            <ShieldCheck size={24} className="mb-2" />
            <p className="text-[8px] font-mono uppercase tracking-[0.3em]">
              Verified Secure by DeskMate Infrastructure
            </p>
          </div>

          <button
            onClick={() => router.push("/lobby")}
            className="group inline-flex flex-col items-center gap-1"
          >
            <span className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
              Skip for Test-Deployment
            </span>
            <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300" />
          </button>
        </div>
      </div>
    </EnergyBackground>
  );
};

export default JoinCourse;