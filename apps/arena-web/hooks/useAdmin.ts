"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";

export function useInstitutions() {
    return useQuery({
        queryKey: ["admin-institutions"],
        queryFn: async () => (await api.get("/v1/arena/su/institutions")).data,
    });
}

export function useCreateInstitution() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { name: string; slug: string }) =>
            (await api.post("/v1/arena/su/institution", payload)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-institutions"] }),
    });
}

export function useCourses(schoolId: string) {
    return useQuery({
        queryKey: ["admin-courses", schoolId],
        queryFn: async () => (await api.get(`/v1/arena/su/institution/${schoolId}/sectors`)).data,
        enabled: !!schoolId,
    });
}

export function useCreateCourse() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { title: string; code: string; schoolId: string }) =>
            (await api.post("/v1/arena/su/course", payload)).data,
        onSuccess: (_data, variables) =>
            qc.invalidateQueries({ queryKey: ["admin-courses", variables.schoolId] }),
    });
}

export function useInstructors(schoolId?: string) {
    return useQuery({
        queryKey: ["admin-instructors", schoolId],
        queryFn: async () =>
            (await api.get(`/v1/arena/su/instructors${schoolId ? `?schoolId=${schoolId}` : ""}`)).data,
    });
}

export function useCreateInstructor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { username: string; password: string; email?: string; schoolId: string }) =>
            (await api.post("/v1/arena/su/instructor", payload)).data,
        onSuccess: (_data, variables) =>
            qc.invalidateQueries({ queryKey: ["admin-instructors", variables.schoolId] }),
    });
}

export function usePlatformStats() {
    return useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => (await api.get("/v1/arena/su/stats")).data,
    });
}