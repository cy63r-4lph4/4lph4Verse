"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";
import { getFeedSocket } from "@verse/arena-web/lib/feed/socket";
import { mapFeedResponse } from "@verse/arena-web/lib/feed/mapFeedResponse";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";

export function useFeed(courseId: string) {
    const token = useArenaToken();
    const qc = useQueryClient();
    const queryKey = ["feed", courseId];

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const { data } = await api.get(`/v1/feed?courseId=${courseId}`);
            return mapFeedResponse(data);
        },
        enabled: !!courseId,
    });

    // Live updates: any push just invalidates and refetches. Simpler and
    // safer than hand-merging partial payloads into the cache at pilot scale.
    useEffect(() => {
        if (!token || !courseId) return;
        const socket = getFeedSocket(token);
        socket.emit("feed:join", { courseId });

        const invalidate = () => qc.invalidateQueries({ queryKey });
        socket.on("feed:new-post", invalidate);
        socket.on("feed:new-comment", invalidate);
        socket.on("feed:reaction", invalidate);

        return () => {
            socket.off("feed:new-post", invalidate);
            socket.off("feed:new-comment", invalidate);
            socket.off("feed:reaction", invalidate);
        };
    }, [token, courseId, qc]);

    const createPost = useMutation({
        mutationFn: async (payload: { type: string; content: string }) => {
            const { data } = await api.post("/v1/feed", { courseId, ...payload });
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey }),
    });

    const react = useMutation({
        mutationFn: async ({ postId, type }: { postId: string; type: string }) => {
            const { data } = await api.post(`/v1/feed/${postId}/react`, { type });
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey }),
    });

    const comment = useMutation({
        mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
            const { data } = await api.post(`/v1/feed/${postId}/comments`, { content });
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey }),
    });

    return { ...query, createPost, react, comment };
}