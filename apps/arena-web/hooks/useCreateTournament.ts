"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useCreateTournament(courseId: string) {
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      questionsPerMatch: number;
      timeLimitSeconds: number;
      scheduledAt?: string;
    }) => {
      const { data: showdown } = await api.post("/v1/showdown", { courseId, ...payload });
      const { data: opened } = await api.post(`/v1/showdown/${showdown.id}/lobby`);
      return opened;
    },
  });
}