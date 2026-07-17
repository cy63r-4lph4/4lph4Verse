"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@verse/arena-web/lib/api";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { getShowdownSocket } from "@verse/arena-web/lib/showdown/socket";


export type IncomingChallenge = {
  showdownId: string;
  fromArenaUserId: string;
  fromUsername: string;
};

export type PendingDuel = {
  id: string;
  courseId: string;
  createdBy: string;
  title: string;
  status: string;
  questionsPerMatch: number;
  timeLimitSeconds: number;
};

export function useDuelChallenges() {
  const token = useArenaToken();
  const [live, setLive] = useState<IncomingChallenge | null>(null);
  const [pending, setPending] = useState<PendingDuel[]>([]);

  const refreshPending = useCallback(async () => {
    if (!token) return;
    const { data } = await api.get<PendingDuel[]>("/v1/showdown/duel/pending");
    setPending(data);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    refreshPending();

    const socket = getShowdownSocket(token);

    const onChallenge = (payload: IncomingChallenge) => {
      setLive(payload);
      refreshPending(); // keep the durable list in sync too
    };

    socket.on("duel:challenge-received", onChallenge);
    return () => {
      socket.off("duel:challenge-received", onChallenge);
    };
  }, [token, refreshPending]);

  const dismissLive = useCallback(() => setLive(null), []);

  return { liveChallenge: live, dismissLive, pendingDuels: pending, refreshPending };
}