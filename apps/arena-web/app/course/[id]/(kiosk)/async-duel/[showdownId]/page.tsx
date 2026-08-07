"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, Clock, TrendingUp, RotateCcw, Swords, Home, Target, Skull, Zap, PlayCircle, Share2, Video, Hourglass, Bell, BellOff } from "lucide-react";
import { cn } from "@verse/ui";

import useAuth from "@verse/arena-web/hooks/useAuth";
import { useAsyncDuel } from "@verse/arena-web/hooks/useAsyncDuel";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";

function dicebearUrl(name: string) {
    return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

export default function AsyncDuelPage() {
    const params = useParams<{ id: string; showdownId: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const { getDuelState, submitAnswers, acceptChallenge, createChallenge } = useAsyncDuel(params.id);

    const [duelState, setDuelState] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // Gameplay state
    const [activeIndex, setActiveIndex] = useState(0);
    const [answers, setAnswers] = useState<{ questionNumber: number; optionIndex: number; timeSpentMs: number }[]>([]);
    const [questionStartTime, setQuestionStartTime] = useState<number>(0);
    
    const [submitting, setSubmitting] = useState(false);
    const [rematching, setRematching] = useState(false);

    // Start the per-question timer whenever we advance to a new question in gameplay
    useEffect(() => {
        if (duelState?.showdown?.status === 'live' && !duelState?.participants?.find((p: any) => p.arenaUser?.user?.id === user?.id)?.completedAt) {
            setQuestionStartTime(Date.now());
        }
    }, [activeIndex, duelState?.showdown?.status]);

    const duelStateRef = React.useRef<any>(null);

    const fetchState = async () => {
        const state = await getDuelState(params.showdownId);
        duelStateRef.current = state;
        setDuelState(state);
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchState();
        }
        // Poll every 5 seconds if waiting for opponent
        const interval = setInterval(() => {
            const s = duelStateRef.current;
            const myP = s?.participants?.find((p: any) => p.arenaUser?.user?.id === user?.id);
            const opp = s?.participants?.find((p: any) => p.id !== myP?.id);
            const isPending = s?.showdown?.status === 'challenge_pending';
            const isWaiting = s?.showdown?.status === 'live' && myP?.completedAt && !opp?.completedAt;
            if (isPending || isWaiting) {
                fetchState();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [user, params.showdownId]);

    const isWaitingForOpponent = () => {
        if (!duelState || !user) return false;
        const myParticipant = duelState.participants.find((p: any) => p.arenaUser.user.id === user.id);
        const opponent = duelState.participants.find((p: any) => p.id !== myParticipant?.id);
        return myParticipant?.completedAt && !opponent?.completedAt;
    };

    if (loading || !duelState || !user) {
        return (
            <div className="h-dvh w-full bg-black grid place-items-center">
                <p className="font-display text-cyan-500/50 uppercase tracking-[.3em] text-xs animate-pulse">Initializing Async Uplink…</p>
            </div>
        );
    }

    const { showdown, participants, matches } = duelState;
    const myParticipant = participants.find((p: any) => p.arenaUser.user.id === user.id);
    const opponent = participants.find((p: any) => p.id !== myParticipant?.id);
    const match = matches[0];

    const isCreator = showdown.createdBy === myParticipant.arenaUserId;

    const handleAccept = async () => {
        setLoading(true);
        await acceptChallenge(showdown.id);
        await fetchState();
    };

    const handleAnswer = (optionIndex: number) => {
        const timeSpentMs = Date.now() - questionStartTime;
        setAnswers(prev => [...prev, {
            questionNumber: activeIndex + 1,
            optionIndex,
            timeSpentMs
        }]);

        if (activeIndex + 1 < match.questions.length) {
            setActiveIndex(prev => prev + 1);
            setQuestionStartTime(Date.now());
        } else {
            // Done with questions, submit
            submitAndFinish([...answers, { questionNumber: activeIndex + 1, optionIndex, timeSpentMs }]);
        }
    };

    const submitAndFinish = async (finalAnswers: any[]) => {
        setSubmitting(true);
        await submitAnswers(showdown.id, finalAnswers);
        await fetchState();
        setSubmitting(false);
    };

    const handleRematch = async () => {
        if (!opponent) return;
        setRematching(true);
        try {
            const newShowdown = await createChallenge(opponent.arenaUserId, showdown.questionsPerMatch, showdown.timeLimitSeconds);
            router.push(`/course/${params.id}/async-duel/${newShowdown.id}`);
        } catch (e) {
            console.error(e);
            setRematching(false);
        }
    };

    // --- RENDER LOBBY ---
    if (showdown.status === 'challenge_pending') {
        return (
            <EnergyBackground variant="default" className="h-dvh w-full flex flex-col items-center justify-center text-center p-6 bg-cyan-950/20">
                <div className="max-w-sm w-full space-y-8 bg-black/60 p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-md">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center gap-2">
                            <ArenaAvatar src={dicebearUrl(isCreator ? myParticipant.arenaUser.user.username : opponent.arenaUser.user.username)} size="lg" glow glowColor="primary" />
                            <p className="font-mono text-xs text-white uppercase">{isCreator ? myParticipant.arenaUser.user.username : opponent.arenaUser.user.username}</p>
                        </div>
                        <span className="font-display text-cyan-500 font-bold text-xl">VS</span>
                        <div className="flex flex-col items-center gap-2">
                            <ArenaAvatar src={dicebearUrl(!isCreator ? myParticipant.arenaUser.user.username : opponent.arenaUser.user.username)} size="lg" />
                            <p className="font-mono text-xs text-white uppercase">{!isCreator ? myParticipant.arenaUser.user.username : opponent.arenaUser.user.username}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-display text-2xl text-cyan-400 uppercase tracking-widest">Async Challenge</h2>
                        <p className="font-mono text-[10px] text-cyan-400/50 uppercase tracking-[0.2em]">{showdown.questionsPerMatch} Questions • {showdown.timeLimitSeconds}s / Q</p>
                    </div>

                    {isCreator ? (
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <p className="font-mono text-xs text-cyan-300 uppercase tracking-widest animate-pulse">Waiting for {opponent.arenaUser.user.username} to accept...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <button 
                                onClick={handleAccept}
                                className="w-full py-4 rounded-xl bg-cyan-500 text-black font-display font-black text-lg uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                            >
                                Accept Challenge
                            </button>
                            <button 
                                onClick={() => router.push(`/course/${params.id}/battles`)}
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors"
                            >
                                Decline
                            </button>
                        </div>
                    )}
                </div>
            </EnergyBackground>
        );
    }

    // --- RENDER GAMEPLAY ---
    if (showdown.status === 'live' && !myParticipant.completedAt && !submitting) {
        const currentQ = match.questions[activeIndex]?.question;
        
        if (!currentQ) return null;

        return (
            <div className="h-dvh w-full bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-lg space-y-8">
                    <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
                        <p className="font-mono text-xs text-cyan-500 uppercase tracking-widest">Async Match</p>
                        <p className="font-mono text-xs text-white/50 uppercase">Q {activeIndex + 1} / {match.questions.length}</p>
                    </div>

                    <div className="min-h-[120px] flex items-center">
                        <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{currentQ.content}</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {currentQ.options.map((opt: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className="w-full text-left p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all font-medium text-lg active:scale-[0.98]"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (submitting) {
        return (
            <div className="h-dvh w-full bg-black grid place-items-center">
                <p className="font-display text-cyan-500/50 uppercase tracking-[.3em] text-xs animate-pulse">Transmitting Data…</p>
            </div>
        );
    }

    // --- RENDER RESULTS ---
    const bothDone = showdown.status === 'complete' || (myParticipant.completedAt && opponent?.completedAt);
    const isVictory = showdown.championId === myParticipant.id;
    const isDraw = showdown.championId === null && bothDone;
    
    // Calculate stats
    const myScore = match?.scores?.[myParticipant.id] ?? 0;
    const opponentScore = match?.scores?.[opponent.id] ?? 0;
    
    let myCorrect = 0, myTimeMs = 0;
    let oppCorrect = 0, oppTimeMs = 0;
    
    match?.questions?.forEach((q: any) => {
        q.answers?.forEach((a: any) => {
            if (a.participantId === myParticipant.id) {
                if (a.isCorrect) myCorrect++;
                myTimeMs += a.timeSpentMs || 0;
            } else if (a.participantId === opponent.id) {
                if (a.isCorrect) oppCorrect++;
                oppTimeMs += a.timeSpentMs || 0;
            }
        });
    });

    const totalQuestions = showdown.questionsPerMatch;
    const myAccuracy = totalQuestions > 0 ? Math.round((myCorrect / totalQuestions) * 100) : 0;
    const oppAccuracy = totalQuestions > 0 ? Math.round((oppCorrect / totalQuestions) * 100) : 0;

    const formatTime = (ms: number) => {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        return `${m}:${(s % 60).toString().padStart(2, '0')}`;
    };

    const myTimeStr = formatTime(myTimeMs);
    const oppTimeStr = formatTime(oppTimeMs);
    const rankChange = isVictory ? 3 : (isDraw ? 0 : -2);

    return (
        <EnergyBackground variant={!bothDone ? "default" : (isVictory ? "default" : "battle")} className="min-h-screen flex flex-col bg-black overflow-y-auto">
            {/* Header */}
            <div className="text-center pt-10 pb-6 px-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
                    {!bothDone ? (
                        <>
                            <h1 className="font-display text-4xl font-black text-yellow-500" style={{ textShadow: "0 0 30px rgba(234,179,8,0.8)" }}>
                                WAITING...
                            </h1>
                            <div className="flex justify-center mt-3">
                                <Hourglass size={40} className="text-yellow-500 animate-pulse" />
                            </div>
                            <p className="text-white/60 mt-2 text-sm font-mono uppercase tracking-widest">
                                Opponent still battling
                            </p>
                        </>
                    ) : isDraw ? (
                         <>
                            <h1 className="font-display text-5xl font-black text-gray-400" style={{ textShadow: "0 0 30px rgba(156,163,175,0.8)" }}>
                                DRAW
                            </h1>
                            <div className="flex justify-center mt-3">
                                <Swords size={40} className="text-gray-400" />
                            </div>
                        </>
                    ) : isVictory ? (
                        <>
                            <h1 className="font-display text-5xl font-black text-green-500" style={{ textShadow: "0 0 30px rgba(34,197,94,0.8)" }}>
                                VICTORY
                            </h1>
                            <div className="flex justify-center mt-3">
                                <Trophy size={40} className="text-yellow-400 animate-bounce" />
                            </div>
                        </>
                    ) : (
                        <h1 className="font-display text-5xl font-black text-red-500" style={{ textShadow: "0 0 30px rgba(239,68,68,0.8)" }}>
                            DEFEAT
                        </h1>
                    )}
                </motion.div>
            </div>

            {/* Score Comparison */}
            <div className="flex-1 px-6 pb-20">
                <div className="max-w-md mx-auto space-y-6">
                    {/* Player vs Opponent Score */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                        {/* Player */}
                        <div className="flex-1 text-center">
                            <ArenaAvatar src={dicebearUrl(myParticipant.arenaUser.user.username)} size="lg" glow glowColor={isVictory ? "success" : (!bothDone ? "primary" : "danger")} className="mx-auto mb-3" />
                            <p className="font-mono text-xs font-bold text-white truncate uppercase">{myParticipant.arenaUser.user.username}</p>
                            <p className="font-display text-3xl font-black text-cyan-400 mt-1">{myScore}</p>
                        </div>

                        <div className="text-white/30 font-display text-sm font-black italic px-2">VS</div>

                        {/* Opponent */}
                        <div className="flex-1 text-center">
                            <ArenaAvatar src={dicebearUrl(opponent.arenaUser.user.username)} size="lg" glow={bothDone} glowColor={!isVictory && bothDone && !isDraw ? "success" : "danger"} className={cn("mx-auto mb-3", !bothDone && "opacity-50 grayscale")} />
                            <p className="font-mono text-xs font-bold text-white truncate uppercase">{opponent.arenaUser.user.username}</p>
                            <p className="font-display text-3xl font-black text-white/50 mt-1">{bothDone ? opponentScore : '???'}</p>
                        </div>
                    </motion.div>

                    {/* Detailed Stats Comparison */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                        <h3 className="font-display font-semibold text-white/80 text-sm mb-4 flex items-center gap-2 uppercase tracking-widest">
                            <Zap size={16} className="text-cyan-400" />
                            Battle Stats
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Accuracy Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex-1 text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Target size={14} className={bothDone && myAccuracy > oppAccuracy ? "text-green-400" : "text-white/50"} />
                                        <span className={cn("font-mono font-bold", bothDone && myAccuracy > oppAccuracy ? "text-green-400" : "text-white")}>{myAccuracy}%</span>
                                    </div>
                                    <p className="text-[9px] text-white/40 uppercase">{myCorrect}/{totalQuestions} correct</p>
                                </div>
                                <div className="px-4"><p className="text-[10px] text-white/30 font-mono font-bold uppercase tracking-widest">Accuracy</p></div>
                                <div className="flex-1 text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Target size={14} className={bothDone && oppAccuracy > myAccuracy ? "text-green-400" : "text-white/50"} />
                                        <span className={cn("font-mono font-bold", bothDone && oppAccuracy > myAccuracy ? "text-green-400" : "text-white")}>{bothDone ? `${oppAccuracy}%` : '???'}</span>
                                    </div>
                                    <p className="text-[9px] text-white/40 uppercase">{bothDone ? `${oppCorrect}/${totalQuestions} correct` : '-/-'}</p>
                                </div>
                            </div>

                            <div className="border-t border-white/10" />

                            {/* Time Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex-1 text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Clock size={14} className={bothDone && myTimeMs < oppTimeMs ? "text-green-400" : "text-white/50"} />
                                        <span className={cn("font-mono font-bold", bothDone && myTimeMs < oppTimeMs ? "text-green-400" : "text-white")}>{myTimeStr}</span>
                                    </div>
                                </div>
                                <div className="px-4"><p className="text-[10px] text-white/30 font-mono font-bold uppercase tracking-widest">Time</p></div>
                                <div className="flex-1 text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Clock size={14} className={bothDone && oppTimeMs < myTimeMs ? "text-green-400" : "text-white/50"} />
                                        <span className={cn("font-mono font-bold", bothDone && oppTimeMs < myTimeMs ? "text-green-400" : "text-white")}>{bothDone ? oppTimeStr : '???'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Rank Change */}
                    {bothDone && !isDraw && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 rounded-2xl p-4 text-center border border-white/10 backdrop-blur-md">
                            <TrendingUp size={20} className={cn("mx-auto mb-2", rankChange > 0 ? "text-green-500" : "text-red-500")} />
                            <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Rank Change</p>
                            <p className={cn("font-display font-bold text-xl", rankChange > 0 ? "text-green-500" : "text-red-500")}>
                                {rankChange > 0 ? "+" : ""}{rankChange} {rankChange > 0 ? "↑" : "↓"}
                            </p>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-3 pt-4">
                        {!bothDone ? (
                            <>
                                <button
                                    onClick={() => router.push(`/course/${params.id}/battles`)}
                                    className="w-full py-4 rounded-xl bg-cyan-500/20 text-cyan-400 font-display font-black text-lg uppercase tracking-wider hover:bg-cyan-500/30 border border-cyan-500/30 flex items-center justify-center gap-2 transition-all"
                                >
                                    <Bell size={20} />
                                    Return to Hub
                                </button>
                                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest text-center mt-2">You will be notified when they finish.</p>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleRematch}
                                    disabled={rematching}
                                    className="w-full py-4 rounded-xl bg-cyan-500 text-black font-display font-black text-lg uppercase tracking-wider hover:bg-cyan-400 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    <RotateCcw size={20} />
                                    {rematching ? "Challenging..." : "Rematch"}
                                </button>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => router.push(`/course/${params.id}/battles`)}
                                        className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Swords size={16} />
                                        Hub
                                    </button>
                                    <button
                                        onClick={() => router.push(`/course/${params.id}`)}
                                        className="py-3 rounded-xl bg-transparent border border-white/5 text-white/50 font-mono text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Home size={16} />
                                        Home
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </EnergyBackground>
    );
}
