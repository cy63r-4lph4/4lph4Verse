'use client'
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ArrowLeft, Search, Check, ShieldClose, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@verse/ui";

import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import { InputField } from "@verse/arena-web/components/ui/InputField";
import { useCodenameAvailability } from "@verse/arena-web/hooks/useCodeNameAvaillability";
import useUniversities from "@verse/arena-web/hooks/useUniversities";
import useForge from "@verse/arena-web/hooks/useForge";

/**
 * LOGIC HELPERS: Identity Generation
 */
const gamerNamePrefixes = ["Shadow", "Night", "Storm", "Blaze", "Frost", "Thunder", "Cyber", "Nova", "Phantom", "Venom"];
const gamerNameSuffixes = ["Scholar", "Hawk", "Wolf", "Fox", "Ace", "King", "Queen", "Master", "Pro", "Elite"];

const generateGamerName = () => {
  const prefix = gamerNamePrefixes[Math.floor(Math.random() * gamerNamePrefixes.length)];
  const suffix = gamerNameSuffixes[Math.floor(Math.random() * gamerNameSuffixes.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${prefix}${suffix}${num}`;
};



/**
 * MAIN COMPONENT: Identity Forge
 */
export default function Setup() {
  const [step, setStep] = useState(1);


  // Phase 1: Identity
  const [username, setUsername] = useState("");
  const [sector, setSector] = useState("");
  const [showUniSuggestions, setShowUniSuggestions] = useState(false);
  const { isAvailable, isChecking } = useCodenameAvailability(username);

  const { sectors, isLoading: uniLoading } = useUniversities();

  const { forge, isForging, errorMessage } = useForge();
  // Phase 2: Security
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setUsername(generateGamerName());
  }, []);

  // Logic: Search Filter
  const filteredUniversities = useMemo(() => {
    if (!sector || sector.length < 2) return [];
    const term = sector.toLowerCase();

    return sectors.filter(school =>
      school.name.toLowerCase().includes(term) ||
      school.slug.toLowerCase().includes(term)
    ).slice(0, 6);
  }, [sector, sectors]);

  const handleForge = async () => {
    try {
      await forge({
        username,
        email,
        password,
        sector,
      });
    } catch (error) {
    }

  };

  const isEmailValid = email.trim() === "" || (email.includes('@') && email.includes('.'));
  const isPasswordValid = password.length >= 6;

  return (
    <EnergyBackground className="flex flex-col h-dvh overflow-hidden">

      {/* Top Nav: Tactical Progress */}
      <div className="px-6 pt-8 flex items-center justify-between z-50">
        <div className="w-1/3">
          {step > 1 && (
            <button
              onClick={() => setStep(1)}
              className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Back</span>
            </button>
          )}
        </div>

        <div className="w-1/3 flex justify-center">
          <div className="flex gap-1.5">
            <div className={cn("h-1 w-6 rounded-full transition-all duration-500", step === 1 ? "bg-primary w-12" : "bg-primary/20")} />
            <div className={cn("h-1 w-6 rounded-full transition-all duration-500", step === 2 ? "bg-primary w-12" : "bg-primary/20")} />
          </div>
        </div>

        <div className="w-1/3 text-right">
          <span className="text-primary font-mono text-[9px] tracking-[0.4em] opacity-60">
            PHASE_0{step}
          </span>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col items-center ">

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-black text-white tracking-[0.3em] uppercase mb-1 text-glow">
            {step === 1 ? "Identity Forge" : "Secure Comms"}
          </h1>
          <p className="text-muted-foreground text-[9px] uppercase tracking-widest font-mono italic opacity-70">
            {step === 1 ? "Synthesizing battle persona..." : "Encrypting fighter credentials..."}
          </p>
        </div>

        {step === 1 ? (
          /* PHASE 1: CHARACTER CREATION */
          <div className="w-full flex flex-col items-center animate-fade-scale-in">
            <div className="relative mb-12 group">
              {/* Spinning decorative ring */}
              <div className="absolute inset-[-15px] border border-dashed border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />

              <ArenaAvatar
                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`}
                alt={username}
                size="2xl"
                glow
              />

              <button
                onClick={() => setUsername(generateGamerName())}
                className="absolute -bottom-2 -right-2 p-3 bg-arena-card border border-primary/40 rounded-full 
                           hover:border-primary shadow-lg transition-all active:scale-90 text-primary z-10"
              >
                <RefreshCw size={18} className="hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            <div className="w-full max-w-sm space-y-8">
              <div className="relative group">
                <InputField
                  label="Tactical Codename"
                  prefixText="UID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  className={cn(
                    "transition-all duration-500",
                    isAvailable === true && "border-success/50 shadow-[0_0_10px_rgba(34,197,94,0.1)]",
                    isAvailable === false && "border-destructive/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                  )}
                />

                {/* Integrated HUD Status Bar */}
                <div className="absolute right-3 top-[38px] flex items-center h-10 px-3 border-l border-white/10">
                  {isChecking ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-primary" />
                      <span className="text-[9px] font-mono text-primary animate-pulse tracking-tighter">SCANNING...</span>
                    </div>
                  ) : isAvailable === true ? (
                    <div className="flex items-center gap-2 animate-fade-scale-in">
                      <div className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_#22c55e]" />
                      <span className="text-[9px] font-mono text-success tracking-widest font-bold">AVAILABLE</span>
                    </div>
                  ) : isAvailable === false ? (
                    <div className="flex items-center gap-2 animate-fade-scale-in">
                      <AlertCircle size={14} className="text-destructive" />
                      <span className="text-[9px] font-mono text-destructive tracking-widest font-bold">OCCUPIED</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-mono text-muted-foreground/30 tracking-tighter">WAITING_INPUT</span>
                  )}
                </div>

                {/* Error message placed directly under the input with a "terminal" style */}
                {isAvailable === false && (
                  <p className="absolute -bottom-5 left-1 text-[8px] font-mono text-destructive uppercase tracking-tighter italic">
                    {`> Critical: Codename collision detected in sector.`}
                  </p>
                )}
              </div>
              <div className="relative group">
                <InputField
                  label="Institutional Hub"
                  prefixText="LOC"
                  value={sector}
                  onFocus={() => setShowUniSuggestions(true)}
                  onChange={(e) => {
                    setSector(e.target.value);
                    setShowUniSuggestions(true);
                  }}
                  placeholder="Search School..."
                  autoComplete="off"
                  className={cn(
                    "transition-all duration-300",
                    sector && "border-primary/40 shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]"
                  )}
                />

                {/* Input Icon: Location Ping */}
                <div className="absolute right-4 top-[38px] pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <div className={cn(
                      "absolute h-2 w-2 rounded-full bg-primary transition-all duration-500",
                      isChecking ? "animate-ping" : "opacity-40"
                    )} />
                    <Search size={14} className={cn(
                      "relative transition-colors duration-300",
                      isChecking ? "text-primary" : "text-muted-foreground/30"
                    )} />
                  </div>
                </div>

                {/* Tactical Search Dropdown */}
                {showUniSuggestions && (sector || isChecking) && (
                  <div className="absolute overflow-y-auto h-[220px] z-100 w-full mt-2 bg-arena-dark/95 border border-primary/30 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">

                    {/* HUD Header */}
                    <div className="p-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                      <p className="text-[8px] font-mono text-primary tracking-[0.2em] px-2 flex items-center gap-2">
                        {isChecking ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={10} className="animate-spin" /> SCANNING_SECTORS...
                          </span>
                        ) : (
                          <>MATCHES_FOUND [{filteredUniversities.length}]</>
                        )}
                      </p>
                      <div className="flex gap-1 pr-2">
                        <div className="w-1 h-1 bg-primary/40 rounded-full" />
                        <div className="w-1 h-1 bg-primary/20 rounded-full" />
                      </div>
                    </div>

                    <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                      {filteredUniversities.length > 0 ? (
                        filteredUniversities.map((uni, index) => (
                          <button
                            key={uni.id}
                            style={{ animationDelay: `${index * 40}ms` }}
                            className="w-full px-4 py-3 text-left text-[11px] font-semibold text-white/70 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between group/item animate-in fade-in slide-in-from-left-2"
                            onClick={() => {
                              setSector(uni.name);
                              setShowUniSuggestions(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-display tracking-wider uppercase">{uni.name}</span>
                              <span className="text-[7px] text-muted-foreground/50 font-mono tracking-tighter">
                                COORD_AUTH_{uni.name.substring(0, 3).toUpperCase()}_2026
                              </span>
                            </div>
                            <Check size={14} className="opacity-0 group-hover/item:opacity-100 text-primary transition-all -translate-x-2 group-hover/item:translate-x-0" />
                          </button>
                        ))
                      ) : !isChecking && (
                        <div className="px-4 py-8 text-center">
                          <p className="text-[10px] font-mono text-destructive uppercase tracking-widest animate-pulse">
                            [ NO_INSTITUTION_FOUND ]
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* PHASE 2: SECURITY & ENCRYPTION */
          <div className="w-full max-w-sm space-y-10 animate-slide-up">
            <div className="relative p-6 rounded-2xl bg-arena-card border border-primary/10 overflow-hidden">
              {/* Decorative background icon */}
              <ShieldClose className="absolute -right-4 -bottom-4 size-24 text-primary/5 -rotate-12" />

              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                  <ShieldClose size={24} className="text-primary animate-pulse" />
                </div>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed uppercase tracking-tight">
                  Identity persistence required. Establish secondary uplink to prevent data loss across sectors.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <InputField
                label="Uplink Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@institution.edu"
              />
              <InputField
                label="Access Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
        )}
      </div>

      {/* FIXED ACTION FOOTER */}
      <div className="p-6 bg-linear-to-t from-background via-background/95 to-transparent z-50">
        <div className="max-w-sm mx-auto w-full">
          {/* HUD ERROR OVERRIDE */}
          {errorMessage && (
            <div className="mb-4 animate-in fade-in zoom-in duration-300">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3 relative overflow-hidden">
                {/* Glitch Decorative Background */}
                <div className="absolute inset-0 bg-[url('/glitch-pattern.png')] opacity-5 pointer-events-none" />

                <AlertCircle className="text-destructive shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <p className="text-[10px] font-mono font-bold text-destructive tracking-widest uppercase">
                    Forge_Interrupt_Error
                  </p>
                  <p className="text-[9px] font-mono text-destructive/80 leading-tight uppercase">
                    {`> ${errorMessage}`}
                  </p>
                </div>
              </div>
            </div>
          )}
          <NeonButton
            size="responsive"
            onClick={() => step === 1 ? setStep(2) : handleForge()}
            disabled={
              step === 1
                ? (!username.trim() || !sector.trim())
                : (!isEmailValid || !isPasswordValid) || isForging || isChecking || !isAvailable
            }
            className="w-full"
          >
            {isForging ? "FORGING..." : step === 1 ? "NEXT PHASE" : "INITIALIZE DEPLOYMENT"}
          </NeonButton>

          <div className="mt-6 flex flex-col items-center gap-1 opacity-40">
            <p className="text-[7px] font-mono text-white tracking-[0.4em] uppercase">
              {isForging ? "Syncing_Protocol_Active" : "Ready_for_Deployment"}
            </p>
            <div className="h-1px w-24 bg-linear-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </div>
      </div>
    </EnergyBackground>
  );
}