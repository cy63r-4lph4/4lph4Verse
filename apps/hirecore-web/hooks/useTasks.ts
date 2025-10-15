"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 6;

type TaskFilter = {
  category?: string;
  location?: string;
  urgency?: string;
  minBudget?: number;
};

export function useTasks(chainId: number, filters?: TaskFilter) {
  const isFiltered =
    filters &&
    (filters.category !== "all" ||
      filters.location !== "all" ||
      filters.urgency !== "all" ||
      (filters.minBudget ?? 0) > 0);

  const fetchTasks = async ({ pageParam = 1 }) => {
    const params = new URLSearchParams({
      chainId: String(chainId),
      page: String(pageParam),
      limit: String(PAGE_SIZE),
    });

    if (filters?.category) params.append("category", filters.category);
    if (filters?.location) params.append("location", filters.location);
    if (filters?.urgency) params.append("urgency", filters.urgency);
    if (filters?.minBudget) params.append("minBudget", String(filters.minBudget));

    const res = await fetch(`/api/tasks?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  };

  // Infinite scroll mode (no filters)
  const infinite = useInfiniteQuery({
    queryKey: ["tasks", chainId, filters],
    queryFn: fetchTasks,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.page ?? 1) + 1 : undefined,
    enabled: !isFiltered,
    initialPageParam: 1,
  });

  // Paginated mode (with filters)
  const paginated = useQuery({
    queryKey: ["tasksFiltered", chainId, filters],
    queryFn: () => fetchTasks({ pageParam: 1 }),
    enabled: isFiltered,
  });

  return {
    data: isFiltered ? paginated.data?.data ?? [] : infinite.data?.pages.flatMap((p) => p.data) ?? [],
    total: isFiltered ? paginated.data?.total ?? 0 : undefined,
    isLoading: isFiltered ? paginated.isLoading : infinite.isLoading,
    hasMore: infinite.hasNextPage,
    fetchNextPage: infinite.fetchNextPage,
    refetch: isFiltered ? paginated.refetch : infinite.refetch,
  };
}
