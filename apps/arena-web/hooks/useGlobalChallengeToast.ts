"use client";

import { useEffect, useState, useCallback } from "react";
import { getShowdownSocket } from "@verse/arena-web/lib/showdown/socket";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";

export interface ChallengeToastPayload {
    showdownId: string;
    fromArenaUserId: string;
    fromUsername: string;
}

export function useGlobalChallengeToast() {
    const token = useArenaToken();
    const [toast, setToast] = useState<ChallengeToastPayload | null>(null);

    useEffect(() => {
        if (!token) return;
        const socket = getShowdownSocket(token);
        const onChallenge = (payload: ChallengeToastPayload) => setToast(payload);
        socket.on("duel:challenge-received", onChallenge);
        return () => { socket.off("duel:challenge-received", onChallenge); };
    }, [token]);

    const dismiss = useCallback(() => setToast(null), []);

    return { toast, dismiss };
}