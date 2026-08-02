"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useCourseAccessKey(courseId: string) {
  return useQuery({
    queryKey: ["course-access-key", courseId],
    queryFn: async () => (await api.get(`/v1/arena/courses/${courseId}`)).data as {
      id: string; title: string; code: string; accessKey: string; schoolId: string;
    },
    enabled: !!courseId,
  });
}