"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { ArrowLeft, Home, Radar, RadioTower, TriangleAlert } from "lucide-react";

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
                    background: "linear-gradient(90deg, transparent 0%, rgba(239,68,68,.55) 50%, transparent 100%)",
                    animation: "scan-beam 3.4s ease-in-out infinite",
                    boxShadow: "0 0 16px rgba(239,68,68,.4)",
                }}
            />
        </div>
    );
}

// ─── Radar sweep — searching for a signal that isn't there ──────────────────

function RadarSweep() {
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="absolute rounded-full border border-red-500/20"
                    style={{
                        inset: `${i * 16}px`,
                        animation: `radar-pulse 2.4s ease-out ${i * 0.5}s infinite`,
                    }}
                />
            ))}

            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: "conic-gradient(from 0deg, transparent 0%, rgba(239,68,68,.25) 12%, transparent 24%)",
                    animation: "spin-slow 3s linear infinite",
                }}
            />

            <div
                className="absolute inset-8 rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(239,68,68,.12) 0%, transparent 70%)",
                }}
            />

            <Radar size={36} className="relative z-10 text-red-400/70" />
        </div>
    );
}

// ─── Blinking log lines — a search that comes up empty ───────────────────────

const LOG_LINES = [
    "Scanning sector coordinates…",
    "Cross-referencing route table…",
    "Pinging last known location…",
    "No response from target…",
    "Signal lost.",
];

function SystemLog() {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let i = 0;
        const addLine = () => {
            if (i >= LOG_LINES.length) return;
            setLines((prev) => [...prev.slice(-4), `> ${LOG_LINES[i++]}`]);
            if (i < LOG_LINES.length) setTimeout(addLine, 700 + Math.random() * 400);
        };
        const t = setTimeout(addLine, 400);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="w-full rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3 space-y-1 font-display min-h-[104px]">
            {lines.map((line, i) => (
                <p
                    key={i}
                    className={cn(
                        "text-[9px] uppercase tracking-wider leading-relaxed transition-opacity duration-300",
                        i === lines.length - 1 ? "text-red-400/80" : "text-white/20",
                    )}
                >
                    {line}
                    {i === lines.length - 1 && (
                        <span className="inline-block w-[6px] h-[10px] bg-red-400/60 ml-1 align-middle animate-pulse" />
                    )}
                </p>
            ))}
        </div>
    );
}

// ─── Corner brackets ──────────────────────────────────────────────────────────

function CornerBrackets() {
    const cls = "absolute w-5 h-5 border-white/[0.12]";
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

export default function NotFound() {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <style>{`
        @keyframes scan-beam {
          0%   { top: -2px;   opacity: 0; }
          10%  { opacity: 1;              }
          90%  { opacity: 1;              }
          100% { top: 100%;   opacity: 0; }
        }
        @keyframes radar-pulse {
          0%   { opacity: .5; transform: scale(0.85); }
          80%  { opacity: 0;  transform: scale(1.15); }
          100% { opacity: 0;  transform: scale(1.15); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes glitch-shift {
          0%, 94%, 100% { transform: translate(0, 0); opacity: 1; }
          95%           { transform: translate(-2px, 1px); opacity: .85; }
          96%           { transform: translate(2px, -1px); opacity: .9; }
          97%           { transform: translate(-1px, 0); opacity: 1; }
        }
      `}</style>

            <EnergyBackground className="flex flex-col h-dvh" variant="battle">
                <GridOverlay />
                <ScanBeam />

                {/* ── HEADER ──────────────────────────────────────────────────────── */}
                <header className="shrink-0 h-14 px-4 flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all active:scale-90"
                    >
                        <ArrowLeft size={15} />
                    </button>
                    <div className="flex items-center gap-2">
                        <RadioTower size={11} className="text-red-400/60 animate-pulse" />
                        <span className="font-display text-[10px] font-black text-white/25 uppercase tracking-[.3em]">
                            404
                        </span>
                    </div>
                </header>

                {/* ── MAIN ────────────────────────────────────────────────────────── */}
                <main className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 gap-8 relative z-10">
                    <div
                        className={cn(
                            "flex flex-col items-center gap-5 transition-all duration-700",
                            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                        )}
                    >
                        <RadarSweep />

                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25">
                                <TriangleAlert size={10} className="text-red-400" />
                                <span className="font-display text-[9px] font-black text-red-400 uppercase tracking-[.3em]">
                                    Target Not Found
                                </span>
                            </div>

                            <h1
                                className="font-display text-[64px] font-black text-white uppercase tracking-wide leading-none mt-2"
                                style={{
                                    textShadow: "0 0 40px rgba(239,68,68,.3)",
                                    animation: "glitch-shift 4s infinite",
                                }}
                            >
                                404
                            </h1>
                            <p className="font-display text-[11px] font-bold text-white/25 uppercase tracking-[.2em] mt-1">
                                This sector doesn't exist in the arena
                            </p>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "w-full max-w-sm transition-all duration-700 delay-200",
                            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                        )}
                    >
                        <div className="relative rounded-2xl border border-white/[0.07] bg-black/30 backdrop-blur-sm p-5 space-y-4">
                            <CornerBrackets />

                            <div className="flex items-center gap-2">
                                <RadioTower size={12} className="text-red-400/60" />
                                <span className="font-display text-[9px] font-black text-white/25 uppercase tracking-[.25em]">
                                    Trace Log
                                </span>
                            </div>

                            <SystemLog />
                        </div>
                    </div>
                </main>

                {/* ── FOOTER ──────────────────────────────────────────────────────── */}
                <footer
                    className={cn(
                        "shrink-0 px-4 pb-8 pt-3 transition-all duration-700 delay-400 relative z-10",
                        ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                    )}
                >
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] font-display text-[11px] font-black uppercase tracking-[.2em] text-white/40 flex items-center justify-center gap-2 hover:bg-white/[0.06] hover:text-white/70 transition-all active:scale-[.98]"
                    >
                        <Home size={13} />
                        Return to Base
                    </button>
                </footer>
            </EnergyBackground>
        </>
    );
}