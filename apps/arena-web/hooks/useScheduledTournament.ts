"use client";
import { useMemo } from "react";
import { useTournaments } from "@verse/arena-web/hooks/useTournaments";

export function useScheduledTournament(courseId: string) {
    const { data: tournaments = [] } = useTournaments(courseId);

    return useMemo(() => {

        const candidates = tournaments
            .filter((t: any) => t.scheduledAt && ["draft", "lobby"].includes(t.status))
            .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

        if (candidates.length === 0) return null;
        const next = candidates[0];
        return { ...next, isOverdue: new Date(next.scheduledAt).getTime() < Date.now() };
    }, [tournaments]);
}