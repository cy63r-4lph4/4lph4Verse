import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@verse/arena-web/lib/api';
import useFetch from "@verse/arena-web/hooks/useFetch";

export interface SectorData {
    id: string;
    title: string;
    code: string;
    universityId: string;
    fighters?: number;
    intelAssets?: number;
    integrity?: number;
}

export function useSectors(universityId?: string) {
    const queryClient = useQueryClient();
    const queryKey = ['sectors', universityId];

    // 1. DUAL-PURPOSE FETCH LOGIC
    // We only fetch if universityId is present. 
    // If universityId is missing, we pass 'null' to skip the request and avoid 404s.
    const { data, isLoading, error } = useFetch<SectorData[]>(
        universityId ? `/v1/arena/su/institution/${universityId}/sectors` : null,
        queryKey
    );

    // 2. INITIALIZE SECTOR (The POST logic)
    const createSector = useMutation({
    mutationFn: async (newSector: { name: string; code: string }) => {
        const response = await api.post<SectorData>(
            `/v1/arena/su/course`,
            {
                title: newSector.name, 
                code: newSector.code,
                schoolId: universityId,
            }
        );
        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
    },
});

    // 3. PURGE SECTOR
    const deleteSector = useMutation({
        mutationFn: async (sectorId: string) => {
            // Target the SU course deletion endpoint
            await api.delete(`/v1/arena/su/course/${sectorId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        sectors: data || [],
        // Ensure loading state is only true if we actually have an ID to fetch for
        isLoading: !!universityId && isLoading,
        error,
        createSector: createSector.mutateAsync,
        isCreating: createSector.isPending,
        deleteSector: deleteSector.mutateAsync,
        isDeleting: deleteSector.isPending,
    };
}