"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function usePlatformStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get("/v1/arena/su/stats")).data as {
      schoolCount: number; courseCount: number; userCount: number; questionCount: number;
    },
  });
}