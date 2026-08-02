"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAsyncDuel } from "@verse/arena-web/hooks/useAsyncDuel";
import useAuth from "@verse/arena-web/hooks/useAuth";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { ArrowLeft, Check, Clock, Swords, Trophy, X, Loader2 } from "lucide-react";
import { cn } from "@verse/ui";

export default function AsyncDuelPage() {
  const router = useRouter();
  const { id: courseId, showdownId } = useParams() as { id: string; showdownId: string };
  const { getDuelState, submitAnswers } = useAsyncDuel(courseId);
  const { user } = useAuth();

  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Gameplay State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionNumber: number; optionIndex: number; timeSpentMs: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    loadState();
  }, [showdownId]);

  const loadState = async () => {
    setLoading(true);
    const data = await getDuelState(showdownId);
    setState(data);
    setLoading(false);
  };

  const handleStart = () => {
    setIsPlaying(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    startTimer(state?.showdown?.timeLimitSeconds || 20);
  };

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    questionStartTimeRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAnswer(-1); // timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = async (optionIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeSpentMs = Date.now() - questionStartTimeRef.current;
    
    const questionNumber = state?.matches?.[0]?.questions?.[currentQuestionIndex]?.questionNumber;
    
    const newAnswers = [...answers, { questionNumber, optionIndex, timeSpentMs }];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 < (state?.matches?.[0]?.questions?.length || 0)) {
      setCurrentQuestionIndex(prev => prev + 1);
      startTimer(state?.showdown?.timeLimitSeconds || 20);
    } else {
      // Finished
      setIsSubmitting(true);
      try {
        await submitAnswers(showdownId, newAnswers);
        await loadState(); // reload state to show results
      } catch (e) {
        console.error("Failed to submit", e);
        alert("Failed to submit answers.");
      } finally {
        setIsSubmitting(false);
        setIsPlaying(false);
      }
    }
  };

  if (loading) {
    return (
      <EnergyBackground className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </EnergyBackground>
    );
  }

  if (!state) {
    return (
      <EnergyBackground className="min-h-screen flex items-center justify-center">
        <p className="text-white">Duel not found.</p>
      </EnergyBackground>
    );
  }

  const me = state.participants.find((p: any) => p.arenaUserId === user?.id);
  const opponent = state.participants.find((p: any) => p.arenaUserId !== user?.id);
  const isComplete = me?.completedAt && opponent?.completedAt;
  const isMyTurn = !me?.completedAt;
  const iAmWinner = state.showdown.championId === me?.id;
  const opponentIsWinner = state.showdown.championId === opponent?.id;
  const isDraw = isComplete && !state.showdown.championId;

  // --- GAMEPLAY VIEW ---
  if (isPlaying && state.matches?.[0]?.questions) {
    const currentQuestion = state.matches[0].questions[currentQuestionIndex];
    return (
      <EnergyBackground className="min-h-screen flex flex-col pb-10">
        <header className="px-4 py-4 flex justify-between items-center border-b border-white/5 bg-black/50">
          <div className="text-[10px] font-mono text-white/50 uppercase">Question {currentQuestionIndex + 1}/{state.matches[0].questions.length}</div>
          <div className="flex items-center gap-2 text-primary font-mono text-xl font-bold">
            <Clock size={16} /> {timeLeft}s
          </div>
        </header>
        
        <main className="flex-1 max-w-md mx-auto w-full px-4 pt-10 flex flex-col">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
            <p className="text-white text-lg font-medium">{currentQuestion?.question?.prompt}</p>
          </div>

          <div className="space-y-3 mt-auto mb-10">
            {currentQuestion?.question?.options?.map((opt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 rounded-xl border border-white/10 bg-black/40 hover:bg-primary/20 hover:border-primary/50 text-white transition-all active:scale-95"
              >
                <span className="font-mono text-primary mr-3 text-xs">{idx + 1}</span>
                {opt}
              </button>
            ))}
          </div>
        </main>
      </EnergyBackground>
    );
  }

  if (isSubmitting) {
    return (
      <EnergyBackground className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
        <p className="text-xs font-mono uppercase tracking-widest text-primary">Submitting Intel...</p>
      </EnergyBackground>
    );
  }

  // --- RESULTS / LOBBY VIEW ---
  return (
    <EnergyBackground className="min-h-screen pb-40">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push(`/course/${courseId}/duels`)}
          className="flex items-center gap-2 text-primary group"
        >
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Hub_Return</span>
        </button>
        <div className="text-right">
          <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Async_Duel</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-8 space-y-8">
        
        {/* VS BANNER */}
        <div className="relative flex items-center justify-between bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-red-500/10 opacity-50" />
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <ArenaAvatar src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${me?.arenaUser?.user?.username}`} size="lg" />
            <span className="text-[10px] font-black uppercase text-white">{me?.arenaUser?.user?.username}</span>
            {me?.completedAt && <span className="text-[12px] font-mono text-primary font-bold">{me?.asyncScore || 0} pts</span>}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <Swords size={24} className="text-white/50 mb-2" />
            <span className="text-[9px] font-mono uppercase text-white/30 tracking-widest">VS</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <ArenaAvatar src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${opponent?.arenaUser?.user?.username}`} size="lg" />
            <span className="text-[10px] font-black uppercase text-white">{opponent?.arenaUser?.user?.username}</span>
            {opponent?.completedAt ? (
               <span className="text-[12px] font-mono text-red-400 font-bold">{opponent?.asyncScore || 0} pts</span>
            ) : (
               <span className="text-[9px] font-mono text-white/30 uppercase mt-1">Pending</span>
            )}
          </div>
        </div>

        {/* STATUS PANEL */}
        <div className="text-center space-y-4">
          {isComplete ? (
            <div className="p-6 rounded-2xl bg-black/50 border border-white/10">
              {iAmWinner && <Trophy size={32} className="mx-auto text-yellow-400 mb-3" />}
              {opponentIsWinner && <X size={32} className="mx-auto text-red-500 mb-3" />}
              {isDraw && <Swords size={32} className="mx-auto text-white/50 mb-3" />}
              
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {iAmWinner ? "Victory!" : (opponentIsWinner ? "Defeat" : "Draw")}
              </h2>
              <p className="text-xs font-mono text-white/50 uppercase mt-2">
                The battle has concluded.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-black/50 border border-white/10">
              <Clock size={24} className="mx-auto text-primary mb-3 animate-pulse" />
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                {isMyTurn ? "Your Move" : "Waiting for Opponent"}
              </h2>
              <p className="text-[10px] font-mono text-white/50 uppercase mt-2">
                {isMyTurn ? "You have not completed this challenge yet." : "Opponent is still strategizing."}
              </p>

              {isMyTurn && (
                <button
                  onClick={handleStart}
                  className="mt-6 w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
                >
                  Start Battle
                </button>
              )}
            </div>
          )}
        </div>

        {/* STATS (only visible if you have completed it) */}
        {me?.completedAt && (
           <div className="space-y-3">
             <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-1">Your Performance</h3>
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                  <span className="block text-2xl font-black text-white">{me?.asyncScore || 0}</span>
                  <span className="text-[9px] font-mono text-white/50 uppercase">Total Score</span>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                  <span className="block text-2xl font-black text-white">{state.matches?.[0]?.questions?.length || 0}</span>
                  <span className="text-[9px] font-mono text-white/50 uppercase">Questions</span>
               </div>
             </div>
           </div>
        )}

      </main>
    </EnergyBackground>
  );
}
