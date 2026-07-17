// app/course/[id]/console/page.tsx
"use client";

import { useParams } from "next/navigation";
import { ShieldCheck, ShieldAlert, Trophy, Library, Hammer } from "lucide-react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useForgePending } from "@verse/arena-web/hooks/useForgeSubmissions";
import { useTournaments } from "@verse/arena-web/hooks/useTournaments";
import { useQuestionBank } from "@verse/arena-web/hooks/useQuestionBank";
import { InstructorToolsPanel } from "@verse/arena-web/components/ui/InstructorToolsPanel";
import { TournamentRosterCard } from "@verse/arena-web/components/ui/tournament/TournamentRosterCard";

function MiniStat({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 text-center">
            <p className={`font-display text-[18px] font-black leading-none ${color}`}>{value}</p>
            <p className="font-display text-[8px] font-bold text-white/25 uppercase tracking-[.15em] mt-1">{label}</p>
        </div>
    );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 px-1 mb-2.5">
            <span className="shrink-0 text-white/40">{icon}</span>
            <span className="font-display text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">{label}</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
    );
}

export default function InstructorConsolePage() {
    const params = useParams<{ id: string }>();
    const { user, isLoading: authLoading } = useAuth();
    const canManage = !!user && (user.role === "instructor" || user.role === "admin");

    const { data: pendingForge = [] } = useForgePending(params.id, canManage);
    const { data: tournaments = [], isLoading: tourneyLoading } = useTournaments(params.id);
    const { data: questions = [] } = useQuestionBank(params.id, canManage);

    if (authLoading) {
        return (
            <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Verifying clearance…</p>
        );
    }

    if (!canManage) {
        return (
            <>
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-2xl border border-red-500/20 bg-red-500/[0.05] flex items-center justify-center"
                        style={{ boxShadow: "0 0 24px rgba(239,68,68,.08)" }}
                    >
                        <ShieldAlert size={24} className="text-red-400/50" />
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <p className="font-display text-[14px] font-black text-white/30 uppercase tracking-[.25em]">
                            Access Denied
                        </p>
                        <p className="font-display text-[9px] font-bold text-white/15 uppercase tracking-[.2em]">
                            Instructor clearance required
                        </p>
                    </div>
                </div>
            </>
        );
    }

    const liveTournamentCount = tournaments.filter((t: any) =>
        ["lobby", "seeding", "live"].includes(t.status),
    ).length;

    return (
        <div className="py-6 space-y-6">
            <div
                className="relative rounded-2xl border border-orange-500/20 overflow-hidden px-4 py-3 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, rgba(249,115,22,.08) 0%, rgba(0,0,0,.4) 100%)" }}
            >
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 via-orange-500 to-transparent rounded-l-2xl" />
                <div className="flex items-center gap-2.5 pl-2">
                    <ShieldCheck size={16} className="text-orange-400 shrink-0" style={{ filter: "drop-shadow(0 0 6px rgba(249,115,22,.7))" }} />
                    <div>
                        <p className="font-display text-[12px] font-black text-white uppercase tracking-[.2em] leading-none">
                            Instructor Console
                        </p>
                        <p className="font-display text-[8px] font-bold text-white/25 uppercase tracking-[.25em] mt-0.5">
                            Elevated access active
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" style={{ boxShadow: "0 0 6px rgba(249,115,22,.8)", animation: "pulse 1.5s ease-in-out infinite" }} />
                    <span className="font-display text-[8px] font-black text-orange-400/60 uppercase tracking-[.2em]">Live</span>
                </div>
            </div>

            <div className="flex gap-2">
                <MiniStat label="Bank Size" value={questions.length} color="text-primary" />
                <MiniStat label="Pending Forge" value={pendingForge.length} color="text-orange-400" />
                <MiniStat label="Live Tournaments" value={liveTournamentCount} color="text-red-400" />
            </div>

            <section>
                <SectionLabel icon={<Trophy size={12} />} label="Tournaments" />
                {tourneyLoading && (
                    <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-6">
                        Loading…
                    </p>
                )}
                {!tourneyLoading && tournaments.length === 0 && (
                    <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-6 border border-dashed border-white/10 rounded-2xl">
                        No tournaments yet — launch one below.
                    </p>
                )}
                <div className="space-y-2">
                    {tournaments.map((t: any) => (
                        <TournamentRosterCard key={t.id} tournament={t} courseId={params.id} />
                    ))}
                </div>
            </section>

            <section>
                <SectionLabel icon={<Hammer size={12} />} label="Tools" />
                <InstructorToolsPanel courseId={params.id} pendingForgeCount={pendingForge.length} />
            </section>
        </div>
    );
}