"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useSectors(schoolId: string) {
  const qc = useQueryClient();
  const key = ["admin-sectors", schoolId];

  const { data: sectors = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => (await api.get(`/v1/arena/su/institution/${schoolId}/sectors`)).data,
    enabled: !!schoolId,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; code: string }) =>
      (await api.post("/v1/arena/su/course", { title: payload.name, code: payload.code, schoolId })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/v1/arena/su/course/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    sectors,
    isLoading,
    createSector: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteSector: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}