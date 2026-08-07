"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Search, Radar, Crosshair, User, AlertCircle, ChevronLeft } from "lucide-react";
import { useAsyncDuel, OpponentSearchMember } from "@verse/arena-web/hooks/useAsyncDuel";

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
                        initiateChallenge(target.id);
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
        createChallenge(opponentId, 10, 20)
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
                <div className="absolute inset-0 pointer-events-none bg-[url('/scanlines.png')] opacity-20 z-50"></div>
                
                <div className="text-center space-y-8 relative z-10 w-full max-w-sm">
                    {randomScanning ? (
                        <div className="space-y-6 animate-pulse">
                            <Radar className="w-24 h-24 text-primary mx-auto animate-spin-slow" />
                            <div className="space-y-2">
                                <h2 className="font-display text-2xl text-primary tracking-[0.2em] uppercase">Scanning Sectors</h2>
                                <p className="font-mono text-xs text-primary/50 tracking-widest">Uplink established... searching for targets...</p>
                            </div>
                            
                            {scannedOpponents.length > 0 && (
                                <div className="mt-8 border border-primary/20 bg-primary/5 p-4 rounded-xl flex items-center justify-center gap-4 opacity-50 blur-[1px]">
                                    <img src={dicebearUrl(scannedOpponents[scanIndex].username)} alt="scanned" className="w-12 h-12 rounded-lg opacity-80" />
                                    <span className="font-mono text-primary truncate">{scannedOpponents[scanIndex].username}</span>
                                </div>
                            )}
                        </div>
                    ) : lockedOpponent ? (
                        <div className="space-y-6 animate-in zoom-in duration-500">
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="absolute inset-0 border-2 border-red-500 rounded-xl animate-ping opacity-20"></div>
                                <div className="absolute inset-0 border-2 border-red-500 rounded-xl flex items-center justify-center bg-red-500/10 backdrop-blur-sm">
                                    <img src={dicebearUrl(lockedOpponent.username)} alt="target" className="w-24 h-24 rounded-lg" />
                                </div>
                                <Crosshair className="absolute -top-4 -right-4 w-10 h-10 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="font-display text-3xl text-red-500 tracking-[0.2em] uppercase animate-pulse">Target Locked</h2>
                                <p className="font-mono text-xl text-white">{lockedOpponent.username}</p>
                                <p className="font-mono text-xs text-red-500/70 tracking-widest uppercase mt-4">Initiating sequence...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
                            <h2 className="font-display text-xl text-yellow-500 tracking-widest uppercase">No Targets Found</h2>
                            <button 
                                onClick={() => router.back()}
                                className="font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest"
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
        <div className="min-h-screen w-full bg-black pb-40">
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
                    <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
                        <ChevronLeft size={16} />
                    </div>
                </button>
                <div className="flex-1">
                    <p className="text-[12px] font-mono font-bold text-white uppercase tracking-widest">Fighter_Search</p>
                </div>
                <Crosshair className="w-5 h-5 text-primary opacity-50" />
            </header>

            <main className="max-w-md mx-auto px-4 pt-8 space-y-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-primary/50 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by alias..."
                        className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-4 pl-12 pr-4 text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/10 transition-all"
                    />
                </div>

                <div className="space-y-3">
                    {loading && (
                        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest text-center py-8 animate-pulse">
                            Scanning registry...
                        </p>
                    )}
                    
                    {!loading && query.length >= 2 && results.length === 0 && (
                        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest text-center py-8">
                            No matching fighters found.
                        </p>
                    )}

                    {!loading && results.map((opponent) => (
                        <div key={opponent.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all">
                            <div className="flex items-center gap-4">
                                <img src={dicebearUrl(opponent.username)} alt={opponent.username} className="w-12 h-12 rounded-xl bg-black" />
                                <div>
                                    <p className="font-mono font-bold text-white">{opponent.username}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-mono text-white/40 uppercase">Rank: {opponent.rank}</span>
                                        <span className="text-[10px] font-mono text-primary/60 uppercase">Win: {opponent.winRate}%</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => initiateChallenge(opponent.id)}
                                disabled={loading}
                                className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 font-mono text-[10px] uppercase tracking-wider font-bold hover:bg-primary hover:text-black transition-all disabled:opacity-50"
                            >
                                Challenge
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
