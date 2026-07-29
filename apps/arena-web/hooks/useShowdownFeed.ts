"use client";

import { useQuery } from "@tanstack/react-query";
import { FeedItemType } from "@verse/arena-web/components/ui/FeedCard";
import { api } from "@verse/arena-web/lib/api";

export function useShowdownFeed(courseId: string) {
  return useQuery({
    queryKey: ["showdown-feed", courseId],
    queryFn: async () => {
      const { data } = await api.get(`/v1/showdown/feed?courseId=${courseId}`);

      const battleItems: FeedItemType[] = data.battles.map((b: any) => ({
        id: b.id,
        type: "battle",
        time: relativeTime(b.time),
        winner: { name: b.winner.name, avatar: dicebearUrl(b.winner.name), score: b.winner.score },
        loser: { name: b.loser.name, avatar: dicebearUrl(b.loser.name), score: b.loser.score },
        quizName: b.quizName,
      }));

      const challengeItems: FeedItemType[] = data.challenges.map((c: any) => ({
        id: c.id,
        type: "challenge",
        time: relativeTime(c.time),
        challenger: { name: "Someone", avatar: dicebearUrl("?") }, // backend can be extended to include fromUsername
        expiresIn: "—",
        isForYou: true,
        _showdownId: c.showdownId, // used by the accept/decline handler below
      }));

      return [...challengeItems, ...battleItems];
    },
    enabled: !!courseId,
    refetchInterval: 30_000, // simple polling; swap for a socket push later if needed
  });
}

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "NOW";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}