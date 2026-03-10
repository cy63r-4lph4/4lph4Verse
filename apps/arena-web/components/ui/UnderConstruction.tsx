"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { ArrowLeft, Construction, Radio, Cpu, Wrench } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

interface UnderConstructionProps {
    /** Name of the sector being built, e.g. "Resources" or "Duels" */
    sectorName?: string;
    /** Back button destination. Defaults to router.back() if not provided */
    backHref?: string;
}

// ─── Animated grid lines ──────────────────────────────────────────────────────

function GridOverlay() {
    return (
        <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
                backgroundImage: `
          linear-gradient(hsl(var(--primary) / 1) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--primary) / 1) 1px, transparent 1px)
        `,
                backgroundSize: "48px 48px",
            }}
        />
    );
}

// ─── Scanning beam ────────────────────────────────────────────────────────────

function ScanBeam() {
    return (
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none">
            <div
                className="absolute inset-x-0 h-[2px]"
                style={{
                    background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / .6) 50%, transparent 100%)",
                    animation: "scan-beam 3s ease-in-out infinite",
                    boxShadow: "0 0 16px hsl(var(--primary) / .4)",
                }}
            />
        </div>
    );
}

// ─── Progress bar that slowly fills then resets ───────────────────────────────

function BuildProgress() {
    const [pct, setPct] = useState(0);

    useEffect(() => {
        // Slowly count up to a random incomplete value then reset
        const target = 40 + Math.floor(Math.random() * 45); // 40–85%
        let current = 0;
        const step = () => {
            current += 0.4;
            if (current >= target) {
                // Hold, then restart
                setTimeout(() => { setPct(0); setTimeout(step, 300); }, 1800);
                setPct(target);
                return;
            }
            setPct(current);
            setTimeout(step, 16);
        };
        const t = setTimeout(step, 600);
        return () => clearTimeout(t);
    }, []);

    const color =
        pct < 30 ? "hsl(var(--primary))" :
            pct < 60 ? "#f59e0b" :
                "#ef4444";

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-display text-[9px] font-bold text-white/25 uppercase tracking-[.3em]">
                    Build Progress
                </span>
                <span
                    className="font-display text-[9px] font-black uppercase tracking-wider transition-colors"
                    style={{ color }}
                >
                    {Math.round(pct)}%
                </span>
            </div>
            <div className="h-[4px] rounded-full bg-white/[0.07] overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-75"
                    style={{
                        width: `${pct}%`,
                        background: `linear-gradient(to right, ${color}, ${color}99)`,
                        boxShadow: `0 0 8px ${color}`,
                    }}
                />
            </div>
            <p className="font-display text-[8px] font-bold text-white/15 uppercase tracking-[.2em]">
                Sector offline · Systems initialising
            </p>
        </div>
    );
}

// ─── Blinking log lines ───────────────────────────────────────────────────────

const LOG_LINES = [
    "Allocating memory blocks…",
    "Loading combat modules…",
    "Calibrating uplink nodes…",
    "Awaiting operator clearance…",
    "Sector blueprint compiled…",
    "Deployment scheduled…",
];

function SystemLog() {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let i = 0;
        const addLine = () => {
            if (i >= LOG_LINES.length) { i = 0; setLines([]); }
            setLines(prev => [...prev.slice(-4), `> ${LOG_LINES[i++]}`]);
            setTimeout(addLine, 900 + Math.random() * 600);
        };
        const t = setTimeout(addLine, 400);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="w-full rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3 space-y-1 font-display min-h-[88px]">
            {lines.map((line, i) => (
                <p
                    key={i}
                    className={cn(
                        "text-[9px] uppercase tracking-wider leading-relaxed transition-opacity duration-300",
                        i === lines.length - 1 ? "text-primary/70" : "text-white/20"
                    )}
                >
                    {line}
                    {i === lines.length - 1 && (
                        <span className="inline-block w-[6px] h-[10px] bg-primary/60 ml-1 align-middle animate-pulse" />
                    )}
                </p>
            ))}
        </div>
    );
}

// ─── Corner bracket decoration ────────────────────────────────────────────────

