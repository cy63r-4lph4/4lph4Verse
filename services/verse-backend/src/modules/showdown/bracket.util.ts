export type SeedPlayer = { participantId: string; name: string };

export type BuiltMatch = {
  round: number;
  matchIndex: number;
  playerAId: string;
  playerBId: string | null; // null = bye, playerA auto-advances
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Builds round 0 only — later rounds are built incrementally as winners are known. */
export function buildFirstRound(players: SeedPlayer[]): {
  matches: BuiltMatch[];
  totalRounds: number;
} {
  const shuffled = shuffle(players);
  const n = shuffled.length;

  let size = 1;
  while (size < n) size *= 2;

  const numMatches = size / 2;
  const numByes = size - n;
  const matches: BuiltMatch[] = [];
  let idx = 0;

  for (let i = 0; i < numMatches; i++) {
    const a = shuffled[idx++];
    const isBye = i < numByes;
    const b = isBye ? null : shuffled[idx++];

    matches.push({
      round: 0,
      matchIndex: matches.length,
      playerAId: a.participantId,
      playerBId: b ? b.participantId : null,
    });
  }

  return { matches, totalRounds: Math.log2(size) };
}