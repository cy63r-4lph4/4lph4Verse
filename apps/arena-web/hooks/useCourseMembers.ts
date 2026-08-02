"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useCourseMembers(courseId: string) {
  return useQuery({
    queryKey: ["course-members", courseId],
    queryFn: async () => (await api.get(`/v1/arena/courses/${courseId}/members`)).data as {
      arenaUserId: string;
      username: string;
      role: string;
      joinedAt: string;
    }[],
    enabled: !!courseId,
  });
}