"use client";

import { useRouter } from "next/navigation";
import { IncomingChallengeCard } from "@verse/arena-web/components/ui/showdown/IncomingChallengeCard";
import { useDuelChallenges } from "@verse/arena-web/hooks/useDuelChallenges";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { getShowdownSocket } from "@verse/arena-web/lib/showdown/socket";


export function DuelChallengeListener() {
  const router = useRouter();
  const token = useArenaToken();
  const { liveChallenge, dismissLive } = useDuelChallenges();

  if (!liveChallenge || !token) return null;

  function accept() {
    const socket = getShowdownSocket(token!);
    socket.emit("duel:accept", { showdownId: liveChallenge!.showdownId });
    router.push(`/duels/challenge/${liveChallenge!.showdownId}`);
    dismissLive();
  }

  function decline() {
    const socket = getShowdownSocket(token!);
    socket.emit("duel:decline", { showdownId: liveChallenge!.showdownId });
    dismissLive();
  }

  return (
    <IncomingChallengeCard
      challenge={liveChallenge}
      onAccept={accept}
      onDecline={decline}
      onDismiss={dismissLive}
    />
  );
}