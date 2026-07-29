"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getFeedSocket } from "@verse/arena-web/lib/feed/socket";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";

/** No local state — purely nudges the tournaments query to refetch the
 * instant a bracket goes live, so `useActiveTournament` (the single source
 * of truth) picks it up immediately instead of waiting for the next
 * scheduled poll. Nothing here can go stale because nothing is stored. */
export function useLiveTournamentPush(courseId: string) {
  const token = useArenaToken();
  const qc = useQueryClient();

  useEffect(() => {
    if (!token || !courseId) return;
    const socket = getFeedSocket(token);
    const onLive = () => qc.invalidateQueries({ queryKey: ["tournaments", courseId] });
    socket.on("tournament:live", onLive);
    return () => { socket.off("tournament:live", onLive); };
  }, [token, courseId, qc]);
}