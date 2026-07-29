"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useDeleteTournament() {
  return useMutation({
    mutationFn: async (showdownId: string) => (await api.delete(`/v1/showdown/${showdownId}`)).data,
  });
}