"use client";

import { Hourglass, Crown, Skull } from "lucide-react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";

interface TournamentWaitingRoomProps {
  status: "eliminated" | "awaiting-next-round" | "bye";
  roundLabel?: string;
}

export function TournamentWaitingRoom({ status, roundLabel }: TournamentWaitingRoomProps) {
  const config = {
    eliminated: {
      icon: Skull,
      color: "text-white/20",
      title: "Eliminated",
      sub: "Watch the rest of the tournament unfold on the big screen",
    },
    "awaiting-next-round": {
      icon: Hourglass,
      color: "text-primary/60",
      title: `Advancing to ${roundLabel ?? "next round"}`,
      sub: "The instructor will start your match shortly",
    },
    bye: {
      icon: Crown,
      color: "text-amber-400/70",
      title: "Bye — free pass",
      sub: "No opponent this round. You advance automatically",
    },
  }[status];

  const Icon = config.icon;

  return (
    <EnergyBackground variant="duel" className="h-full grid place-items-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Icon size={40} className={config.color} />
        <p className="font-display text-lg font-black text-white uppercase tracking-wide">{config.title}</p>
        <p className="font-display text-[10px] font-bold text-white/25 uppercase tracking-[.2em] max-w-xs">
          {config.sub}
        </p>
      </div>
    </EnergyBackground>
  );
}