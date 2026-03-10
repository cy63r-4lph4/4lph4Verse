"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@verse/ui";
import { CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BattleResult {
  score:          number;
  opponentScore:  number;
  correctAnswers: number;
  totalQuestions: number;
}

interface QuizGameplayProps {
  quizId?: string;
  onFinish: (result: BattleResult) => void;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PLAYER = {
  name:   "ShadowScholar99",
  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=player",
};

const OPPONENT = {
  name:   "NightHawk42",
  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nighthawk",
};

const QUESTIONS = [
  {
    id: 1,
    question: "What is Newton's First Law of Motion also known as?",
    answers: ["Law of Acceleration", "Law of Inertia", "Law of Reaction", "Law of Gravity"],
    correct: 1,
  },
  {
    id: 2,
    question: "If F = ma, what happens to acceleration when mass doubles but force remains constant?",
    answers: ["Doubles", "Halves", "Stays same", "Quadruples"],
    correct: 1,
  },
  {
    id: 3,
    question: "What is the SI unit of force?",
    answers: ["Joule", "Watt", "Newton", "Pascal"],
    correct: 2,
  },
  {
    id: 4,
    question: "Which law states every action has an equal and opposite reaction?",
    answers: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
    correct: 2,
  },
  {
    id: 5,
    question: "An object at rest tends to stay at rest due to:",
    answers: ["Momentum", "Inertia", "Friction", "Gravity"],
    correct: 1,
  },
];

const QUESTION_TIME = 15;

// Points formula: base + time bonus
const calcPoints = (timeLeft: number) => 100 + timeLeft * 10;

// Simulate opponent answering — random delay between 3–12s
const opponentAnswerDelay = () => 3000 + Math.random() * 9000;

// ─── Timer ring ───────────────────────────────────────────────────────────────

function TimerRing({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct      = timeLeft / total;
  const radius   = 22;
  const circ     = 2 * Math.PI * radius;
  const dash     = pct * circ;

  const color = timeLeft <= 5
    ? "#ef4444"   // red
    : timeLeft <= 9
    ? "#f59e0b"   // amber
    : "hsl(var(--primary))";

  return (
    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        {/* Track */}
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3" />
        {/* Progress */}
        <circle
          cx="28" cy="28" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray .9s linear, stroke .3s", filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span
        className={cn(
          "font-display text-[15px] font-black leading-none transition-colors duration-300",
          timeLeft <= 5 ? "text-red-400" : timeLeft <= 9 ? "text-amber-400" : "text-white"
        )}
      >
        {timeLeft}
      </span>
    </div>
  );
}

// ─── Mini combatant strip ─────────────────────────────────────────────────────

function CombatantStrip({
  player,
  score,
  side,
  isOpponent,
  opponentAnswered,
}: {
  player: typeof PLAYER;
  score: number;
  side: "left" | "right";
  isOpponent?: boolean;
  opponentAnswered?: boolean;
}) {
  const isRight = side === "right";

  return (
    <div className={cn(
      "flex items-center gap-2 flex-1",
      isRight && "flex-row-reverse"
    )}>
      <div className="relative shrink-0">
        <ArenaAvatar
          src={player.avatar}
          size="sm"
          glow
          glowColor={isOpponent ? "danger" : "primary"}
        />
        {/* Opponent "thinking" indicator */}
        {isOpponent && opponentAnswered && (
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-black flex items-center justify-center"
            style={{ boxShadow: "0 0 6px rgba(239,68,68,.7)" }}
          >
            <CheckCircle2 size={8} className="text-white" />
          </div>
        )}
        {isOpponent && !opponentAnswered && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <div
              className="w-1.5 h-1.5 rounded-full bg-white/40"
              style={{ animation: "pulse 1s ease-in-out infinite" }}
            />
          </div>
        )}
      </div>

      <div className={cn("flex flex-col min-w-0", isRight && "items-end")}>
        <span className="font-display text-[9px] font-black text-white/35 uppercase tracking-wider truncate">
          {player.name}
        </span>
        <span
          className={cn(
            "font-display text-[15px] font-black leading-tight",
            isOpponent ? "text-red-400" : "text-primary"
          )}
          style={{ textShadow: isOpponent ? "0 0 8px rgba(239,68,68,.5)" : "0 0 8px hsl(var(--primary) / .5)" }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

// ─── Answer button ────────────────────────────────────────────────────────────

type AnswerState = "idle" | "selected" | "correct" | "incorrect" | "reveal-correct" | "dimmed";

function AnswerButton({
  label,
  text,
  state,
  onClick,
  index,
}: {
  label: string;
  text: string;
  state: AnswerState;
  onClick: () => void;
  index: number;
}) {
  const base = "relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 outline-none overflow-hidden";

  const styles: Record<AnswerState, string> = {
    idle:            "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 active:scale-[.98]",
    selected:        "bg-primary/10 border-primary/50",
    correct:         "bg-green-500/15 border-green-500/70",
    incorrect:       "bg-red-500/15 border-red-500/60",
    "reveal-correct":"bg-green-500/15 border-green-500/70",
    dimmed:          "bg-white/[0.01] border-white/[0.04] opacity-30",
  };

  const labelStyles: Record<AnswerState, string> = {
    idle:            "bg-white/[0.07] text-white/30",
    selected:        "bg-primary/20 text-primary",
    correct:         "bg-green-500/20 text-green-400",
    incorrect:       "bg-red-500/20 text-red-400",
    "reveal-correct":"bg-green-500/20 text-green-400",
    dimmed:          "bg-white/[0.04] text-white/15",
  };

  const icon = state === "correct" || state === "reveal-correct"
    ? <CheckCircle2 size={14} className="text-green-400 shrink-0 ml-auto" />
    : state === "incorrect"
    ? <XCircle size={14} className="text-red-400 shrink-0 ml-auto" />
    : null;

  // Staggered mount
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <button
      onClick={onClick}
      disabled={state !== "idle"}
      className={cn(
        base,
        styles[state],
        "transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      {/* Letter badge */}
      <span className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center font-display text-[11px] font-black shrink-0 transition-all duration-200",
        labelStyles[state]
      )}>
        {label}
      </span>

      {/* Answer text */}
      <span className={cn(
        "font-display text-[13px] font-bold leading-tight flex-1",
        state === "idle" ? "text-white/80" : "text-white",
        state === "dimmed" && "text-white/25"
      )}>
        {text}
      </span>

      {icon}
    </button>
  );
}

// ─── Points flash ─────────────────────────────────────────────────────────────

function PointsFlash({ points, show }: { points: number; show: boolean }) {
  return (
    <div className={cn(
      "absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-50",
      "font-display font-black text-[28px] transition-all duration-600",
      points > 0 ? "text-green-400" : "text-red-400",
      show ? "opacity-100 -translate-y-0" : "opacity-0 translate-y-4",
    )}
    style={{ textShadow: points > 0 ? "0 0 20px rgba(74,222,128,.8)" : "0 0 20px rgba(239,68,68,.8)" }}
    >
      {points > 0 ? `+${points}` : "MISS"}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuizGameplay({ quizId, onFinish }: QuizGameplayProps) {
  const [currentQ,        setCurrentQ]        = useState(0);
  const [selectedAnswer,  setSelectedAnswer]   = useState<number | null>(null);
  const [answerState,     setAnswerState]      = useState<"pending" | "correct" | "incorrect">("pending");
  const [timeLeft,        setTimeLeft]         = useState(QUESTION_TIME);
  const [playerScore,     setPlayerScore]      = useState(0);
  const [opponentScore,   setOpponentScore]    = useState(0);
  const [correctCount,    setCorrectCount]     = useState(0);
  const [isTransitioning, setIsTransitioning]  = useState(false);
  const [opponentAnswered,setOpponentAnswered]  = useState(false);
  const [pointsFlash,     setPointsFlash]      = useState({ show: false, points: 0 });
  const [questionKey,     setQuestionKey]      = useState(0); // force re-mount for stagger anim

  const question = QUESTIONS[currentQ];

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (answerState !== "pending" || isTransitioning) return;
    if (timeLeft <= 0) return;

    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { submitAnswer(-1); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [answerState, currentQ, isTransitioning]);

  // ── Opponent simulation ──────────────────────────────────────────────────────
  useEffect(() => {
    setOpponentAnswered(false);
    const delay = opponentAnswerDelay();
    const t = setTimeout(() => setOpponentAnswered(true), delay);
    return () => clearTimeout(t);
  }, [currentQ]);

  // ── Submit answer ────────────────────────────────────────────────────────────
  const submitAnswer = useCallback((answerIndex: number) => {
    if (answerState !== "pending" || isTransitioning) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === question.correct;
    setAnswerState(isCorrect ? "correct" : "incorrect");

    const pts = isCorrect ? calcPoints(timeLeft) : 0;
    const newPlayerScore = playerScore + pts;
    setPlayerScore(newPlayerScore);
    if (isCorrect) setCorrectCount(c => c + 1);

    // Simulate opponent score
    const opponentCorrect = Math.random() > 0.4;
    const opponentPts = opponentCorrect ? calcPoints(Math.floor(Math.random() * 10) + 3) : 0;
    setOpponentScore(prev => prev + opponentPts);

    // Points flash
    setPointsFlash({ show: true, points: pts });
    setTimeout(() => setPointsFlash(p => ({ ...p, show: false })), 1000);

    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswerState("pending");
        setTimeLeft(QUESTION_TIME);
        setIsTransitioning(false);
        setQuestionKey(k => k + 1);
      } else {
        onFinish({
          score:          newPlayerScore,
          opponentScore:  opponentScore + opponentPts,
          correctAnswers: isCorrect ? correctCount + 1 : correctCount,
          totalQuestions: QUESTIONS.length,
        });
      }
    }, 1400);
  }, [answerState, currentQ, question.correct, timeLeft, playerScore, opponentScore, correctCount, onFinish, isTransitioning]);

  // ── Derive per-answer states ─────────────────────────────────────────────────
  const getAnswerState = (index: number): AnswerState => {
    if (answerState === "pending") return "idle";
    const isCorrect = index === question.correct;
    const isSelected = index === selectedAnswer;
    if (isCorrect) return isSelected ? "correct" : "reveal-correct";
    if (isSelected) return "incorrect";
    return "dimmed";
  };

  // ── Leading indicator ────────────────────────────────────────────────────────
  const isLeading = playerScore >= opponentScore;

  return (
    <>
      <style>{`
        @keyframes timer-urgent {
          0%, 100% { opacity: 1; }
          50%       { opacity: .5; }
        }
      `}</style>

      <EnergyBackground className="h-full flex flex-col">

        {/* ── HUD BAR ──────────────────────────────────────────────────────── */}
        <header className="shrink-0 px-4 pt-8 pb-3">

          {/* Combatant strip */}
          <div className="flex items-center gap-3 mb-4">
            <CombatantStrip
              player={PLAYER}
              score={playerScore}
              side="left"
            />

            {/* Center: question counter */}
            <div className="flex flex-col items-center shrink-0">
              <span className="font-display text-[8px] font-black text-white/20 uppercase tracking-[.2em]">
                Round
              </span>
              <span className="font-display text-[13px] font-black text-white leading-none">
                {currentQ + 1}/{QUESTIONS.length}
              </span>
            </div>

            <CombatantStrip
              player={OPPONENT}
              score={opponentScore}
              side="right"
              isOpponent
              opponentAnswered={opponentAnswered}
            />
          </div>

          {/* Progress bar */}
          <div className="h-[3px] rounded-full bg-white/[0.07] overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${((currentQ) / QUESTIONS.length) * 100}%`,
                boxShadow: "0 0 8px hsl(var(--primary) / .6)",
              }}
            />
          </div>
        </header>

        {/* ── QUESTION AREA ────────────────────────────────────────────────── */}
        <div className="flex-1 min-h-0 flex flex-col px-4 pt-2 pb-3 gap-4">

          {/* Question card */}
          <div
            key={`q-${questionKey}`}
            className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Q number badge + timer ring in same row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="font-display text-[10px] font-black text-primary uppercase tracking-[.2em]">
                    Q{currentQ + 1}
                  </span>
                </div>
                {isLeading && answerState === "pending" && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Zap size={8} className="text-green-400" />
                    <span className="font-display text-[8px] font-black text-green-400 uppercase tracking-wider">
                      Leading
                    </span>
                  </div>
                )}
              </div>

              {/* Timer ring */}
              <div style={timeLeft <= 5 ? { animation: "timer-urgent .5s ease-in-out infinite" } : undefined}>
                <TimerRing timeLeft={timeLeft} total={QUESTION_TIME} />
              </div>
            </div>

            {/* Question text */}
            <p className="font-display text-[16px] font-bold text-white leading-snug">
              {question.question}
            </p>
          </div>

          {/* Answer grid */}
          <div key={`a-${questionKey}`} className="flex flex-col gap-2.5 relative">
            {/* Points flash overlay */}
            <div className="relative h-0">
              <PointsFlash show={pointsFlash.show} points={pointsFlash.points} />
            </div>

            {question.answers.map((answer, index) => (
              <AnswerButton
                key={index}
                index={index}
                label={String.fromCharCode(65 + index)}
                text={answer}
                state={getAnswerState(index)}
                onClick={() => submitAnswer(index)}
              />
            ))}
          </div>

        </div>

        {/* ── BOTTOM SCORE BAR ─────────────────────────────────────────────── */}
        <div className="shrink-0 px-4 pb-8 pt-2">
          <div className="flex items-center gap-3">
            {/* Player score share */}
            <span className="font-display text-[10px] font-black text-primary/60 w-8 text-right">
              {playerScore}
            </span>

            {/* Relative score bar */}
            <div className="flex-1 h-[5px] rounded-full bg-white/[0.07] overflow-hidden relative">
              {/* Player fill from left */}
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${playerScore + opponentScore > 0
                    ? (playerScore / (playerScore + opponentScore)) * 100
                    : 50}%`,
                  boxShadow: "0 0 6px hsl(var(--primary) / .6)",
                }}
              />
            </div>

            <span className="font-display text-[10px] font-black text-red-400/60 w-8 text-left">
              {opponentScore}
            </span>
          </div>

          {/* Label */}
          <div className="flex justify-between mt-1 px-[44px]">
            <span className="font-display text-[7px] font-bold text-white/15 uppercase tracking-wider">You</span>
            <span className="font-display text-[7px] font-bold text-white/15 uppercase tracking-wider">Opp</span>
          </div>
        </div>

      </EnergyBackground>
    </>
  );
}