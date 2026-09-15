"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Heart, Flame, Skull, Zap, ChevronRight,
  Target, RotateCcw, BookOpen, Shield, Trophy,
} from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { api } from "@verse/arena-web/lib/api";
import useAuth from "@verse/arena-web/hooks/useAuth";

// ── Types ───────────────────────────────────────────────────────────────────
type Question = {
  id: string;
  prompt: string;
  options: string[];
  difficulty: string;
  category: string | null;
};

type AnswerFeedback = {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string | null;
  xpEarned: number;
  streak: number;
  livesRemaining: number;
  score: number;
  isRunOver: boolean;
};

type RunSummary = {
  id: string;
  score: number;
  questionsAnswered: number;
  questionsCorrect: number;
  accuracy: number;
  bestStreak: number;
  questions: {
    prompt: string;
    options: string[];
    correctIndex: number;
    chosenIndex: number;
    isCorrect: boolean;
    explanation: string | null;
  }[];
};

type Phase = "gate" | "loading" | "question" | "feedback" | "over";

// ── Component ───────────────────────────────────────────────────────────────
export default function DungeonPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.id;

  const [phase, setPhase] = useState<Phase>("gate");
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Run state
  const [runId, setRunId] = useState<string | null>(null);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  // Question state
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Summary
  const [summary, setSummary] = useState<RunSummary | null>(null);

  // Animation refs
  const [shaking, setShaking] = useState(false);
  const [correctFlash, setCorrectFlash] = useState(false);
  const [xpPopup, setXpPopup] = useState<number | null>(null);

  // ── Load categories on mount ──────────────────────────────────────────
  useEffect(() => {
    api.get(`v1/questions/categories?courseId=${courseId}`)
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [courseId]);

  // Inject CSS for shake animation to avoid Turbopack styled-jsx bugs
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ── Start a run ───────────────────────────────────────────────────────
  const startRun = useCallback(async () => {
    setPhase("loading");
    try {
      const { data: run } = await api.post("v1/dungeon/start", {
        courseId,
        category: selectedCategory || undefined,
      });
      setRunId(run.id);
      setLives(run.livesRemaining);
      setScore(0);
      setStreak(0);
      setQuestionCount(0);
      setSummary(null);
      // Fetch first question
      const { data } = await api.get(`v1/dungeon/${run.id}/next`);
      if (data.done) {
        setPhase("over");
        return;
      }
      setQuestion(data.question);
      setSelectedOption(null);
      setFeedback(null);
      setPhase("question");
    } catch {
      setPhase("gate");
    }
  }, [courseId, selectedCategory]);

  // ── Submit answer ─────────────────────────────────────────────────────
  const submitAnswer = useCallback(async () => {
    if (!runId || !question || selectedOption === null || submitting) return;
    setSubmitting(true);
    try {
      const { data: fb } = await api.post(`v1/dungeon/${runId}/answer`, {
        questionId: question.id,
        optionIndex: selectedOption,
      });
      setFeedback(fb);
      setLives(fb.livesRemaining);
      setScore(fb.score);
      setStreak(fb.streak);
      setQuestionCount((c) => c + 1);

      if (fb.isCorrect) {
        setCorrectFlash(true);
        setXpPopup(fb.xpEarned);
        setTimeout(() => { setCorrectFlash(false); setXpPopup(null); }, 1200);
      } else {
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
      }

      setPhase("feedback");
    } finally {
      setSubmitting(false);
    }
  }, [runId, question, selectedOption, submitting]);

  // ── Continue to next question ─────────────────────────────────────────
  const continueToNext = useCallback(async () => {
    if (!runId) return;
    if (feedback?.isRunOver) {
      // Load summary
      try {
        const { data } = await api.get(`v1/dungeon/${runId}/summary`);
        setSummary(data);
      } catch { /* ignore */ }
      setPhase("over");
      return;
    }

    setPhase("loading");
    try {
      const { data } = await api.get(`v1/dungeon/${runId}/next`);
      if (data.done) {
        try {
          const { data: summ } = await api.get(`v1/dungeon/${runId}/summary`);
          setSummary(summ);
        } catch { /* ignore */ }
        setPhase("over");
        return;
      }
      setQuestion(data.question);
      setSelectedOption(null);
      setFeedback(null);
      setPhase("question");
    } catch {
      setPhase("over");
    }
  }, [runId, feedback]);

  // ── Back to course ────────────────────────────────────────────────────
  const goBack = () => router.push(`/course/${courseId}/battles`);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <EnergyBackground className="h-dvh w-full flex flex-col overflow-hidden" variant="battle">
      <div className={cn("flex-1 flex flex-col min-h-0", shaking && "animate-shake")}>

        {/* ── GATE: Topic Selection ──────────────────────────────────── */}
        {phase === "gate" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            <button onClick={goBack} className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>

            {/* Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 mb-4">
                <Skull size={14} className="text-red-400" />
                <span className="text-red-400 font-display text-[10px] uppercase tracking-[.3em]">Practice Dungeon</span>
              </div>
              <h1 className="font-display text-3xl text-white tracking-tight mb-2">Enter the Dungeon</h1>
              <p className="text-white/40 text-sm max-w-xs">Survive as long as you can. You get <strong className="text-red-400">3 lives</strong>. Wrong answers are fatal.</p>
            </div>

            {/* Category Selection */}
            <div className="w-full max-w-sm space-y-3 mb-8 max-h-[40vh] overflow-y-auto styled-scrollbar pr-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 shrink-0",
                  !selectedCategory
                    ? "border-red-500/60 bg-red-500/15 text-white shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                    : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/70"
                )}
              >
                <Target size={16} className={!selectedCategory ? "text-red-400" : "text-white/30"} />
                <span className="font-display text-sm uppercase tracking-wider">All Topics</span>
                <span className="ml-auto text-xs text-white/30">{categories.reduce((s, c) => s + c.count, 0)} Q</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 shrink-0",
                    selectedCategory === cat.category
                      ? "border-red-500/60 bg-red-500/15 text-white shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                      : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/70"
                  )}
                >
                  <BookOpen size={16} className={selectedCategory === cat.category ? "text-red-400" : "text-white/30"} />
                  <span className="font-display text-sm uppercase tracking-wider">{cat.category}</span>
                  <span className="ml-auto text-xs text-white/30">{cat.count} Q</span>
                </button>
              ))}
            </div>

            {/* Descend button */}
            <button
              onClick={startRun}
              className="group relative px-8 py-3 rounded-xl font-display text-sm uppercase tracking-[.2em] text-white
                         bg-gradient-to-r from-red-600 to-red-500 border border-red-400/30
                         hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Skull size={16} />
                Descend
              </span>
            </button>
          </div>
        )}

        {/* ── LOADING ────────────────────────────────────────────────── */}
        {phase === "loading" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="font-display text-white/30 text-xs uppercase tracking-[.3em]">Descending…</p>
            </div>
          </div>
        )}

        {/* ── QUESTION / FEEDBACK ────────────────────────────────────── */}
        {(phase === "question" || phase === "feedback") && question && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top bar */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <button onClick={goBack} className="text-white/40 hover:text-white transition-colors">
                <ArrowLeft size={18} />
              </button>

              {/* Lives */}
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    size={18}
                    fill={i < lives ? "#ef4444" : "transparent"}
                    className={cn(
                      "transition-all duration-300",
                      i < lives ? "text-red-500" : "text-white/10",
                      i === lives && feedback && !feedback.isCorrect && "animate-pulse"
                    )}
                  />
                ))}
              </div>

              {/* Score + Streak */}
              <div className="flex items-center gap-3">
                {streak > 1 && (
                  <div className="flex items-center gap-1 text-amber-400">
                    <Flame size={14} />
                    <span className="font-display text-xs">{streak}x</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-white/60">
                  <Zap size={14} className="text-amber-400" />
                  <span className="font-mono text-sm font-bold">{score}</span>
                </div>
              </div>
            </div>

            {/* Question counter + difficulty */}
            <div className="shrink-0 flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-white/30 font-display text-[10px] uppercase tracking-[.3em]">
                Q{questionCount + (phase === "question" ? 1 : 0)} • {question.difficulty}
              </span>
              {question.category && (
                <span className="text-white/20 text-[10px] uppercase tracking-wider">{question.category}</span>
              )}
            </div>

            {/* XP popup */}
            {xpPopup && (
              <div className="absolute top-16 right-4 z-50 animate-bounce">
                <span className="font-display text-sm text-amber-400 font-bold">+{xpPopup} XP</span>
              </div>
            )}

            {/* Question body */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="max-w-md mx-auto">
                {/* Prompt */}
                <div className="mb-6 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-white text-base leading-relaxed">{question.prompt}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {question.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isFeedbackPhase = phase === "feedback" && feedback;
                    const isCorrectOption = isFeedbackPhase && idx === feedback!.correctIndex;
                    const isWrongChoice = isFeedbackPhase && isSelected && !feedback!.isCorrect;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (phase === "question") setSelectedOption(idx);
                        }}
                        disabled={phase === "feedback"}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 relative",
                          // Default state
                          !isFeedbackPhase && !isSelected && "border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]",
                          // Selected (pre-submit)
                          !isFeedbackPhase && isSelected && "border-red-500/60 bg-red-500/10 text-white ring-1 ring-red-500/30",
                          // Feedback: correct answer
                          isCorrectOption && "border-emerald-500/60 bg-emerald-500/10 text-emerald-300",
                          // Feedback: wrong choice
                          isWrongChoice && "border-red-500/60 bg-red-500/10 text-red-300 line-through",
                          // Feedback: other options
                          isFeedbackPhase && !isCorrectOption && !isWrongChoice && "border-white/[0.04] bg-white/[0.01] text-white/20",
                        )}
                      >
                        <span className="flex items-start gap-3">
                          <span className={cn(
                            "shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-display",
                            isCorrectOption ? "bg-emerald-500/20 text-emerald-400" :
                            isWrongChoice ? "bg-red-500/20 text-red-400" :
                            isSelected ? "bg-red-500/20 text-red-400" :
                            "bg-white/[0.06] text-white/40"
                          )}>
                            {"ABCD"[idx]}
                          </span>
                          <span className="flex-1">{option}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit button (question phase) */}
                {phase === "question" && (
                  <button
                    onClick={submitAnswer}
                    disabled={selectedOption === null || submitting}
                    className={cn(
                      "w-full mt-6 py-3 rounded-xl font-display text-sm uppercase tracking-[.2em] transition-all duration-200",
                      selectedOption !== null
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white border border-red-400/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-[0.98]"
                        : "bg-white/[0.04] text-white/20 border border-white/[0.06] cursor-not-allowed"
                    )}
                  >
                    {submitting ? "…" : "Lock In"}
                  </button>
                )}

                {/* Feedback panel */}
                {phase === "feedback" && feedback && (
                  <div className="mt-6 space-y-4">
                    {/* Correct/Wrong banner */}
                    <div className={cn(
                      "px-4 py-3 rounded-xl border flex items-center gap-3",
                      feedback.isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-red-500/30 bg-red-500/10"
                    )}>
                      {feedback.isCorrect ? (
                        <>
                          <Zap size={18} className="text-emerald-400" />
                          <span className="text-emerald-300 font-display text-sm uppercase tracking-wider">Correct</span>
                          <span className="ml-auto text-amber-400 font-mono text-sm font-bold">+{feedback.xpEarned} XP</span>
                        </>
                      ) : (
                        <>
                          <Skull size={18} className="text-red-400" />
                          <span className="text-red-300 font-display text-sm uppercase tracking-wider">Wrong</span>
                          <span className="ml-auto text-red-400/60 font-mono text-sm">-1 Life</span>
                        </>
                      )}
                    </div>

                    {/* Explanation */}
                    {feedback.explanation && (
                      <div className="px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen size={14} className="text-amber-400" />
                          <span className="text-amber-400 font-display text-[10px] uppercase tracking-[.3em]">Explanation</span>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">{feedback.explanation}</p>
                      </div>
                    )}

                    {/* Continue button */}
                    <button
                      onClick={continueToNext}
                      className="w-full py-3 rounded-xl font-display text-sm uppercase tracking-[.2em]
                                 bg-white/[0.06] text-white border border-white/[0.1] hover:bg-white/[0.1] transition-all active:scale-[0.98]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {feedback.isRunOver ? "View Results" : "Continue"}
                        <ChevronRight size={16} />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── RUN OVER ──────────────────────────────────────────────── */}
        {phase === "over" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            <div className="text-center max-w-sm">
              {/* Death icon */}
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                <Skull size={36} className="text-red-400" />
              </div>

              <h2 className="font-display text-2xl text-white tracking-tight mb-2">Dungeon Run Over</h2>
              <p className="text-white/40 text-sm mb-8">Your consciousness has been ejected from the dungeon.</p>

              {/* Stats grid */}
              {summary && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <StatCard icon={Target} label="Questions" value={summary.questionsAnswered} />
                  <StatCard icon={Shield} label="Accuracy" value={`${summary.accuracy}%`} accent={summary.accuracy >= 70 ? "emerald" : "red"} />
                  <StatCard icon={Flame} label="Best Streak" value={summary.bestStreak} accent="amber" />
                  <StatCard icon={Zap} label="XP Earned" value={summary.score} accent="amber" />
                </div>
              )}

              {/* Question review */}
              {summary && summary.questions.length > 0 && (
                <div className="mb-8 text-left">
                  <h3 className="font-display text-xs text-white/30 uppercase tracking-[.3em] mb-3">Question Review</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {summary.questions.map((q, i) => (
                      <div key={i} className={cn(
                        "px-3 py-2 rounded-lg border text-sm",
                        q.isCorrect
                          ? "border-emerald-500/20 bg-emerald-500/5 text-white/70"
                          : "border-red-500/20 bg-red-500/5 text-white/70"
                      )}>
                        <div className="flex items-start gap-2">
                          <span className={cn("shrink-0 mt-0.5", q.isCorrect ? "text-emerald-400" : "text-red-400")}>
                            {q.isCorrect ? "✓" : "✗"}
                          </span>
                          <span className="line-clamp-2">{q.prompt}</span>
                        </div>
                        {!q.isCorrect && (
                          <p className="ml-6 mt-1 text-xs text-white/40">
                            Correct: <span className="text-emerald-400">{q.options[q.correctIndex]}</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={goBack}
                  className="flex-1 py-3 rounded-xl font-display text-sm uppercase tracking-[.15em]
                             bg-white/[0.04] text-white/60 border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                >
                  Exit
                </button>
                <button
                  onClick={() => { setPhase("gate"); setRunId(null); setSummary(null); }}
                  className="flex-1 py-3 rounded-xl font-display text-sm uppercase tracking-[.15em]
                             bg-gradient-to-r from-red-600 to-red-500 text-white border border-red-400/30
                             hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <RotateCcw size={14} />
                    Try Again
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EnergyBackground>
  );
}

// ── Stat card helper ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent = "white" }: {
  icon: any;
  label: string;
  value: string | number;
  accent?: "white" | "red" | "amber" | "emerald";
}) {
  const colors = {
    white: "text-white",
    red: "text-red-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <Icon size={16} className={cn("mb-1", colors[accent])} />
      <p className={cn("font-mono text-lg font-bold", colors[accent])}>{value}</p>
      <p className="text-white/30 text-[10px] font-display uppercase tracking-wider">{label}</p>
    </div>
  );
}
