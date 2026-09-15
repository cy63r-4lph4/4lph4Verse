"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Target } from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { api } from "@verse/arena-web/lib/api";

type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
};

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const resourceId = params.resourceId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const { data } = await api.get(`v1/questions?courseId=${courseId}&resourceId=${resourceId}`);
        setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, [courseId, resourceId]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    if (idx === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isLoading) {
    return (
      <EnergyBackground className="h-dvh w-full flex items-center justify-center">
        <p className="text-white/50 font-display uppercase tracking-widest animate-pulse">Initializing Intel...</p>
      </EnergyBackground>
    );
  }

  if (questions.length === 0) {
    return (
      <EnergyBackground className="h-dvh w-full flex flex-col items-center justify-center">
        <Target size={48} className="text-cyan-500 mb-4 opacity-50" />
        <h2 className="font-display text-xl text-white uppercase tracking-widest mb-4">No Intel Available</h2>
        <p className="text-white/40 max-w-sm text-center mb-8">
          This datapad does not currently have any associated assessment questions.
        </p>
        <button 
          onClick={() => router.push(`/course/${courseId}/materials?datapad=${resourceId}`)}
          className="px-6 py-2 rounded-xl bg-cyan-500 text-black font-display font-bold uppercase tracking-wide"
        >
          Return to Codex
        </button>
      </EnergyBackground>
    );
  }

  if (isFinished) {
    return (
      <EnergyBackground className="h-dvh w-full flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-black/40 border border-cyan-500/20 backdrop-blur-md rounded-2xl p-8 text-center space-y-6">
          <h2 className="font-display text-3xl font-black text-cyan-400 uppercase tracking-wide">
            Assessment Complete
          </h2>
          <div className="text-white/60">
            You scored <strong className="text-white text-2xl">{score}</strong> out of <strong className="text-white text-2xl">{questions.length}</strong>
          </div>
          <div className="pt-4">
            <button 
              onClick={() => router.push(`/course/${courseId}/materials?datapad=${resourceId}`)}
              className="w-full px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold uppercase tracking-wide transition-colors"
            >
              Return to Codex
            </button>
          </div>
        </div>
      </EnergyBackground>
    );
  }

  return (
    <EnergyBackground className="h-dvh w-full flex flex-col items-center p-6 sm:p-12 overflow-hidden">
      <button 
        onClick={() => router.push(`/course/${courseId}/materials?datapad=${resourceId}`)}
        className="absolute top-6 left-6 text-cyan-500/50 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-2xl flex-1 flex flex-col min-h-0">
        <div className="mb-8 mt-10">
          <div className="flex items-center justify-between text-cyan-500/60 font-mono text-xs mb-4">
            <span>INTEL ASSESSMENT // QUESTION {currentIndex + 1} OF {questions.length}</span>
            <span>SCORE: {score}</span>
          </div>
          <div className="h-1 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-300" 
              style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto styled-scrollbar pb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-10">
            {currentQuestion.prompt}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              let btnClass = "border-white/10 bg-white/5 hover:bg-white/10 text-white/80";
              let icon = null;

              if (hasAnswered) {
                if (idx === currentQuestion.correctIndex) {
                  btnClass = "border-green-500 bg-green-500/20 text-green-100";
                  icon = <CheckCircle2 size={18} className="text-green-400" />;
                } else if (idx === selectedOption) {
                  btnClass = "border-red-500/50 bg-red-500/10 text-red-200 opacity-60";
                  icon = <XCircle size={18} className="text-red-400" />;
                } else {
                  btnClass = "border-white/5 bg-white/[0.02] text-white/30";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4",
                    btnClass
                  )}
                >
                  <div className="font-mono text-xs opacity-50 mt-1">{String.fromCharCode(65 + idx)}.</div>
                  <div className="flex-1 text-sm sm:text-base leading-relaxed">{opt}</div>
                  {icon && <div className="mt-0.5">{icon}</div>}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
              {currentQuestion.explanation && (
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 mb-6">
                  <h4 className="font-display text-xs text-cyan-400 uppercase tracking-widest mb-2">Intel Brief</h4>
                  <p className="text-sm text-cyan-100/70">{currentQuestion.explanation}</p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-white text-black font-display font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                {currentIndex < questions.length - 1 ? "Next Question" : "Complete Assessment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </EnergyBackground>
  );
}
