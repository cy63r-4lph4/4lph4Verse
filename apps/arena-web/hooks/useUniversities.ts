import useFetch from "@verse/arena-web/hooks/useFetch";
import { ArenaSchool } from "@verse/arena-web/types/arena";

export default function useUniversities() {
  const { data, isLoading, error } = useFetch<ArenaSchool[]>(
    '/v1/gateway/universities', 
    'universities'
  );
  return { 
    sectors: data || [], 
    isLoading, 
    error 
  };
}