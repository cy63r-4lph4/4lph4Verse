"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { getShowdownSocket } from "./socket";
import type { ShowdownFullState } from "./types";

type ShowdownError = { message: string };

export function useShowdownState(showdownId: string, token: string | null) {
  const [state, setState] = useState<ShowdownFullState | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = getShowdownSocket(token);
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      setError(null);
      socket.emit("showdown:join", { showdownId });
    };
    const onDisconnect = () => setConnected(false);
    const onState = (payload: ShowdownFullState) => setState(payload);
    const onError = (payload: ShowdownError) => setError(payload.message);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("showdown:state", onState);
    socket.on("showdown:error", onError);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("showdown:state", onState);
      socket.off("showdown:error", onError);
    };
  }, [showdownId, token]);

  const emit = useCallback((event: string, payload: Record<string, unknown>) => {
    socketRef.current?.emit(event, { showdownId, ...payload });
  }, [showdownId]);

  return { state, connected, error, emit, socket: socketRef.current };
}