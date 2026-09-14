import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface ArenaResource {
  id: string;
  courseId: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
}

export function useResources(courseId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["resources", courseId],
    queryFn: async () => {
      const res = await api.get(`/arena/courses/${courseId}/resources`);
      return res.data as ArenaResource[];
    },
    enabled: !!courseId,
  });

  const create = useMutation({
    mutationFn: async (data: { title: string; content: string; isPublished: boolean }) => {
      const res = await api.post(`/arena/courses/${courseId}/resources`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources", courseId] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ title: string; content: string; isPublished: boolean }> }) => {
      const res = await api.patch(`/arena/courses/${courseId}/resources/${id}`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources", courseId] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/arena/courses/${courseId}/resources/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources", courseId] }),
  });

  return { ...query, create, update, remove };
}
