"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useTournaments(courseId: string) {
    return useQuery({
        queryKey: ["tournaments", courseId],
        queryFn: async () => (await api.get(`/v1/showdown/tournaments?courseId=${courseId}`)).data,
        enabled: !!courseId,
        refetchInterval: 15_000, // status changes live as an instructor runs it from another tab/device
    });
}