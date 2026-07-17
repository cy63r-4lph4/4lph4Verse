"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  difficulty: "easy" | "medium" | "hard";
  category?: string | null;
}

export function useQuestionBank(courseId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["question-bank", courseId],
    queryFn: async (): Promise<Question[]> => (await api.get(`/v1/questions?courseId=${courseId}`)).data,
    enabled: !!courseId && enabled,
  });
}

export function useCreateQuestion(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      prompt: string; options: string[]; correctIndex: number;
      difficulty?: string; category?: string;
    }) => (await api.post("/v1/questions", { courseId, ...payload })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["question-bank", courseId] }),
  });
}

export function useDeleteQuestion(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/v1/questions/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["question-bank", courseId] }),
  });
}

export function useUpdateQuestion(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; prompt: string; options: string[]; correctIndex: number; difficulty: string; category: string }) =>
      (await api.patch(`/v1/questions/${id}`, payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["question-bank", courseId] }),
  });
}

export function useImportQuestionsCsv(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("courseId", courseId);
      form.append("file", file);
      const { data } = await api.post("/v1/questions/csv", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as { insertedCount: number; errorCount: number; errors: { row: number; message: string }[] };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["question-bank", courseId] }),
  });
}