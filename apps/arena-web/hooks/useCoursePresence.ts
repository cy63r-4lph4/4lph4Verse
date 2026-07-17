"use client";

import { useEffect, useState } from "react";
import { getFeedSocket } from "@verse/arena-web/lib/feed/socket";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";

export interface PresenceEntry {
  arenaUserId: string;
  username: string;
  status: "online" | "recent";
}

export function useCoursePresence(courseId: string) {
  const token = useArenaToken();
  const [presence, setPresence] = useState<PresenceEntry[]>([]);

  useEffect(() => {
    if (!token || !courseId) return;
    const socket = getFeedSocket(token);
    socket.emit("feed:join", { courseId });

    const onPresence = (list: PresenceEntry[]) => setPresence(list);
    socket.on("feed:presence", onPresence);
    return () => { socket.off("feed:presence", onPresence); };
  }, [token, courseId]);

  return presence;
}