"use client";
import { useMemo } from "react";
import { useTournaments } from "@verse/arena-web/hooks/useTournaments";

const ACTIVE_STATUSES = ["seeding", "live"];

export function useActiveTournament(courseId: string) {
  const { data: tournaments = [] } = useTournaments(courseId);

  return useMemo(() => {
    const active = tournaments
      .filter((t: any) => ACTIVE_STATUSES.includes(t.status))
      .sort((a: any, b: any) => (a.status === "live" ? -1 : 1)); // prefer a truly-live match over one still seeding
    return active[0] ?? null;
  }, [tournaments]);
}