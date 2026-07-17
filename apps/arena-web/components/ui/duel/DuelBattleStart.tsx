"use client";

import { Swords, Shield, Hourglass } from "lucide-react";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { cn } from "@verse/ui";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

interface FighterInfo {
  name: string;
}

function FighterCard({ fighter, side, label, glowColor }: {
  fighter: FighterInfo; side: "left" | "right"; label: string; glowColor: "primary" | "danger";
}) {
  const auraColor = glowColor === "primary" ? "hsl(var(--primary) / .25)" : "rgba(239,68,68,.2)";
  const labelColor = glowColor === "primary" ? "text-primary" : "text-red-400";

  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full blur-2xl pointer-events-none" style={{ background: auraColor, animation: "pulse 2.5s ease-in-out infinite" }} />
        <ArenaAvatar src={dicebearUrl(fighter.name)} size="2xl" glow glowColor={glowColor === "primary" ? "primary" : "danger"} />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className={cn("font-display text-[9px] font-black uppercase tracking-[.3em]", labelColor)}>{label}</span>
        <span className="font-display text-[13px] font-black text-white uppercase tracking-wide text-center leading-tight">
          {fighter.name}
        </span>
      </div>
    </div>
  );
}

function VsDivider() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 shrink-0">
      <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
      <div className="w-12 h-12 rounded-2xl border border-amber-400/30 bg-amber-400/10 flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(251,191,36,.2)" }}>
        <span className="font-display text-[18px] font-black text-amber-400 italic leading-none" style={{ textShadow: "0 0 12px rgba(251,191,36,.8)" }}>VS</span>
      </div>
      <div className="w-px h-8 bg-gradient-to-t from-transparent to-white/20" />
    </div>
  );
}

interface DuelBattleStartProps {
  me: FighterInfo;
  opponent: FighterInfo;
  iAmChallenger: boolean;
  questionsPerMatch: number;
  onAccept: () => void;
  onDecline: () => void;
}

export function DuelBattleStart({ me, opponent, iAmChallenger, questionsPerMatch, onAccept, onDecline }: DuelBattleStartProps) {
  return (
    <EnergyBackground variant="duel" className="h-full flex flex-col">
      <div className="shrink-0 pt-10 pb-6 px-6 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top duration-700">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
          <Shield size={9} className="text-primary" />
          <span className="font-display text-[9px] font-black text-primary/70 uppercase tracking-[.2em]">Peer Duel</span>
        </div>
        <h2 className="font-display text-[24px] font-black text-white uppercase tracking-wide text-center leading-tight" style={{ textShadow: "0 0 30px hsl(var(--primary) / .3)" }}>
          {iAmChallenger ? "Challenge Sent" : "Incoming Challenge"}
        </h2>
        <div className="flex items-center gap-2 h-5">
          <Hourglass size={10} className="text-primary/50 animate-pulse" />
          <span className="font-display text-[9px] font-bold text-white/25 uppercase tracking-[.2em]">
            {iAmChallenger ? "Awaiting response…" : "Respond to engage"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 min-h-0">
        <div className="w-full flex items-center gap-3">
          <FighterCard fighter={me} side="left" label="You" glowColor="primary" />
          <VsDivider />
          <FighterCard fighter={opponent} side="right" label={iAmChallenger ? "Challenged" : "Challenger"} glowColor="danger" />
        </div>
      </div>

      <div className="shrink-0 px-5 pb-10 pt-4">
        {!iAmChallenger ? (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onDecline}
              className="py-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] font-display text-[12px] font-black uppercase tracking-[.2em] text-white/50 active:scale-[.98] transition-all"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="relative py-4 rounded-2xl font-display text-[12px] font-black uppercase tracking-[.2em] text-white flex items-center justify-center gap-2 active:scale-[.98] transition-all"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), color-mix(in srgb, hsl(var(--primary)) 70%, black))", boxShadow: "0 4px 28px hsl(var(--primary) / .4)" }}
            >
              <Swords size={15} />
              Accept
            </button>
          </div>
        ) : (
          <div className="py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
            <span className="font-display text-[11px] font-bold text-white/30 uppercase tracking-[.2em]">Waiting for opponent…</span>
          </div>
        )}
        <p className="text-center font-display text-[9px] font-bold text-white/15 uppercase tracking-[.2em] mt-3">
          {questionsPerMatch} questions · First to answer wins each round
        </p>
      </div>
    </EnergyBackground>
  );
}