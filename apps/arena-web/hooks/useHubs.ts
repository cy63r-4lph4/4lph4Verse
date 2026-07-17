"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useHubs() {
  const qc = useQueryClient();

  const { data: hubs = [], isLoading } = useQuery({
    queryKey: ["admin-hubs"],
    queryFn: async () => (await api.get("/v1/arena/su/institutions")).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; slug: string }) =>
      (await api.post("/v1/arena/su/institution", payload)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-hubs"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/v1/arena/su/institution/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-hubs"] }),
  });

  return {
    hubs,
    isLoading,
    createHub: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteHub: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}