function CornerBrackets({ color = "primary" }: { color?: string }) {
    const cls = `absolute w-5 h-5 border-white/[0.12]`;
    return (
        <>
            <div className={cn(cls, "top-0 left-0 border-t border-l rounded-tl-lg")} />
            <div className={cn(cls, "top-0 right-0 border-t border-r rounded-tr-lg")} />
            <div className={cn(cls, "bottom-0 left-0 border-b border-l rounded-bl-lg")} />
            <div className={cn(cls, "bottom-0 right-0 border-b border-r rounded-br-lg")} />
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UnderConstruction({
    sectorName = "Sector",
    backHref,
}: UnderConstructionProps) {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(t);
    }, []);

    const handleBack = () => backHref ? router.push(backHref) : router.back();

    return (
        <>
            <style>{`
        @keyframes scan-beam {
          0%   { top: -2px;   opacity: 0; }
          10%  { opacity: 1;              }
          90%  { opacity: 1;              }
          100% { top: 100%;   opacity: 0; }
        }
        @keyframes float-wrench {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50%       { transform: translateY(-8px) rotate(6deg);  }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>

            <EnergyBackground className="flex flex-col h-dvh" variant="intense">

                {/* Grid + scan beam */}
                <GridOverlay />
                <ScanBeam />

                {/* ── HEADER ──────────────────────────────────────────────────────── */}
                <header className="shrink-0 h-14 px-4 flex items-center gap-3 relative z-10">
                    <button
                        onClick={handleBack}
                        className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all active:scale-90"
                    >
                        <ArrowLeft size={15} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Radio size={11} className="text-primary/50 animate-pulse" />
                        <span className="font-display text-[10px] font-black text-white/25 uppercase tracking-[.3em]">
                            {sectorName}
                        </span>
                    </div>
                </header>

                {/* ── MAIN ────────────────────────────────────────────────────────── */}
                <main className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 gap-8 relative z-10">

                    {/* Central icon cluster */}
                    <div
                        className={cn(
                            "flex flex-col items-center gap-5 transition-all duration-700",
                            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        )}
                    >
                        {/* Spinning ring + wrench */}
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            {/* Outer ring */}
                            <div
                                className="absolute inset-0 rounded-full border border-dashed border-primary/20"
                                style={{ animation: "spin-slow 8s linear infinite" }}
                            />
                            {/* Inner ring */}
                            <div
                                className="absolute inset-3 rounded-full border border-dashed border-white/[0.08]"
                                style={{ animation: "spin-slow 5s linear infinite reverse" }}
                            />
                            {/* Glow core */}
                            <div
                                className="absolute inset-6 rounded-full"
                                style={{
                                    background: "radial-gradient(circle, hsl(var(--primary) / .15) 0%, transparent 70%)",
                                    boxShadow: "0 0 30px hsl(var(--primary) / .2)",
                                }}
                            />
                            {/* Wrench icon */}
                            <Wrench
                                size={36}
                                className="relative z-10 text-primary/70"
                                style={{ animation: "float-wrench 3s ease-in-out infinite" }}
                            />
                        </div>

                        {/* Title block */}
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25">
                                <Construction size={10} className="text-amber-400" />
                                <span className="font-display text-[9px] font-black text-amber-400 uppercase tracking-[.3em]">
                                    Under Construction
                                </span>
                            </div>

                            <h1
                                className="font-display text-[32px] font-black text-white uppercase tracking-wide leading-none mt-1"
                                style={{ textShadow: "0 0 30px hsl(var(--primary) / .25)" }}
                            >
                                {sectorName}
                            </h1>
                            <p className="font-display text-[11px] font-bold text-white/25 uppercase tracking-[.2em]">
                                Sector offline
                            </p>
                        </div>
                    </div>

                    {/* Info card */}
                    <div
                        className={cn(
                            "w-full max-w-sm transition-all duration-700 delay-200",
                            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                    >
                        <div className="relative rounded-2xl border border-white/[0.07] bg-black/30 backdrop-blur-sm p-5 space-y-4">
                            <CornerBrackets />

                            {/* CPU icon + label */}
                            <div className="flex items-center gap-2">
                                <Cpu size={12} className="text-primary/50" />
                                <span className="font-display text-[9px] font-black text-white/25 uppercase tracking-[.25em]">
                                    System Status
                                </span>
                            </div>

                            <BuildProgress />
                            <SystemLog />
                        </div>
                    </div>

                </main>

                {/* ── FOOTER ──────────────────────────────────────────────────────── */}
                <footer
                    className={cn(
                        "shrink-0 px-4 pb-8 pt-3 transition-all duration-700 delay-400",
                        ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                >
                    <button
                        onClick={handleBack}
                        className="w-full py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] font-display text-[11px] font-black uppercase tracking-[.2em] text-white/40 flex items-center justify-center gap-2 hover:bg-white/[0.06] hover:text-white/70 transition-all active:scale-[.98]"
                    >
                        <ArrowLeft size={13} />
                        Return to Sector
                    </button>
                </footer>

            </EnergyBackground>
        </>
    );
}