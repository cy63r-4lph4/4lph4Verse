"use client";

import { useEffect, useState } from "react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { cn } from "@verse/ui";

const BEAT_CONFIG: Record<number, { color: string; shadow: string; label: string | null }> = {
  3: { color: "text-primary", shadow: "hsl(var(--primary) / .7)", label: "PREPARE" },
  2: { color: "text-amber-400", shadow: "rgba(251,191,36,.7)", label: "FOCUS" },
  1: { color: "text-red-400", shadow: "rgba(239,68,68,.8)", label: "LOCK IN" },
};

export function DuelCountdown({ secondsLeft }: { secondsLeft: number }) {
  const [flash, setFlash] = useState(false);
  const [prevSecond, setPrevSecond] = useState(secondsLeft);

  useEffect(() => {
    if (secondsLeft !== prevSecond) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 120);
      setPrevSecond(secondsLeft);
      return () => clearTimeout(t);
    }
  }, [secondsLeft, prevSecond]);

  const clamped = Math.min(3, Math.max(0, secondsLeft));
  const cfg = BEAT_CONFIG[clamped] ?? { color: "text-amber-400", shadow: "rgba(251,191,36,.9)", label: null };

  return (
    <EnergyBackground variant="duel" className="h-full flex items-center justify-center">
      <div className={cn("fixed inset-0 pointer-events-none z-20 transition-opacity duration-75", flash ? "opacity-100 bg-white/[0.08]" : "opacity-0")} />

      <div className="relative flex flex-col items-center">
        <div
          className="absolute inset-0 blur-[80px] rounded-full pointer-events-none transition-all duration-300"
          style={{ background: cfg.shadow, opacity: clamped === 0 ? 0.4 : 0.2, transform: clamped === 0 ? "scale(2.5)" : "scale(1.2)" }}
        />

        {clamped > 0 ? (
          <>
            {cfg.label && (
              <p className="font-display text-[11px] font-black uppercase tracking-[.5em] mb-2" style={{ color: cfg.shadow, opacity: 0.6 }}>
                {cfg.label}
              </p>
            )}
            <div
              key={clamped}
              className={cn("font-display font-black leading-none relative z-10 text-[160px] animate-in zoom-in-75 fade-in duration-200", cfg.color)}
              style={{ textShadow: `0 0 40px ${cfg.shadow}, 0 0 80px ${cfg.shadow}` }}
            >
              {clamped}
            </div>
          </>
        ) : (
          <div key="go" className="animate-in zoom-in-50 fade-in duration-200 flex flex-col items-center relative z-10">
            <div className="font-display text-[120px] font-black italic text-amber-400 leading-none tracking-tighter" style={{ textShadow: "0 0 60px rgba(251,191,36,.9), 0 0 120px rgba(251,191,36,.5)" }}>
              GO!
            </div>
            <p className="font-display text-[10px] font-black text-white/30 uppercase tracking-[.5em] mt-2">Combat_Initiated</p>
          </div>
        )}
      </div>
    </EnergyBackground>
  );
}