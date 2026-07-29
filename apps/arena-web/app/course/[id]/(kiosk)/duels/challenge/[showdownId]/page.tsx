"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { useShowdownState } from "@verse/arena-web/lib/showdown/useShowdownState";
import { useQuestionTimer } from "@verse/arena-web/lib/showdown/useQuestionTimer";
import { getActiveMatchQuestion } from "@verse/arena-web/lib/showdown/types";

import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { DuelBattleStart } from "@verse/arena-web/components/ui/duel/DuelBattleStart";
import { DuelCountdown } from "@verse/arena-web/components/ui/duel/DuelCountdown";
import { DuelQuizGameplay } from "@verse/arena-web/components/ui/duel/DuelQuizGameplay";
import { DuelResult } from "@verse/arena-web/components/ui/duel/DuelResult";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

export default function DuelChallengePage() {
  const params = useParams<{ id: string; showdownId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const token = useArenaToken();
  const { state, emit } = useShowdownState(params.showdownId, token);

  if (!state || !user) {
    return (
      <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Establishing uplink…</p>
    );
  }

  const { showdown, participants, matches } = state;
  const myParticipant = participants.find((p) => p.arenaUser.user.id === user.id);
  const opponent = participants.find((p) => p.id !== myParticipant?.id);
  const match = matches[0];

  if (!myParticipant || !opponent) return null;

  const myName = myParticipant.arenaUser.user.username;
  const opponentName = opponent.arenaUser.user.username;

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black select-none">
      <AnimatePresence mode="wait">
        {showdown.status === "challenge_pending" && (
          <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <DuelBattleStart
              me={{ name: myName }}
              opponent={{ name: opponentName }}
              iAmChallenger={showdown.createdBy === myParticipant.arenaUserId}
              questionsPerMatch={showdown.questionsPerMatch}
              onAccept={() => emit("duel:accept", {})}
              onDecline={() => emit("duel:decline", {})}
            />
          </motion.div>
        )}

        {showdown.status === "ready_check" && (
          <motion.div key="ready_check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid place-items-center px-6 min-h-[60dvh] text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                <ArenaAvatar src={dicebearUrl(opponent?.arenaUser.user.username ?? "?")} size="xl" glow className="relative z-10" />
              </div>
              <p className="font-display text-lg font-black text-white uppercase tracking-wide">Synchronizing Combatants</p>
              <p className="font-display text-[10px] font-bold text-white/30 uppercase tracking-[.2em] max-w-xs">
                Waiting for both fighters to enter the arena…
              </p>
            </div>
          </motion.div>
        )}

        {showdown.status === "live" && match && (
          <LiveDuel
            key="live"
            match={match}
            myParticipant={myParticipant}
            opponent={opponent}
            questionsPerMatch={showdown.questionsPerMatch}
            emit={emit}
          />
        )}

        {showdown.status === "complete" && (
          <motion.div key="complete" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
            {!showdown.championId ? (
              <p className="font-display text-white/40 uppercase tracking-[.3em] text-sm">Challenge declined</p>
            ) : (
              (() => {
                const myScore = match ? match.scores[myParticipant.id] ?? 0 : 0;
                const oppScore = match ? match.scores[opponent.id] ?? 0 : 0;
                const verdict = showdown.championId === myParticipant.id ? "win" : showdown.championId === opponent.id ? "loss" : "draw";
                const myCorrectCount = match
                  ? match.questions.reduce((acc, q) => acc + (q.answers.some((a) => a.participantId === myParticipant.id && a.isCorrect) ? 1 : 0), 0)
                  : 0;
                return (
                  <DuelResult
                    verdict={verdict}
                    myName={myName}
                    opponentName={opponentName}
                    myScore={myScore}
                    opponentScore={oppScore}
                    myCorrectCount={myCorrectCount}
                    totalQuestions={showdown.questionsPerMatch}
                    onRematch={() => router.push(`/course/${params.id}/duels`)}
                    onHome={() => router.push(`/course/${params.id}`)}
                  />
                );
              })()
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function LiveDuel({ match, myParticipant, opponent, questionsPerMatch, emit }: any) {
  const activeQ = getActiveMatchQuestion(match);
  const { isCountingDown, countdownSeconds, secondsLeft, pct } = useQuestionTimer(activeQ);

  if (!activeQ) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
          <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Preparing next question…</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full">
      {isCountingDown ? (
        <DuelCountdown secondsLeft={countdownSeconds} />
      ) : (
        <DuelQuizGameplay
          match={match}
          activeQ={activeQ}
          myParticipantId={myParticipant.id}
          myName={myParticipant.arenaUser.user.username}
          opponentId={opponent.id}
          opponentName={opponent.arenaUser.user.username}
          questionsPerMatch={questionsPerMatch}
          pct={pct}
          secondsLeft={secondsLeft}
          onAnswer={(optionIndex: number) =>
            emit("showdown:answer", { matchQuestionId: activeQ.id, participantId: myParticipant.id, optionIndex })
          }
        />
      )}
    </motion.div>
  );
}