export type ShowdownStatus =
  | "draft"
  | "lobby"
  | "seeding"
  | "challenge_pending"
  | "live"
  | "complete";

export type ShowdownMode = "tournament" | "duel";

export type MatchStatus = "pending" | "active" | "complete";

export type Participant = {
  id: string; // showdown_participants.id
  showdownId: string;
  arenaUserId: string;
  seed: number | null;
  eliminatedAtRound: number | null;
  arenaUser: {
    id: string;
    role: string;
    user: { id: string; username: string };
  };
};

export type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type Answer = {
  id: string;
  participantId: string;
  optionIndex: number;
  isCorrect: boolean;
  pointsAwarded: number;
  answeredAt: string;
};

export type MatchQuestion = {
  id: string;
  matchId: string;
  questionId: string;
  questionNumber: number;
  timeLimitSeconds: number;
  startedAt: string | null;
  endsAt: string | null;
  question: Question;
  answers: Answer[];
};

export type Match = {
  id: string;
  showdownId: string;
  round: number;
  matchIndex: number;
  playerAId: string;
  playerBId: string | null;
  winnerId: string | null;
  status: MatchStatus;
  questionsCompleted: number;
  startedAt: string | null;
  completedAt: string | null;
  questions: MatchQuestion[];
  scores: Record<string, number>;
};

export type Showdown = {
  id: string;
  courseId: string;
  createdBy: string;
  title: string;
  status: ShowdownStatus;
  mode: ShowdownMode; // was missing — DuelChallengePage reads showdown.mode
  questionsPerMatch: number;
  timeLimitSeconds: number;
  matchCountdownMs: number;
  totalRounds: number | null;
  championId: string | null;
};

export type ShowdownFullState = {
  showdown: Showdown;
  participants: Participant[];
  matches: Match[];
};

// ── Derived helpers ──────────────────────────────────────────────────────

export function getRoundMatches(state: ShowdownFullState, round: number): Match[] {
  return state.matches.filter((m) => m.round === round);
}

export function getMaxRound(state: ShowdownFullState): number {
  return Math.max(0, ...state.matches.map((m) => m.round));
}

export function getMatchById(state: ShowdownFullState, matchId: string): Match | null {
  return state.matches.find((m) => m.id === matchId) ?? null;
}

export function getActiveMatchQuestion(match: Match): MatchQuestion | null {
  if (match.questionsCompleted >= match.questions.length) return null;
  return match.questions[match.questions.length - 1] ?? null;
}

export function getParticipant(
  state: ShowdownFullState,
  participantId: string | null,
): Participant | null {
  if (!participantId) return null;
  return state.participants.find((p) => p.id === participantId) ?? null;
}

export function isRoundComplete(state: ShowdownFullState): boolean {
  const maxRound = getMaxRound(state);
  const round = getRoundMatches(state, maxRound);
  return round.length > 0 && round.every((m) => m.winnerId !== null);
}

export function isFinalRound(state: ShowdownFullState): boolean {
  const maxRound = getMaxRound(state);
  return getRoundMatches(state, maxRound).length === 1;
}