import { useMemo } from "react";
import { getMaxRound, getRoundMatches, isFinalRound } from "@verse/arena-web/lib/showdown/types";
import type { ShowdownFullState, Match } from "@verse/arena-web/lib/showdown/types";

export type TournamentParticipantStatus =
  | { kind: "champion" }
  | { kind: "eliminated" }
  | { kind: "bye"; roundLabel: string }
  | { kind: "awaiting"; roundLabel: string }
  | { kind: "active"; match: Match }
  | { kind: "spectating"; match: Match | null; playerAName: string; playerBName: string; roundLabel: string };

function roundLabel(roundIndex: number, totalRounds: number) {
  const remaining = totalRounds - roundIndex;
  if (remaining === 1) return "Final";
  if (remaining === 2) return "Semi-Final";
  if (remaining === 3) return "Quarter-Final";
  return `Round ${roundIndex + 1}`;
}

export function useTournamentMyMatch(state: ShowdownFullState | null, myParticipantId: string | null): TournamentParticipantStatus | null {
  return useMemo(() => {
    if (!state || !myParticipantId) return null;

    const { showdown, participants, matches } = state;

    if (showdown.status === "complete") {
      return showdown.championId === myParticipantId ? { kind: "champion" } : { kind: "eliminated" };
    }

    const maxRound = getMaxRound(state);
    const currentRound = getRoundMatches(state, maxRound);
    const totalRounds = showdown.totalRounds ?? maxRound + 1;
    const label = roundLabel(maxRound, totalRounds);

    // Am I still alive anywhere in this round or a past one, with no winner recorded for me as loser?
    const myMatchThisRound = currentRound.find(
      (m) => m.playerAId === myParticipantId || m.playerBId === myParticipantId,
    );

    if (myMatchThisRound) {
      if (myMatchThisRound.playerBId === null) {
        return { kind: "bye", roundLabel: label };
      }
      if (myMatchThisRound.status === "active") {
        return { kind: "active", match: myMatchThisRound };
      }
      if (myMatchThisRound.status === "pending") {
        return { kind: "awaiting", roundLabel: label };
      }
      // my match this round is already complete — did I win or lose it?
      if (myMatchThisRound.winnerId && myMatchThisRound.winnerId !== myParticipantId) {
        return { kind: "eliminated" };
      }
      // I won my match; waiting for the round to fully close and advance
      return { kind: "awaiting", roundLabel: "next round" };
    }

    // Not in this round's matches at all — either eliminated earlier or spectating someone else's active match
    const wasEverAParticipant = matches.some(
      (m) => m.playerAId === myParticipantId || m.playerBId === myParticipantId,
    );
    if (!wasEverAParticipant) return { kind: "eliminated" }; // shouldn't normally happen for a real participant

    const activeMatch = currentRound.find((m) => m.status === "active") ?? null;
    const a = activeMatch ? participants.find((p) => p.id === activeMatch.playerAId) : null;
    const b = activeMatch ? participants.find((p) => p.id === activeMatch.playerBId) : null;

    return {
      kind: "spectating",
      match: activeMatch,
      playerAName: a?.arenaUser.user.username ?? "?",
      playerBName: b?.arenaUser.user.username ?? "?",
      roundLabel: label,
    };
  }, [state, myParticipantId]);
}