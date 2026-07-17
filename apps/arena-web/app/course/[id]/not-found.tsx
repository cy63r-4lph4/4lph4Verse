// app/course/[id]/not-found.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { ArrowLeft, Home, Radar, RadioTower, TriangleAlert } from "lucide-react";

function useCourseIdFromPath(): string | null {
    const pathname = usePathname();
    const match = pathname?.match(/^\/course\/([^/]+)/);
    return match ? match[1] : null;
}

function RadarSweep() {
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
                <div key={i} className="absolute rounded-full border border-red-500/20" style={{ inset: `${i * 16}px`, animation: `radar-pulse 2.4s ease-out ${i * 0.5}s infinite` }} />
            ))}
            <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, transparent 0%, rgba(239,68,68,.25) 12%, transparent 24%)", animation: "spin-slow 3s linear infinite" }} />
            <Radar size={36} className="relative z-10 text-red-400/70" />
        </div>
    );
}

export default function CourseNotFound() {
    const router = useRouter();
    const courseId = useCourseIdFromPath();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <style>{`
        @keyframes radar-pulse { 0% { opacity: .5; transform: scale(0.85); } 80% { opacity: 0; transform: scale(1.15); } 100% { opacity: 0; transform: scale(1.15); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

            <EnergyBackground className="flex flex-col h-dvh items-center justify-center px-6 gap-8" variant="battle">
                <div className={cn("flex flex-col items-center gap-5 transition-all duration-700", ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
                    <RadarSweep />
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25">
                            <TriangleAlert size={10} className="text-red-400" />
                            <span className="font-display text-[9px] font-black text-red-400 uppercase tracking-[.3em]">Sector Unreachable</span>
                        </div>
                        <h1 className="font-display text-[40px] font-black text-white uppercase tracking-wide leading-none mt-2" style={{ textShadow: "0 0 32px rgba(239,68,68,.3)" }}>
                            404
                        </h1>
                        <p className="font-display text-[11px] font-bold text-white/25 uppercase tracking-[.2em] mt-1">
                            This resource doesn't exist in this sector
                        </p>
                    </div>
                </div>

                <div className={cn("flex flex-col w-full max-w-sm gap-2.5 transition-all duration-700 delay-200", ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                    {courseId && (
                        <button
                            onClick={() => router.push(`/course/${courseId}`)}
                            className="w-full py-3.5 rounded-2xl bg-primary/90 font-display text-[11px] font-black uppercase tracking-[.2em] text-black flex items-center justify-center gap-2 active:scale-[.98] transition-all"
                        >
                            <RadioTower size={13} />
                            Return to Sector
                        </button>
                    )}
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] font-display text-[11px] font-black uppercase tracking-[.2em] text-white/40 flex items-center justify-center gap-2 hover:bg-white/[0.06] hover:text-white/70 transition-all active:scale-[.98]"
                    >
                        <Home size={13} />
                        Return to Base
                    </button>
                </div>
            </EnergyBackground>
        </>
    );
}