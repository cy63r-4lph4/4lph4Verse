"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useInstructors(schoolId?: string) {
  const qc = useQueryClient();
  const key = ["admin-instructors", schoolId ?? "all"];

  const { data: instructors = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () =>
      (await api.get(`/v1/arena/su/instructors${schoolId ? `?schoolId=${schoolId}` : ""}`)).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { username: string; password: string; email?: string; schoolId: string }) =>
      (await api.post("/v1/arena/su/instructor", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    instructors,
    isLoading,
    createInstructor: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    error: createMutation.error as any,
  };
}