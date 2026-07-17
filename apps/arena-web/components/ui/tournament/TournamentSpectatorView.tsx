"use client";

import { Shield, Swords } from "lucide-react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import type { Match } from "@verse/arena-web/lib/showdown/types";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

interface TournamentSpectatorViewProps {
  match: Match | null;
  playerAName: string;
  playerBName: string;
  roundLabel: string;
}

export function TournamentSpectatorView({ match, playerAName, playerBName, roundLabel }: TournamentSpectatorViewProps) {
  return (
    <EnergyBackground variant="duel" className="h-full flex flex-col items-center justify-center px-6 gap-6">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
        <Shield size={9} className="text-white/40" />
        <span className="font-display text-[9px] font-black text-white/40 uppercase tracking-[.2em]">
          Spectating · {roundLabel}
        </span>
      </div>

      {match ? (
        <>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <ArenaAvatar src={dicebearUrl(playerAName)} size="xl" />
              <p className="font-display text-sm font-black text-white uppercase">{playerAName}</p>
              <p className="font-display text-2xl font-black text-amber-300">{match.scores[match.playerAId] ?? 0}</p>
            </div>
            <Swords size={20} className="text-white/30" />
            <div className="flex flex-col items-center gap-2">
              <ArenaAvatar src={dicebearUrl(playerBName)} size="xl" />
              <p className="font-display text-sm font-black text-white uppercase">{playerBName}</p>
              <p className="font-display text-2xl font-black text-amber-300">
                {match.playerBId ? match.scores[match.playerBId] ?? 0 : 0}
              </p>
            </div>
          </div>
          <p className="font-display text-[10px] font-bold text-white/25 uppercase tracking-[.2em]">
            Your turn will come — stay ready
          </p>
        </>
      ) : (
        <p className="font-display text-[10px] font-bold text-white/25 uppercase tracking-[.2em]">
          Waiting for the next matchup…
        </p>
      )}
    </EnergyBackground>
  );
}