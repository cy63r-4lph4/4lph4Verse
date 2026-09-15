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

export interface ResourceProgress {
  id: string;
  arenaUserId: string;
  resourceId: string;
  progress: number;
  isCompleted: boolean;
}

export function useResourceProgress(courseId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["resource-progress", courseId],
    queryFn: async () => {
      const res = await api.get(`/arena/courses/${courseId}/resources/progress`);
      return res.data as ResourceProgress[];
    },
    enabled: !!courseId,
  });

  const updateProgress = useMutation({
    mutationFn: async ({ resourceId, progress }: { resourceId: string; progress: number }) => {
      const res = await api.patch(`/arena/courses/${courseId}/resources/${resourceId}/progress`, { progress });
      return res.data;
    },
    onMutate: async ({ resourceId, progress }) => {
      await queryClient.cancelQueries({ queryKey: ["resource-progress", courseId] });
      const previous = queryClient.getQueryData<ResourceProgress[]>(["resource-progress", courseId]);
      
      queryClient.setQueryData<ResourceProgress[]>(["resource-progress", courseId], old => {
        if (!old) return [];
        const exists = old.find(p => p.resourceId === resourceId);
        if (exists) {
          return old.map(p => p.resourceId === resourceId ? { ...p, progress, isCompleted: progress >= 100 } : p);
        }
        return [...old, { id: "temp", arenaUserId: "temp", resourceId, progress, isCompleted: progress >= 100 }];
      });
      return { previous };
    },
    onError: (err, newTodo, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["resource-progress", courseId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-progress", courseId] });
    },
  });

  return { ...query, updateProgress };
}
