'use client'
import { useState } from "react";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import {InputField} from "@verse/arena-web/components/ui/InputField";

const gamerNamePrefixes = ["Shadow", "Night", "Storm", "Blaze", "Frost", "Thunder", "Cyber", "Nova", "Phantom", "Venom"];
const gamerNameSuffixes = ["Scholar", "Hawk", "Wolf", "Fox", "Ace", "King", "Queen", "Master", "Pro", "Elite"];

const generateGamerName = () => {
  const prefix = gamerNamePrefixes[Math.floor(Math.random() * gamerNamePrefixes.length)];
  const suffix = gamerNameSuffixes[Math.floor(Math.random() * gamerNameSuffixes.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${prefix}${suffix}${num}`;
};

const universities = [
  "MIT",
  "Stanford University",
  "Harvard University",
  "UCLA",
  "UC Berkeley",
  "Yale University",
  "Columbia University",
  "University of Michigan",
  "Duke University",
  "Northwestern University",
];

export default function Setup() {
  const router = useRouter();
  const [username, setUsername] = useState(generateGamerName());
  const [university, setUniversity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    // Mimic "Uploading Identity" to the Arena
    setTimeout(() => {
      router.push("/join-course");
    }, 1000);
  };

  return (
    <EnergyBackground className="flex flex-col h-dvh">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center">
        
        {/* Header with tactical vibe */}
        <div className="text-center mb-10">
          <h1 className="font-display text-xl font-black text-white tracking-[0.3em] uppercase mb-2 text-glow">
            Identity Forge
          </h1>
          <div className="h-px w-12 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-mono">
            Registering Unit in Global Network
          </p>
        </div>

        {/* Character/Avatar Console */}
        <div className="relative mb-12 flex flex-col items-center group">
          <div className="animate-fade-scale-in">
             <ArenaAvatar
              src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`}
              alt={username}
              size="2xl"
              glow
            />
          </div>
          
          <button
            onClick={() => setUsername(generateGamerName())}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-muted/30 border border-white/10 rounded-full 
                       hover:border-primary/50 transition-all active:scale-95 group"
          >
            <RefreshCw size={12} className="text-primary group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-mono text-white tracking-tighter uppercase">Reroll Identity</span>
          </button>
        </div>

        {/* Form Console */}
        <div className="w-full max-w-sm space-y-8 animate-slide-up">
          <InputField
            label="Tactical Codename"
            prefixText="UID_STU"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="relative">
            <InputField
              label="Institutional Hub"
              prefixText="LOC_INST"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Search School..."
            />
            {/* ... Autocomplete Logic remains similar, but style with .bg-arena-card ... */}
          </div>
        </div>
      </div>

      {/* Fixed Action Footer (Native App Style) */}
      <div className="p-6 bg-linear-to-t from-background via-background/90 to-transparent">
        <div className="max-w-sm mx-auto w-full">
          <NeonButton
            size="responsive"
            onClick={handleContinue}
            disabled={!username.trim() || !university.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? "FORGING..." : "DEPLOY"}
          </NeonButton>
          
          <p className="mt-4 text-[8px] text-center text-muted-foreground font-mono uppercase tracking-[0.2em] opacity-40">
            Secure uplink established via DeskMate Protocol v1.0
          </p>
        </div>
      </div>
    </EnergyBackground>
  );
}

