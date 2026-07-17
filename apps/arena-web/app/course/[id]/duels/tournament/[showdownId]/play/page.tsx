"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { useShowdownState } from "@verse/arena-web/lib/showdown/useShowdownState";
import { useQuestionTimer } from "@verse/arena-web/lib/showdown/useQuestionTimer";
import { getActiveMatchQuestion } from "@verse/arena-web/lib/showdown/types";
import { useTournamentMyMatch } from "@verse/arena-web/hooks/useTournamentMyMatch";
import { DuelCountdown } from "@verse/arena-web/components/ui/showdown/duel/DuelCountdown";
import { DuelQuizGameplay } from "@verse/arena-web/components/ui/showdown/duel/DuelQuizGameplay";
import { DuelResult } from "@verse/arena-web/components/ui/showdown/duel/DuelResult";
import { TournamentSpectatorView } from "@verse/arena-web/components/ui/showdown/tournament/TournamentSpectatorView";
import { TournamentWaitingRoom } from "@verse/arena-web/components/ui/showdown/tournament/TournamentWaitingRoom";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";

export default function TournamentPlayPage() {
    const params = useParams<{ id: string; showdownId: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const token = useArenaToken();
    const { state, emit } = useShowdownState(params.showdownId, token);

    const myParticipant = state?.participants.find((p) => p.arenaUser.user.id === user?.id) ?? null;
    const myStatus = useTournamentMyMatch(state, myParticipant?.id ?? null);

    if (!state || !user) {
        return (
            <EnergyBackground className="grid place-items-center" variant="duel">
                <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Establishing uplink…</p>
            </EnergyBackground>
        );
    }

    if (!myParticipant || !myStatus) {
        return (
            <EnergyBackground className="grid place-items-center" variant="duel">
                <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">You're not entered in this tournament</p>
            </EnergyBackground>
        );
    }

    return (
        <main className="relative h-dvh w-full overflow-hidden bg-black select-none">
            <AnimatePresence mode="wait">
                {myStatus.kind === "champion" && (
                    <motion.div key="champion" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
                        <EnergyBackground variant="duel" className="h-full grid place-items-center">
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
                        </EnergyBackground>
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
        </main>
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
                    onRematch={() => { }}
                    onHome={() => { }}
                />
            </motion.div>
        );
    }

    if (!activeQ) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <EnergyBackground variant="duel" className="h-full grid place-items-center">
                    <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Awaiting instructor to start…</p>
                </EnergyBackground>
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