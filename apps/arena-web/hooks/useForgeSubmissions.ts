"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useForgeMine(courseId: string) {
  return useQuery({
    queryKey: ["forge-mine", courseId],
    queryFn: async () => (await api.get(`/v1/forge/mine?courseId=${courseId}`)).data,
    enabled: !!courseId,
  });
}

export function useForgeSubmit(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      prompt: string; options: string[]; correctIndex: number;
      difficulty?: string; category?: string;
    }) => (await api.post("/v1/forge", { courseId, ...payload })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forge-mine", courseId] }),
  });
}

export function useForgePending(courseId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["forge-pending", courseId],
    queryFn: async () => (await api.get(`/v1/forge/pending?courseId=${courseId}`)).data,
    enabled: !!courseId && enabled,
  });
}

export function useForgeReview(courseId: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["forge-pending", courseId] });
  return {
    approve: useMutation({
      mutationFn: async ({ id, note }: { id: string; note?: string }) =>
        (await api.post(`/v1/forge/${id}/approve`, { note })).data,
      onSuccess: invalidate,
    }),
    reject: useMutation({
      mutationFn: async ({ id, note }: { id: string; note?: string }) =>
        (await api.post(`/v1/forge/${id}/reject`, { note })).data,
      onSuccess: invalidate,
    }),
  };
}