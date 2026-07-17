"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useCreateDuelChallenge(courseId: string) {
    return useMutation({
        mutationFn: async (opponentArenaUserId: string) =>
            (await api.post("/v1/showdown/duel/challenge", { courseId, opponentArenaUserId })).data,
    });
}