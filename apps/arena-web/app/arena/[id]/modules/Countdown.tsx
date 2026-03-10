"use client";

import { useState, useEffect, useRef } from "react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { cn } from "@verse/ui";

interface CountdownProps {
  onComplete: () => void;
}

// Each beat gets its own color + label to build tension
const BEAT_CONFIG = {
  3: { color: "text-primary",  shadow: "hsl(var(--primary) / .7)",       label: "PREPARE"  },
  2: { color: "text-amber-400", shadow: "rgba(251,191,36,.7)",            label: "FOCUS"    },
  1: { color: "text-red-400",   shadow: "rgba(239,68,68,.8)",             label: "LOCK IN"  },
  0: { color: "text-amber-400", shadow: "rgba(251,191,36,.9)",            label: null       },
} as const;

export default function Countdown({ onComplete }: CountdownProps) {
  const [count,       setCount]       = useState(3);
  const [shakeKey,    setShakeKey]    = useState(0); // increment to re-trigger animation
  const [flashActive, setFlashActive] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (count > 0) {
      const t = setTimeout(() => {
        // Flash on impact
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 120);
        setShakeKey(k => k + 1);
        setCount(prev => prev - 1);
      }, 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => onCompleteRef.current(), 650);
      return () => clearTimeout(t);
    }
  }, [count]);

  const cfg = BEAT_CONFIG[count as keyof typeof BEAT_CONFIG];

  return (
    <EnergyBackground variant="battle" className="h-full flex items-center justify-center">

      {/* Impact flash overlay */}
      <div
        className={cn(
          "fixed inset-0 pointer-events-none z-20 transition-opacity duration-75",
          flashActive ? "opacity-100 bg-white/8" : "opacity-0"
        )}
      />

      {/* Screen shake wrapper — re-mounts on shakeKey change to replay animation */}
      <div
        key={shakeKey}
        className="relative flex flex-col items-center"
        style={{ animation: shakeKey > 0 ? "shake 0.25s ease-in-out" : "none" }}
      >
        {/* Ambient glow behind number */}
        <div
          className="absolute inset-0 blur-[80px] rounded-full pointer-events-none transition-all duration-300"
          style={{
            background: cfg.shadow,
            opacity: count === 0 ? 0.4 : 0.2,
            transform: count === 0 ? "scale(2.5)" : "scale(1.2)",
          }}
        />

        {count > 0 ? (
          <>
            {/* Tactic label above number */}
            <p
              className="font-display text-[11px] font-black uppercase tracking-[.5em] mb-2 transition-colors duration-200"
              style={{ color: cfg.shadow, opacity: 0.6 }}
            >
              {cfg.label}
            </p>

            {/* The number itself */}
            <div
              key={`num-${count}`}
              className={cn(
                "font-display font-black leading-none relative z-10",
                "text-[160px]",
                cfg.color,
                // animate-in from shadcn/tailwind-animate
                "animate-in zoom-in-75 fade-in duration-200"
              )}
              style={{ textShadow: `0 0 40px ${cfg.shadow}, 0 0 80px ${cfg.shadow}` }}
            >
              {count}
            </div>

            {/* Beat bar — shrinks over 900ms to show time passing */}
            <div className="mt-6 w-16 h-[3px] rounded-full bg-white/10 overflow-hidden relative z-10">
              <div
                className="h-full rounded-full"
                style={{
                  background: cfg.shadow,
                  width: "100%",
                  animation: "shrink-width 0.9s linear forwards",
                }}
              />
            </div>
          </>
        ) : (
          // GO!
          <div
            key="go"
            className="animate-in zoom-in-50 fade-in duration-200 flex flex-col items-center relative z-10"
          >
            <div
              className="font-display text-[120px] font-black italic text-amber-400 leading-none tracking-tighter"
              style={{ textShadow: "0 0 60px rgba(251,191,36,.9), 0 0 120px rgba(251,191,36,.5)" }}
            >
              GO!
            </div>
            <p className="font-display text-[10px] font-black text-white/30 uppercase tracking-[.5em] mt-2">
              Combat_Initiated
            </p>
          </div>
        )}
      </div>

      {/* Inject keyframes — shrink-width not in Tailwind by default */}
      <style>{`
        @keyframes shrink-width {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>

    </EnergyBackground>
  );
}