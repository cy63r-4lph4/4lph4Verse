import type { FeedItemType } from "@verse/arena-web/components/ui/FeedCard";

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

/** Raw items come back from GET /v1/feed with a `kind` discriminator that
 * doesn't 1:1 match FeedCard's `type` union — this maps between them.
 * Extra `_`-prefixed fields ride along for our own handlers (accept/decline,
 * react, comment) — FeedCard never reads them, so they're cast via
 * `unknown` rather than fighting TS's excess-property check. */
export function mapFeedResponse(raw: any[]): FeedItemType[] {
  return raw.map((item): FeedItemType => {
    if (item.kind === "battle") {
      return {
        id: item.id,
        type: "battle",
        time: relativeTime(item.createdAt),
        winner: { name: item.winner.name, avatar: dicebearUrl(item.winner.name), score: item.winner.score },
        loser: { name: item.loser.name, avatar: dicebearUrl(item.loser.name), score: item.loser.score },
        quizName: item.quizName,
      } as unknown as FeedItemType;
    }

    if (item.kind === "challenge") {
      return {
        id: item.id,
        type: "challenge",
        time: relativeTime(item.createdAt),
        challenger: { name: item.fromUsername ?? "Someone", avatar: dicebearUrl(item.fromUsername ?? "?") },
        expiresIn: "—",
        isForYou: true,
        _showdownId: item.showdownId,
      } as unknown as FeedItemType;
    }

    if (item.kind === "live_duel") {
      return {
        id: item.id,
        type: "live_duel",
        time: relativeTime(item.createdAt),
        opponent: { name: item.opponentName, avatar: dicebearUrl(item.opponentName) },
        mode: item.mode,
        _showdownId: item.showdownId,
      } as unknown as FeedItemType;
    }

    if (item.kind === "activity") {
      return {
        id: item.id,
        type: "activity",
        time: relativeTime(item.createdAt),
        event: item.event as "challenged" | "live",
        challenger: { name: item.challengerName, avatar: dicebearUrl(item.challengerName) },
        opponent:   { name: item.opponentName,   avatar: dicebearUrl(item.opponentName) },
        mode: item.mode as "duel" | "async_duel",
        _showdownId: item.showdownId,
      } as unknown as FeedItemType;
    }

    // kind === "post"
    const base = {
      id: item.id,
      type: item.postType === "announcement" ? "announcement" : "post",
      time: relativeTime(item.createdAt),
      reactions: item.reactionCounts,
      comments: item.comments.map((c: any) => ({
        id: c.id,
        user: c.author,
        avatar: dicebearUrl(c.author),
        text: c.content,
        time: relativeTime(c.createdAt),
      })),
      _postId: item.id,
      _viewerReactions: item.viewerReactions,
      _authorArenaUserId: item.author?.arenaUserId,
      ...(item.postType === "announcement"
        ? {
          instructor: { name: item.author.name, avatar: dicebearUrl(item.author.name) },
          title: item.content.slice(0, 60),
          content: item.content,
          pinned: item.pinned,
        }
        : {
          author: { name: item.author.name, avatar: dicebearUrl(item.author.name) },
          postType: item.postType,
          content: item.content,
        }),
    };

    return base as unknown as FeedItemType;
  });
}