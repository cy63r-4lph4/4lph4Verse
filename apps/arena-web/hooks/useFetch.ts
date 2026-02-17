import { useQuery } from '@tanstack/react-query';
import { api } from '@verse/arena-web/lib/api';

export default function useFetch<T>(route: string | null, queryKey?: string | readonly unknown[]) {
  return useQuery<T, Error>({
    queryKey: queryKey ? [queryKey] : [route],
    queryFn: async () => {
      if (!route) throw new Error("Route is required");
      const response = await api.get<T>(route);
      return response.data;
    },
    enabled: !!route,
    staleTime: 1000 * 60 * 5,
  });
}
