import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@verse/arena-web/lib/api';
import useFetch from "@verse/arena-web/hooks/useFetch";
import { SchoolData } from "@verse/arena-web/types/arena";

export function useHubs() {
    const queryClient = useQueryClient();
    const queryKey = ['universities'];

    const { data, isLoading, error } = useFetch<SchoolData[]>(
        '/v1/gateway/universities',
        queryKey
    );
    const createMutation = useMutation({
        mutationFn: async (newHub: { name: string; slug: string }) => {
            const response = await api.post<SchoolData>('/v1/su/institution', newHub);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (hubId: string) => {
            await api.delete(`/v1/su/institution/${hubId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        hubs: data || [],
        isLoading,
        error,
        createHub: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        deleteHub: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}