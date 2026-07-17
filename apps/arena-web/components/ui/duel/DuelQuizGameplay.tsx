"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Zap } from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import type { Match, MatchQuestion } from "@verse/arena-web/lib/showdown/types";

function dicebearUrl(name: string) {
    return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

function TimerRing({ pct, seconds }: { pct: number; seconds: number }) {
    const radius = 22;
    const circ = 2 * Math.PI * radius;
    const color = seconds <= 5 ? "#ef4444" : seconds <= 9 ? "#f59e0b" : "hsl(var(--primary))";

    return (
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="absolute inset-0 -rotate-90" width="56" height="56">
                <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
                <circle
                    cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${pct * circ} ${circ}`}
                    style={{ transition: "stroke-dasharray .2s linear, stroke .3s", filter: `drop-shadow(0 0 4px ${color})` }}
                />
            </svg>
            <span className={cn("font-display text-[15px] font-black leading-none", seconds <= 5 ? "text-red-400" : seconds <= 9 ? "text-amber-400" : "text-white")}>
                {seconds}
            </span>
        </div>
    );
}

function CombatantStrip({ name, score, side, isOpponent, answered }: {
    name: string; score: number; side: "left" | "right"; isOpponent?: boolean; answered?: boolean;
}) {
    const isRight = side === "right";
    return (
        <div className={cn("flex items-center gap-2 flex-1", isRight && "flex-row-reverse")}>
            <div className="relative shrink-0">
                <ArenaAvatar src={dicebearUrl(name)} size="sm" glow glowColor={isOpponent ? "danger" : "primary"} />
                {isOpponent && (
                    <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-black flex items-center justify-center",
                        answered ? "bg-red-500" : "bg-white/10 border-white/20",
                    )}>
                        {answered ? <CheckCircle2 size={8} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/40" style={{ animation: "pulse 1s ease-in-out infinite" }} />}
                    </div>
                )}
            </div>
            <div className={cn("flex flex-col min-w-0", isRight && "items-end")}>
                <span className="font-display text-[9px] font-black text-white/35 uppercase tracking-wider truncate">{name}</span>
                <span className={cn("font-display text-[15px] font-black leading-tight", isOpponent ? "text-red-400" : "text-primary")}>
                    {score}
                </span>
            </div>
        </div>
    );
}

type AnswerState = "idle" | "selected" | "dimmed";

function AnswerButton({ label, text, state, disabled, onClick }: {
    label: string; text: string; state: AnswerState; disabled: boolean; onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200",
                state === "selected" ? "bg-primary/10 border-primary/50" :
                    state === "dimmed" ? "bg-white/[0.01] border-white/[0.04] opacity-30" :
                        "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 active:scale-[.98]",
            )}
        >
            <span className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center font-display text-[11px] font-black shrink-0",
                state === "selected" ? "bg-primary/20 text-primary" : "bg-white/[0.07] text-white/30",
            )}>
                {label}
            </span>
            <span className="font-display text-[13px] font-bold leading-tight flex-1 text-white/80">{text}</span>
        </button>
    );
}

interface DuelQuizGameplayProps {
    match: Match;
    activeQ: MatchQuestion;
    myParticipantId: string;
    myName: string;
    opponentId: string;
    opponentName: string;
    questionsPerMatch: number;
    pct: number;
    secondsLeft: number;
    onAnswer: (optionIndex: number) => void;
}

export function DuelQuizGameplay({
    match, activeQ, myParticipantId, myName, opponentId, opponentName, questionsPerMatch, pct, secondsLeft, onAnswer,
}: DuelQuizGameplayProps) {
    const [myVote, setMyVote] = useState<number | null>(null);
    const [flash, setFlash] = useState<{ show: boolean; wasCorrect: boolean } | null>(null);
    const prevQuestionId = useRef<string | null>(null);

    const alreadyAnswered = activeQ.answers.some((a) => a.participantId === myParticipantId);
    const opponentAnswered = activeQ.answers.some((a) => a.participantId === opponentId);

    // Reset local vote when a new question arrives; show a brief flash for
    // the previous question's outcome using the just-completed history entry.
    useEffect(() => {
        if (prevQuestionId.current && prevQuestionId.current !== activeQ.id) {
            const prevQ = match.questions.find((q) => q.id === prevQuestionId.current);
            const myPrevAnswer = prevQ?.answers.find((a) => a.participantId === myParticipantId);
            if (myPrevAnswer) {
                setFlash({ show: true, wasCorrect: myPrevAnswer.isCorrect });
                setTimeout(() => setFlash(null), 1200);
            }
        }
        prevQuestionId.current = activeQ.id;
        setMyVote(null);
    }, [activeQ.id, match.questions, myParticipantId]);

    function submit(idx: number) {
        if (alreadyAnswered) return;
        setMyVote(idx);
        onAnswer(idx);
    }

    const progress = (activeQ.questionNumber - 1) / match.questions.length;

    return (
        <>
            <header className="shrink-0 px-4 pt-8 pb-3">
                <div className="flex items-center gap-3 mb-4">
                    <CombatantStrip name={myName} score={match.scores[myParticipantId] ?? 0} side="left" />
                    <div className="flex flex-col items-center shrink-0">
                        <span className="font-display text-[8px] font-black text-white/20 uppercase tracking-[.2em]">Round</span>
                        <span className="font-display text-[13px] font-black text-white leading-none">
                            {activeQ.questionNumber}/{questionsPerMatch}
                        </span>
                    </div>
                    <CombatantStrip name={opponentName} score={match.scores[opponentId] ?? 0} side="right" isOpponent answered={opponentAnswered} />
                </div>
                <div className="h-[3px] rounded-full bg-white/[0.07] overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress * 100}%`, boxShadow: "0 0 8px hsl(var(--primary) / .6)" }} />
                </div>
            </header>

            <div className="flex-1 min-h-0 flex flex-col px-4 pt-2 pb-3 gap-4 relative">
                {flash && (
                    <div className={cn(
                        "absolute top-2 left-1/2 -translate-x-1/2 z-50 font-display font-black text-[24px] transition-all duration-500 pointer-events-none",
                        flash.wasCorrect ? "text-green-400" : "text-red-400",
                        flash.show ? "opacity-100" : "opacity-0",
                    )} style={{ textShadow: flash.wasCorrect ? "0 0 20px rgba(74,222,128,.8)" : "0 0 20px rgba(239,68,68,.8)" }}>
                        {flash.wasCorrect ? "Correct!" : "Missed"}
                    </div>
                )}

                <div key={activeQ.id} className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between">
                        <div className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                            <span className="font-display text-[10px] font-black text-primary uppercase tracking-[.2em]">Q{activeQ.questionNumber}</span>
                        </div>
                        <TimerRing pct={pct} seconds={secondsLeft} />
                    </div>
                    <p className="font-display text-[16px] font-bold text-white leading-snug">{activeQ.question.prompt}</p>
                </div>

                <div className="flex flex-col gap-2.5">
                    {activeQ.question.options.map((opt, i) => (
                        <AnswerButton
                            key={i}
                            label={String.fromCharCode(65 + i)}
                            text={opt}
                            state={alreadyAnswered ? (myVote === i ? "selected" : "dimmed") : "idle"}
                            disabled={alreadyAnswered}
                            onClick={() => submit(i)}
                        />
                    ))}
                </div>

                {alreadyAnswered && (
                    <p className="text-center font-display text-[10px] font-bold text-primary uppercase tracking-[.2em]">
                        Locked in — awaiting result
                    </p>
                )}
            </div>
        </>
    );
}