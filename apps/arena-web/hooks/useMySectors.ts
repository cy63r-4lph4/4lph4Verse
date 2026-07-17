"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useMySectors() {
  return useQuery({
    queryKey: ["my-sectors"],
    queryFn: async () => (await api.get("/v1/gateway/my-sectors")).data,
  });
}