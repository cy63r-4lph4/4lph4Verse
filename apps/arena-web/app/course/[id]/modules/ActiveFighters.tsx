"use client";

import { useState } from "react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { Swords } from "lucide-react";
import { mockFighters } from "@verse/arena-web/app/course/[id]/modules/MockFighters";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Fighter {
  id: string;
  name: string;
  isOnline: boolean;
  avatar: string;
  level?: number;
}

interface ActiveFightersProps {
  fighters?: Fighter[];
  onChallenge?: (fighter: Fighter) => void;
}

// ─── Fighter Card ─────────────────────────────────────────────────────────────

function FighterCard({
  fighter,
  onChallenge,
}: {
  fighter: Fighter;
  onChallenge?: (f: Fighter) => void;
}) {
  const [tapped, setTapped] = useState(false);

  // Tap the avatar → toggle the duel overlay
  const handleAvatarTap = () => {
    if (!fighter.isOnline) return;
    setTapped((prev) => !prev);
  };

  // Tap the Duel button → fire challenge, close overlay
  const handleDuel = () => {
    setTapped(false);
    onChallenge?.(fighter);
  };

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 select-none w-[64px]">

      {/* ── AVATAR TAP TARGET ───────────────────────────────────────── */}
      {/*
       * Using a div[role=button] instead of <button> so we can freely
       * place the Duel <button> as a sibling below — no nested button
       * issue, no event swallowing.
       */}
      <div
        role="button"
        tabIndex={fighter.isOnline ? 0 : -1}
        onClick={handleAvatarTap}
        onKeyDown={(e) => e.key === "Enter" && handleAvatarTap()}
        className={cn(
          "relative w-14 h-14 rounded-full outline-none",
          "transition-transform duration-150",
          fighter.isOnline ? "cursor-pointer active:scale-90" : "cursor-default"
        )}
      >
        {/* Glow ring — transitions to orange when tapped */}
        {fighter.isOnline && (
          <div
            className="absolute -inset-[3px] rounded-full border pointer-events-none"
            style={{
              borderColor: tapped ? "rgba(255,107,0,0.6)" : "rgba(34,197,94,0.5)",
              boxShadow: tapped
                ? "0 0 18px rgba(255,107,0,0.5), inset 0 0 10px rgba(255,107,0,0.15)"
                : "0 0 12px rgba(34,197,94,0.3), inset 0 0 8px rgba(34,197,94,0.1)",
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            }}
          />
        )}

        {/* Offline dim ring */}
        {!fighter.isOnline && (
          <div className="absolute -inset-[3px] rounded-full border border-white/5 pointer-events-none" />
        )}

        {/* Avatar */}
        <ArenaAvatar
          src={fighter.avatar}
          size="md"
          className={cn(
            "w-14 h-14 rounded-full border-2 border-black/60 pointer-events-none",
            "transition-all duration-300",
            !fighter.isOnline && "grayscale brightness-50"
          )}
        />

        {/* Orange duel overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-full flex items-center justify-center",
            "pointer-events-none transition-opacity duration-200",
            tapped ? "opacity-100" : "opacity-0"
          )}
          style={{ background: "rgba(255,107,0,0.88)" }}
        >
          <Swords size={20} className="text-white" />
        </div>

        {/* Status dot */}
        <span
          className={cn(
            "absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full",
            "border-2 border-[#0a0a0a] pointer-events-none",
            fighter.isOnline ? "bg-green-500" : "bg-gray-700"
          )}
        >
          {fighter.isOnline && !tapped && (
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
          )}
        </span>

        {/* Level badge */}
        {fighter.level && (
          <span
            className={cn(
              "absolute -bottom-2.5 left-1/2 -translate-x-1/2",
              "px-1.5 py-px rounded-md border text-[8px] font-bold",
              "leading-tight whitespace-nowrap tracking-wide font-display pointer-events-none",
              fighter.isOnline
                ? tapped
                  ? "bg-orange-950 border-orange-500/40 text-orange-400"
                  : "bg-green-950 border-green-700/40 text-green-400"
                : "bg-black/80 border-white/8 text-white/20"
            )}
          >
            LVL {fighter.level}
          </span>
        )}
      </div>

      {/* ── DUEL BUTTON ─────────────────────────────────────────────── */}
      {/*
       * Sibling element — NOT nested inside the avatar div.
       * This is the key fix: clean separate button with its own click,
       * no event competition.
       */}
      <div
        className={cn(
          "w-full overflow-hidden transition-all duration-200 ease-out",
          tapped ? "max-h-8 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
        )}
      >
        <button
          onClick={handleDuel}
          className={cn(
            "w-full py-1.5 rounded-lg border-none outline-none",
            "text-[9px] font-black uppercase tracking-wider text-white",
            "active:scale-95 transition-transform duration-150"
          )}
          style={{
            background: "linear-gradient(135deg, #ff6b00, #c0392b)",
            boxShadow: "0 2px 10px rgba(255,80,0,0.45)",
          }}
        >
          ⚔ Duel!
        </button>
      </div>

      {/* ── NAME ────────────────────────────────────────────────────── */}
      <span
        className={cn(
          "text-[9px] font-bold font-display uppercase tracking-wide",
          "max-w-full truncate text-center leading-tight transition-colors duration-200",
          fighter.level ? "mt-2" : "mt-0",
          tapped
            ? "text-orange-400"
            : fighter.isOnline
              ? "text-white/80"
              : "text-white/20"
        )}
      >
        {fighter.name}
      </span>

      {/* ── STATUS ──────────────────────────────────────────────────── */}
      <span
        className={cn(
          "text-[8px] font-semibold uppercase tracking-widest -mt-1",
          fighter.isOnline ? "text-green-500" : "text-white/15"
        )}
      >
        {fighter.isOnline ? "Online" : "Away"}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ActiveFighters({ fighters = mockFighters, onChallenge }: ActiveFightersProps) {
  const onlineCount = fighters.filter((f) => f.isOnline).length;

  // Online fighters always first
  const sorted = [...fighters].sort((a, b) => Number(b.isOnline) - Number(a.isOnline));

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="flex items-center gap-2 px-1 mb-4">
        <span
          className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 animate-pulse"
          style={{ boxShadow: "0 0 8px #22c55e" }}
        />
        <h3 className="font-display text-[10px] font-bold text-white/35 uppercase tracking-[0.3em] whitespace-nowrap">
          Fighter Radar
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
        <span className="text-[10px] font-bold font-display text-green-400 tracking-wide whitespace-nowrap">
          {onlineCount} Online
        </span>
      </div>

      {/* Scroll strip */}
      <div
        className="overflow-x-auto scrollbar-hide"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div className="flex gap-4 px-5 pb-3 pt-1">
          {sorted.map((fighter) => (
            <FighterCard
              key={fighter.id}
              fighter={fighter}
              onChallenge={onChallenge}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActiveFighters;