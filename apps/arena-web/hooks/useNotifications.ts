"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@verse/arena-web/lib/api";
import { getShowdownSocket } from "@verse/arena-web/lib/showdown/socket";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useForgePending } from "@verse/arena-web/hooks/useForgeSubmissions";

export function useNotifications(courseId: string) {
  const token = useArenaToken();
  const { user } = useAuth();
  const qc = useQueryClient();
  const canReview = !!user && (user.role === "instructor" || user.role === "admin");

  const incomingKey = ["notif-incoming"];
  const outgoingKey = ["notif-outgoing"];

  const { data: incoming = [], isLoading: incomingLoading } = useQuery({
    queryKey: incomingKey,
    queryFn: async () => (await api.get("/v1/showdown/duel/pending")).data,
    enabled: !!token,
  });

  const { data: outgoing = [], isLoading: outgoingLoading } = useQuery({
    queryKey: outgoingKey,
    queryFn: async () => (await api.get("/v1/showdown/duel/sent")).data,
    enabled: !!token,
  });

  const { data: pendingForge = [] } = useForgePending(courseId, canReview);

  useEffect(() => {
    if (!token) return;
    const socket = getShowdownSocket(token);
    const invalidate = () => {
      qc.invalidateQueries({ queryKey: incomingKey });
      qc.invalidateQueries({ queryKey: outgoingKey });
    };
    socket.on("duel:challenge-received", invalidate);
    socket.on("showdown:state", invalidate); // catches accept/decline transitions
    return () => {
      socket.off("duel:challenge-received", invalidate);
      socket.off("showdown:state", invalidate);
    };
  }, [token, qc]);

  const accept = useMutation({
    mutationFn: async (showdownId: string) => {
      const socket = getShowdownSocket(token!);
      socket.emit("duel:accept", { showdownId });
    },
  });

  const decline = useMutation({
    mutationFn: async (showdownId: string) => {
      const socket = getShowdownSocket(token!);
      socket.emit("duel:decline", { showdownId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: incomingKey }),
  });

  const unreadCount = incoming.length + (canReview ? pendingForge.length : 0);

  return {
    incoming,
    outgoing,
    pendingForge,
    canReview,
    isLoading: incomingLoading || outgoingLoading,
    accept: accept.mutate,
    decline: decline.mutate,
    unreadCount,
  };
}