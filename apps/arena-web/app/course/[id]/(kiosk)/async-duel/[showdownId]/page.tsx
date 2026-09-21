"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, Clock, TrendingUp, RotateCcw, Swords, Home, Target, Skull, Zap, PlayCircle, Share2, Video, Hourglass, Bell, BellOff, BookOpen } from "lucide-react";
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
            <div className="h-dvh w-full bg-black relative flex flex-col items-center justify-center text-center p-6 overflow-hidden">
                {/* Dynamic Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d41a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d41a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                
                {/* Floating VS Layout */}
                <div className="w-full max-w-lg md:max-w-4xl z-10 space-y-12">
                    <div className="space-y-4 mb-8">
                        <div className={cn("inline-block px-4 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-[0.3em] backdrop-blur-md", showdown.isRanked === false ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400")}>
                            {showdown.isRanked === false ? "Simulation Initiated" : "Async Match Initiated"}
                        </div>
                        <p className="font-mono text-xs text-white/40 uppercase tracking-[0.2em]">{showdown.questionsPerMatch} Questions • {showdown.timeLimitSeconds}s / Q</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-0">
                        {/* Connecting lightning line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent -translate-y-1/2 z-0"></div>
                        <div className="md:hidden absolute top-0 left-1/2 h-full w-[2px] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent -translate-x-1/2 z-0"></div>

                        {/* Player 1 */}
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="flex flex-col items-center gap-4 z-10"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
                                <ArenaAvatar src={dicebearUrl(isCreator ? myParticipant.arenaUser.user.username : opponent.arenaUser.user.username)} size="2xl" glow glowColor="primary" className="border-4 border-cyan-950 shadow-2xl" />
                            </div>
                            <p className="font-display font-black text-lg text-white uppercase tracking-widest">{isCreator ? myParticipant.arenaUser.user.username : opponent.arenaUser.user.username}</p>
                        </motion.div>

                        {/* VS Badge */}
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="z-20 w-16 h-16 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center flex-shrink-0"
                        >
                            <span className="font-display text-cyan-400 font-black text-2xl italic">VS</span>
                        </motion.div>

                        {/* Player 2 */}
                        <motion.div 
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="flex flex-col items-center gap-4 z-10"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
                                <ArenaAvatar src={dicebearUrl(!isCreator ? myParticipant.arenaUser.user.username : opponent.arenaUser.user.username)} size="2xl" glow glowColor="danger" className="border-4 border-red-950 shadow-2xl" />
                            </div>
                            <p className="font-display font-black text-lg text-white uppercase tracking-widest">{!isCreator ? myParticipant.arenaUser.user.username : opponent.arenaUser.user.username}</p>
                        </motion.div>
                    </div>

                    <div className="pt-8">
                        {isCreator ? (
                            <div className="inline-block p-4 px-8 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md">
                                <p className="font-mono text-sm text-cyan-300 uppercase tracking-[0.2em] animate-pulse">Waiting for {opponent.arenaUser.user.username}...</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-w-xs mx-auto">
                                <button 
                                    onClick={handleAccept}
                                    className="w-full py-4 rounded-xl bg-cyan-500 text-black font-display font-black text-xl uppercase tracking-widest hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all active:scale-95"
                                >
                                    Accept Challenge
                                </button>
                                <button 
                                    onClick={() => router.push(`/course/${params.id}/battles`)}
                                    className="w-full py-3 rounded-xl bg-transparent border border-white/10 text-white/50 font-mono text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    Decline
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER GAMEPLAY ---
    if (showdown.status === 'live' && !myParticipant.completedAt && !submitting) {
        const currentQ = match.questions[activeIndex]?.question;
        
        if (!currentQ) return null;

        return (
            <div className="h-dvh w-full bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-lg md:max-w-3xl space-y-8">
                    <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
                        <p className="font-mono text-xs text-cyan-500 uppercase tracking-widest">
                            {showdown.isRanked === false ? <span className="text-blue-400">Combat Simulation</span> : "Async Match"}
                        </p>
                        <p className="font-mono text-xs text-white/50 uppercase">Q {activeIndex + 1} / {match.questions.length}</p>
                    </div>

                    <div className="min-h-[120px] flex items-center">
                        <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{currentQ.prompt}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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

                    <div className="pt-8 text-center">
                        <button 
                            onClick={() => submitAndFinish(answers)}
                            className="text-red-500/50 hover:text-red-400 font-mono text-[10px] uppercase tracking-widest transition-colors"
                        >
                            [ Surrender Match ]
                        </button>
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
                <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto space-y-6">
                    {/* Player vs Opponent Score */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
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
                    {bothDone && !isDraw && showdown.isRanked !== false && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 rounded-2xl p-4 text-center border border-white/10 backdrop-blur-md">
                            <TrendingUp size={20} className={cn("mx-auto mb-2", rankChange > 0 ? "text-green-500" : "text-red-500")} />
                            <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Rank Change</p>
                            <p className={cn("font-display font-bold text-xl", rankChange > 0 ? "text-green-500" : "text-red-500")}>
                                {rankChange > 0 ? "+" : ""}{rankChange} {rankChange > 0 ? "↑" : "↓"}
                            </p>
                        </motion.div>
                    )}

                    {/* Post-Match Analysis */}
                    {bothDone && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md mt-6 text-left">
                            <h3 className="font-display font-semibold text-white/80 text-sm mb-4 flex items-center gap-2 uppercase tracking-widest">
                                <BookOpen size={16} className="text-cyan-400" />
                                Post-Match Analysis
                            </h3>
                            <div className="space-y-6">
                                {match?.questions?.map((qObj: any, i: number) => {
                                    const q = qObj.question;
                                    const myAnswer = qObj.answers?.find((a: any) => a.participantId === myParticipant.id);
                                    const oppAnswer = qObj.answers?.find((a: any) => a.participantId === opponent.id);
                                    return (
                                        <div key={i} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                                            <p className="font-display font-bold text-sm text-white mb-2">Q{i + 1}: {q.prompt}</p>
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div className="text-[10px] font-mono text-white/50 uppercase">
                                                    You: <span className={cn("font-bold", myAnswer?.isCorrect ? "text-green-400" : "text-red-400")}>{q.options[myAnswer?.optionIndex] ?? "N/A"}</span>
                                                </div>
                                                <div className="text-[10px] font-mono text-white/50 uppercase">
                                                    Opp: <span className={cn("font-bold", oppAnswer?.isCorrect ? "text-green-400" : "text-red-400")}>{q.options[oppAnswer?.optionIndex] ?? "N/A"}</span>
                                                </div>
                                            </div>
                                            {(q.explanation || q.resourceId) && (
                                                <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                                                    {q.explanation && (
                                                        <p className="text-xs text-white/70 font-mono italic mb-2">"{q.explanation}"</p>
                                                    )}
                                                    {q.resourceId && (
                                                        <button 
                                                            onClick={() => router.push(`/course/${params.id}/materials?datapad=${q.resourceId}`)} 
                                                            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors"
                                                        >
                                                            <BookOpen size={12} /> Read Datapad
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-3 pt-4">
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
