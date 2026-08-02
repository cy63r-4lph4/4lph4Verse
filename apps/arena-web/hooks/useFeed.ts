"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";
import { getFeedSocket } from "@verse/arena-web/lib/feed/socket";
import { mapFeedResponse } from "@verse/arena-web/lib/feed/mapFeedResponse";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { getShowdownSocket } from "@verse/arena-web/lib/showdown/socket";

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
        // Course-wide duel activity — emitted to the whole feed room so every
        // fighter sees challenges/accepts/live-duel events without being a participant
        socket.on("duel:feed-activity", invalidate);

        return () => {
            socket.off("feed:new-post", invalidate);
            socket.off("feed:new-comment", invalidate);
            socket.off("feed:reaction", invalidate);
            socket.off("duel:feed-activity", invalidate);
        };
    }, [token, courseId, qc]);

    useEffect(() => {
        if (!token) return;
        const socket = getShowdownSocket(token);
        const invalidate = () => qc.invalidateQueries({ queryKey });
        // Personal events — only fires for the participant
        socket.on("duel:challenge-received", invalidate);
        socket.on("duel:challenge-sent", invalidate);
        socket.on("showdown:state", invalidate); // catches accept/decline transitions
        return () => {
            socket.off("duel:challenge-received", invalidate);
            socket.off("duel:challenge-sent", invalidate);
            socket.off("showdown:state", invalidate);
        };
    }, [token, qc]);

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
    const deletePost = useMutation({
        mutationFn: async (postId: string) => {
            await api.delete(`/v1/feed/${postId}`);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey }),
    });

    const editPost = useMutation({
        mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
            const { data } = await api.patch(`/v1/feed/${postId}`, { content });
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey }),
    });

    return { ...query, createPost, react, comment, deletePost, editPost };
}