import { useQuery } from '@tanstack/react-query';
import { api } from '@verse/arena-web/lib/api';

export default function useFetch<T>(route: string, queryKey?: string | readonly unknown[]) {
  return useQuery<T, Error>({
    queryKey: queryKey ? [queryKey] : [route],
    queryFn: async () => {
      const response = await api.get<T>(route);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, 
  });
}
