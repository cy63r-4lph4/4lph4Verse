"use client";

import Link from "next/link";
import { Trophy, Users, Radio, CircleDot, Crown, ChevronRight } from "lucide-react";
import { cn } from "@verse/ui";

const STATUS_CFG: Record<string, { label: string; dot: string; text: string }> = {
    draft: { label: "Draft", dot: "bg-white/20", text: "text-white/40" },
    lobby: { label: "Lobby Open", dot: "bg-sky-400", text: "text-sky-400" },
    seeding: { label: "Seeding", dot: "bg-amber-400", text: "text-amber-400" },
    live: { label: "Live", dot: "bg-red-500", text: "text-red-400" },
    complete: { label: "Complete", dot: "bg-emerald-400", text: "text-emerald-400" },
};

interface TournamentRosterCardProps {
    tournament: {
        id: string;
        title: string;
        status: string;
        participantCount: number;
        currentRound: number;
        totalRounds: number | null;
        hasActiveMatch: boolean;
    };
    courseId: string;
}

export function TournamentRosterCard({ tournament, courseId }: TournamentRosterCardProps) {
    const cfg = STATUS_CFG[tournament.status] ?? STATUS_CFG.draft;
    const isLive = tournament.status === "live" || tournament.status === "lobby" || tournament.status === "seeding";

    return (
        <Link
            href={`/course/${courseId}/duels/tournament/${tournament.id}/remote`}
            className="group relative flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/35 p-4 hover:border-white/[0.14] hover:bg-white/[0.03] transition-all active:scale-[0.98]"
        >
            {tournament.hasActiveMatch && (
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-red-500/60 via-orange-400/30 to-transparent" />
            )}

            <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                {tournament.status === "complete" ? (
                    <Crown size={18} className="text-amber-400" />
                ) : (
                    <Trophy size={18} className="text-amber-400" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-[13px] font-black text-white uppercase tracking-wide truncate">
                        {tournament.title}
                    </p>
                    <span className={cn("flex items-center gap-1 shrink-0 font-display text-[8px] font-black uppercase tracking-wider", cfg.text)}>
                        <span className={cn("w-[5px] h-[5px] rounded-full", cfg.dot)} style={isLive ? { animation: "pulse 1.5s ease-in-out infinite" } : undefined} />
                        {cfg.label}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
                        <Users size={10} />
                        {tournament.participantCount} fighters
                    </span>
                    {tournament.currentRound > 0 && (
                        <span className="flex items-center gap-1 font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
                            <CircleDot size={10} />
                            Round {tournament.currentRound}{tournament.totalRounds ? `/${tournament.totalRounds}` : ""}
                        </span>
                    )}
                </div>
            </div>

            <ChevronRight size={16} className="shrink-0 text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
        </Link>
    );
}