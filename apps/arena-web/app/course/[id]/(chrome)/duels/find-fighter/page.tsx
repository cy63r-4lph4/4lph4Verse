"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Search, Radar, Crosshair, User, AlertCircle, ChevronLeft, BookOpen, Tag } from "lucide-react";
import { useAsyncDuel, OpponentSearchMember } from "@verse/arena-web/hooks/useAsyncDuel";
import { api } from "@verse/arena-web/lib/api";
import { cn } from "@verse/ui";

function dicebearUrl(name: string) {
    return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

export default function FindFighterPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const courseId = params.id;
    const isRandomMode = searchParams.get("random") === "1";
    const topic = searchParams.get("topic");

    const { searchOpponents, createChallenge } = useAsyncDuel(courseId);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<OpponentSearchMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [randomScanning, setRandomScanning] = useState(isRandomMode);
    const [lockedOpponent, setLockedOpponent] = useState<OpponentSearchMember | null>(null);
    const [scannedOpponents, setScannedOpponents] = useState<OpponentSearchMember[]>([]);
    const [scanIndex, setScanIndex] = useState(0);

    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [topics, setTopics] = useState<{ category: string, count: number }[]>([]);
    const [topicsLoading, setTopicsLoading] = useState(true);
    const [showTopicModal, setShowTopicModal] = useState<string | null>(null);

    useEffect(() => {
        if (!courseId) return;
        setTopicsLoading(true);
        api
            .get<{ category: string, count: number }[]>(`/v1/questions/categories?courseId=${courseId}`)
            .then((res) => setTopics(Array.isArray(res.data) ? res.data : []))
            .catch(() => setTopics([]))
            .finally(() => setTopicsLoading(false));
    }, [courseId]);

    // Debounced manual search
    useEffect(() => {
        if (randomScanning || isRandomMode) return;
        
        const handler = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                const res = await searchOpponents(query);
                setResults(res);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [query, searchOpponents, randomScanning, isRandomMode]);

    // Random Matchmaking Flow
    useEffect(() => {
        if (!isRandomMode) return;

        let mounted = true;

        async function doRandomMatch() {
            setRandomScanning(true);
            const opponents = await searchOpponents(":random:");
            
            if (!mounted) return;

            if (opponents.length === 0) {
                setRandomScanning(false);
                setLockedOpponent(null);
                return;
            }

            setScannedOpponents(opponents);

            // Simulate rapid scanning through opponents
            let flips = 0;
            const maxFlips = 15;
            const flipInterval = setInterval(() => {
                if (!mounted) return clearInterval(flipInterval);
                setScanIndex(Math.floor(Math.random() * opponents.length));
                flips++;
                if (flips >= maxFlips) {
                    clearInterval(flipInterval);
                    // Lock on one
                    const target = opponents[Math.floor(Math.random() * opponents.length)];
                    setLockedOpponent(target);
                    setRandomScanning(false);
                    
                    // Trigger challenge automatically after lock-on
                    setTimeout(() => {
                        if (!mounted) return;
                        setShowTopicModal(target.id);
                    }, 1500);
                }
            }, 150);
        }

        doRandomMatch();

        return () => {
            mounted = false;
        };
    }, [isRandomMode, searchOpponents]);

    const initiateChallenge = (opponentId: string) => {
        setLoading(true);
        setShowTopicModal(null);
        createChallenge(opponentId, 10, 20, selectedTopic || undefined)
            .then((showdown) => {
                router.push(`/course/${courseId}/async-duel/${showdown.id}`);
            })
            .catch((err) => {
                console.error("Challenge failed", err);
                setLoading(false);
            });
    };

    if (isRandomMode) {
        return (
            <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Advanced Grid & Glow Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d41a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d41a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full z-0"></div>
                
                <div className="text-center space-y-12 relative z-10 w-full max-w-lg">
                    {randomScanning ? (
                        <div className="space-y-12 animate-in fade-in duration-700">
                            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 border-[4px] border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin-slow"></div>
                                <div className="absolute inset-4 border-[2px] border-cyan-500/20 border-b-cyan-300 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                                <Radar className="w-16 h-16 text-cyan-400 animate-pulse" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="font-display text-4xl text-cyan-400 font-black tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">Scanning</h2>
                                <p className="font-mono text-xs text-cyan-400/60 tracking-[0.4em] uppercase">Locking onto active targets</p>
                            </div>
                            
                            {scannedOpponents.length > 0 && (
                                <div className="mt-12 mx-auto w-64 h-24 border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md rounded-2xl flex items-center justify-center gap-6 overflow-hidden relative shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-[shimmer_1s_infinite]"></div>
                                    <img src={dicebearUrl(scannedOpponents[scanIndex].username)} alt="scanned" className="w-16 h-16 rounded-xl border border-cyan-500/50 shadow-lg relative z-10" />
                                    <span className="font-mono text-cyan-100 text-lg uppercase tracking-widest relative z-10 w-24 truncate text-left">{scannedOpponents[scanIndex].username}</span>
                                </div>
                            )}
                        </div>
                    ) : lockedOpponent ? (
                        <div className="space-y-12 animate-in zoom-in duration-500">
                            <div className="relative w-64 h-64 mx-auto">
                                <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
                                <div className="absolute inset-4 border-2 border-red-500/50 rounded-full flex items-center justify-center bg-red-950/40 backdrop-blur-md shadow-[0_0_50px_rgba(239,68,68,0.4)]">
                                    <img src={dicebearUrl(lockedOpponent.username)} alt="target" className="w-40 h-40 rounded-full border-4 border-red-500 shadow-2xl" />
                                </div>
                                <Crosshair className="absolute -top-8 -right-8 w-16 h-16 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]" />
                                <Crosshair className="absolute -bottom-8 -left-8 w-16 h-16 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]" />
                            </div>
                            <div className="space-y-4 bg-red-950/20 p-6 rounded-3xl border border-red-500/20 backdrop-blur-md">
                                <h2 className="font-display text-4xl text-red-500 font-black tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse">Target Locked</h2>
                                <p className="font-display font-bold text-3xl text-white uppercase tracking-widest">{lockedOpponent.username}</p>
                                <p className="font-mono text-xs text-red-400/80 tracking-[0.4em] uppercase pt-4">Initiating Battle Sequence...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 bg-black/40 p-12 rounded-3xl border border-white/10 backdrop-blur-md">
                            <AlertCircle className="w-24 h-24 text-yellow-500 mx-auto opacity-80" />
                            <h2 className="font-display text-3xl text-yellow-500 font-black tracking-widest uppercase">No Targets</h2>
                            <p className="font-mono text-white/50 text-sm">Sector is empty.</p>
                            <button 
                                onClick={() => router.back()}
                                className="mt-8 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-mono text-sm uppercase tracking-widest rounded-xl transition-all border border-white/10"
                            >
                                Return to Base
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-black relative pb-40 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#06b6d41a,transparent_70%)] z-0"></div>

            <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-cyan-500/20 px-4 h-20 flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-cyan-500/70 hover:text-cyan-400 transition-colors group">
                    <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/20 group-hover:bg-cyan-900/50 group-hover:border-cyan-400/50 transition-all">
                        <ChevronLeft size={20} />
                    </div>
                </button>
                <div className="flex-1">
                    <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-[0.3em]">Global_Registry</p>
                    <h1 className="font-display text-xl text-white font-black tracking-widest uppercase mt-1">Fighter Search</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <Radar className="w-5 h-5 text-cyan-400" />
                </div>
            </header>

            <main className="max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 pt-12 space-y-8 relative z-10">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="w-6 h-6 text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="SEARCH BY ALIAS..."
                        className="w-full bg-cyan-950/20 border border-cyan-500/30 rounded-3xl py-6 pl-16 pr-6 text-white font-display text-lg tracking-widest placeholder:text-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/40 focus:ring-4 focus:ring-cyan-500/10 transition-all backdrop-blur-md uppercase"
                    />
                </div>

                <div className="space-y-4 mt-8">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <Radar className="w-12 h-12 text-cyan-500 animate-spin-slow opacity-50" />
                            <p className="font-mono text-[10px] text-cyan-500/70 uppercase tracking-[0.4em] animate-pulse">
                                Accessing Database...
                            </p>
                        </div>
                    )}
                    
                    {!loading && query.length >= 2 && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-cyan-950/10 rounded-3xl border border-cyan-500/10">
                            <User className="w-12 h-12 text-cyan-500/30" />
                            <p className="font-mono text-[10px] text-cyan-500/50 uppercase tracking-[0.4em] text-center">
                                No registered fighters match query.
                            </p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.map((opponent) => (
                                <div key={opponent.id} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl border border-cyan-500/20 bg-cyan-950/20 hover:border-cyan-400 hover:bg-cyan-900/30 transition-all backdrop-blur-sm group gap-6 sm:gap-4">
                            <div className="flex items-center gap-6 w-full sm:w-auto">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-400/30 transition-colors"></div>
                                    <img src={dicebearUrl(opponent.username)} alt={opponent.username} className="w-20 h-20 rounded-2xl bg-black border-2 border-cyan-500/50 relative z-10" />
                                </div>
                                <div>
                                    <p className="font-display font-black text-2xl text-white uppercase tracking-wider">{opponent.username}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Rank: {opponent.rank}</span>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Win: {opponent.winRate}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTopicModal(opponent.id)}
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-500 text-black font-display font-black text-sm uppercase tracking-widest hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 active:scale-95"
                            >
                                Challenge
                            </button>
                        </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* TOPIC SELECTION MODAL */}
            {showTopicModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
                    <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Radar size={100} className="text-cyan-500" />
                        </div>
                        
                        <div className="relative z-10 space-y-2">
                            <h2 className="font-display text-2xl text-cyan-400 font-black tracking-widest uppercase">Combat Discipline</h2>
                            <p className="font-mono text-xs text-white/50 uppercase tracking-widest">Select an intel category for this duel</p>
                        </div>

                        <div className="relative z-10">
                            {topicsLoading ? (
                                <div className="flex gap-2 flex-wrap">
                                    {[80, 110, 95, 120].map((w, i) => (
                                        <div key={i} className="h-10 rounded-xl bg-white/[0.04] border border-white/5 animate-pulse" style={{ width: w }} />
                                    ))}
                                </div>
                            ) : topics.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {topics.map((t) => {
                                        const active = selectedTopic === t.category;
                                        return (
                                            <button
                                                key={t.category}
                                                onClick={() => setSelectedTopic(active ? null : t.category)}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all active:scale-95 text-left",
                                                    active
                                                        ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                                        : "bg-cyan-950/30 border-cyan-500/20 text-cyan-100 hover:bg-cyan-900/50 hover:border-cyan-400/50"
                                                )}
                                            >
                                                <Tag size={14} className={active ? "text-black" : "text-cyan-500/70"} />
                                                <span className="text-[12px] font-black uppercase tracking-widest">{t.category}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-[10px] font-mono text-white/30 uppercase border border-cyan-500/10 rounded-xl px-4 py-3">
                                    No disciplines available. General combat will be initiated.
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-4 relative z-10">
                            <button
                                onClick={() => setShowTopicModal(null)}
                                className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => initiateChallenge(showTopicModal)}
                                disabled={loading}
                                className="flex-1 px-6 py-4 rounded-xl bg-cyan-500 text-black font-display font-black text-sm uppercase tracking-widest hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <Radar size={16} className="animate-spin" /> : "Initiate Duel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
