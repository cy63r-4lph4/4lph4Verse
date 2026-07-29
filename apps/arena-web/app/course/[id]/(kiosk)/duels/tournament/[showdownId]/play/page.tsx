"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { useShowdownState } from "@verse/arena-web/lib/showdown/useShowdownState";
import { useQuestionTimer } from "@verse/arena-web/lib/showdown/useQuestionTimer";
import { getActiveMatchQuestion } from "@verse/arena-web/lib/showdown/types";
import { useTournamentMyMatch } from "@verse/arena-web/hooks/useTournamentMyMatch";
import { DuelCountdown } from "@verse/arena-web/components/ui/duel/DuelCountdown";
import { DuelQuizGameplay } from "@verse/arena-web/components/ui/duel/DuelQuizGameplay";
import { DuelResult } from "@verse/arena-web/components/ui/duel/DuelResult";
import { TournamentSpectatorView } from "@verse/arena-web/components/ui/tournament/TournamentSpectatorView";
import { TournamentWaitingRoom } from "@verse/arena-web/components/ui/tournament/TournamentWaitingRoom";

export default function TournamentPlayPage() {
  const params = useParams<{ id: string; showdownId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const token = useArenaToken();
  const { state, emit } = useShowdownState(params.showdownId, token);
  const [confirmExit, setConfirmExit] = useState(false);

  const myParticipant = state?.participants.find((p) => p.arenaUser.user.id === user?.id) ?? null;
  const myStatus = useTournamentMyMatch(state, myParticipant?.id ?? null);

  const body = !state || !user ? (
    <div className="h-full grid place-items-center">
      <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Establishing uplink…</p>
    </div>
  ) : !myParticipant || !myStatus ? (
    <div className="h-full grid place-items-center px-6 text-center">
      <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">You're not entered in this tournament</p>
    </div>
  ) : (
    <AnimatePresence mode="wait">
      {myStatus.kind === "champion" && (
        <motion.div key="champion" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full grid place-items-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="font-display text-5xl font-black text-amber-300 uppercase" style={{ textShadow: "0 0 40px rgba(251,191,36,.6)" }}>
              Champion
            </p>
            <p className="font-display text-[10px] font-bold text-white/30 uppercase tracking-[.3em]">
              You conquered the arena
            </p>
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="mt-4 px-6 py-3 rounded-2xl bg-primary/90 font-display text-[11px] font-black uppercase tracking-[.2em] text-black active:scale-95 transition-all"
            >
              Return to Course
            </button>
          </div>
        </motion.div>
      )}

      {myStatus.kind === "eliminated" && (
        <motion.div key="eliminated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
          <TournamentWaitingRoom status="eliminated" />
        </motion.div>
      )}

      {myStatus.kind === "bye" && (
        <motion.div key="bye" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
          <TournamentWaitingRoom status="bye" roundLabel={myStatus.roundLabel} />
        </motion.div>
      )}

      {myStatus.kind === "awaiting" && (
        <motion.div key="awaiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
          <TournamentWaitingRoom status="awaiting-next-round" roundLabel={myStatus.roundLabel} />
        </motion.div>
      )}

      {myStatus.kind === "spectating" && (
        <motion.div key="spectating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
          <TournamentSpectatorView
            match={myStatus.match}
            playerAName={myStatus.playerAName}
            playerBName={myStatus.playerBName}
            roundLabel={myStatus.roundLabel}
          />
        </motion.div>
      )}

      {myStatus.kind === "active" && (
        <ActiveTournamentMatch
          key="active"
          match={myStatus.match}
          myParticipant={myParticipant}
          participants={state.participants}
          questionsPerMatch={state.showdown.questionsPerMatch}
          emit={emit}
        />
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setConfirmExit(true)}
        className="fixed top-4 left-4 z-50 w-9 h-9 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white transition-colors active:scale-90"
      >
        <ArrowLeft size={15} />
      </button>

      {confirmExit && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="max-w-xs w-full rounded-2xl border border-white/10 bg-black/95 p-5 space-y-4">
            <p className="font-display text-xs font-bold text-white/80 leading-relaxed">
              Leave the tournament screen? You'll stop seeing live updates until you come back.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfirmExit(false)}
                className="py-2.5 rounded-xl bg-white/[0.06] font-display text-[10px] font-bold text-white/60 uppercase tracking-wider"
              >
                Stay
              </button>
              <button
                onClick={() => router.push(`/course/${params.id}`)}
                className="py-2.5 rounded-xl bg-red-500/80 font-display text-[10px] font-black text-white uppercase tracking-wider"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative h-full w-full select-none">{body}</div>
    </>
  );
}

function ActiveTournamentMatch({ match, myParticipant, participants, questionsPerMatch, emit }: any) {
  const activeQ = getActiveMatchQuestion(match);
  const { isCountingDown, countdownSeconds, secondsLeft, pct } = useQuestionTimer(activeQ);

  const opponentId = match.playerAId === myParticipant.id ? match.playerBId : match.playerAId;
  const opponent = participants.find((p: any) => p.id === opponentId);

  if (match.status === "complete") {
    const myScore = match.scores[myParticipant.id] ?? 0;
    const oppScore = opponent ? match.scores[opponent.id] ?? 0 : 0;
    const verdict = match.winnerId === myParticipant.id ? "win" : "loss";
    const myCorrectCount = match.questions.reduce(
      (acc: number, q: any) => acc + (q.answers.some((a: any) => a.participantId === myParticipant.id && a.isCorrect) ? 1 : 0),
      0,
    );

    return (
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
        <DuelResult
          verdict={verdict}
          myName={myParticipant.arenaUser.user.username}
          opponentName={opponent?.arenaUser.user.username ?? "?"}
          myScore={myScore}
          opponentScore={oppScore}
          myCorrectCount={myCorrectCount}
          totalQuestions={questionsPerMatch}
          onRematch={() => {}}
          onHome={() => {}}
        />
      </motion.div>
    );
  }

  if (!activeQ) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid place-items-center">
        <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Awaiting instructor to start…</p>
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
          opponentId={opponent?.id ?? ""}
          opponentName={opponent?.arenaUser.user.username ?? "?"}
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