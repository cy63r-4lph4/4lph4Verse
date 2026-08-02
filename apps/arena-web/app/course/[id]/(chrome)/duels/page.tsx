"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Search, Swords, Users, Clock, Target, Play } from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useAsyncDuel, OpponentSearchMember } from "@verse/arena-web/hooks/useAsyncDuel";
import useAuth from "@verse/arena-web/hooks/useAuth";

type Tab = "ARENA" | "SKIRMISH" | "WARS";

export default function BattlesHub() {
  const router = useRouter();
  const { id: courseId } = useParams() as { id: string };
  const [activeTab, setActiveTab] = useState<Tab>("ARENA");
  const { searchOpponents, createChallenge, getDuelsList } = useAsyncDuel(courseId);
  const { user } = useAuth();

  // Skirmish state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OpponentSearchMember[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isChallenging, setIsChallenging] = useState(false);

  // Arena state
  const [duels, setDuels] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "ARENA") {
      getDuelsList().then(setDuels);
    }
  }, [activeTab, getDuelsList]);

  useEffect(() => {
    if (activeTab === "SKIRMISH" && searchQuery.length >= 2) {
      const delay = setTimeout(() => {
        setIsSearching(true);
        searchOpponents(searchQuery).then(res => {
          setSearchResults(res);
          setIsSearching(false);
        });
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, activeTab, searchOpponents]);

  const handleChallenge = async (opponentId: string) => {
    try {
      setIsChallenging(true);
      const showdown = await createChallenge(opponentId, 3, 20); // 3 questions, 20s each
      router.push(`/course/${courseId}/async-duel/${showdown.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to create challenge.");
      setIsChallenging(false);
    }
  };

  const tabs = [
    { id: "ARENA", label: "Arena", desc: "Active Duels", icon: Swords },
    { id: "SKIRMISH", label: "Skirmish", desc: "Find Opponents", icon: Search },
    { id: "WARS", label: "Wars", desc: "Tournaments", icon: Target },
  ] as const;

  return (
    <EnergyBackground className="min-h-screen pb-40">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => router.push(`/course/${courseId}`)}
          className="flex items-center gap-2 text-primary group"
        >
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Sector_Exit</span>
        </button>
        <div className="text-right">
          <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Battles_Hub</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* TABS */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex-1 flex flex-col items-center py-2 rounded-lg transition-all",
                  isActive ? "bg-primary text-black shadow-lg" : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={16} className={cn("mb-1", isActive ? "animate-pulse" : "")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="mt-4">
          {activeTab === "ARENA" && (
            <div className="space-y-3">
              <p className="text-xs font-mono text-white/50 uppercase tracking-widest">Your Active Duels</p>
              {duels.length > 0 ? duels.map(duel => {
                const me = duel.participants.find((p: any) => p.arenaUserId === user?.id);
                const opponent = duel.participants.find((p: any) => p.arenaUserId !== user?.id);
                const isComplete = me?.completedAt && opponent?.completedAt;
                const isMyTurn = !me?.completedAt;

                return (
                  <button
                    key={duel.id}
                    onClick={() => router.push(`/course/${courseId}/async-duel/${duel.id}`)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-l-4 border border-white/5 transition-all group",
                      isMyTurn ? "border-l-arena-warning bg-arena-warning/5" : "border-l-primary bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <ArenaAvatar src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${opponent?.arenaUser?.user?.username || 'unknown'}`} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-black text-white uppercase truncate">vs {opponent?.arenaUser?.user?.username}</h3>
                        <p className="text-[9px] font-mono text-muted-foreground uppercase mt-1">
                          {isComplete ? "Completed" : (isMyTurn ? "Your turn to play" : "Waiting for opponent")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-white/30">
                        <Clock size={10} />
                      </div>
                    </div>
                  </button>
                );
              }) : (
                <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-xs font-mono text-muted-foreground uppercase">No active duels</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "SKIRMISH" && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="SEARCH OPPONENTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-3">
                {isSearching ? (
                  <p className="text-xs font-mono text-white/30 uppercase text-center py-4">Scanning Sector...</p>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <ArenaAvatar src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.username}`} size="sm" />
                        <div>
                          <p className="text-xs font-black text-white uppercase">{user.username}</p>
                          <p className="text-[9px] font-mono text-white/40 uppercase">Rank {user.rank} • {user.winRate}% WR</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleChallenge(user.id)}
                        disabled={isChallenging}
                        className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black transition-all disabled:opacity-50"
                      >
                        <Swords size={16} />
                      </button>
                    </div>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <p className="text-xs font-mono text-white/30 uppercase text-center py-4">No targets found</p>
                ) : (
                  <p className="text-xs font-mono text-white/30 uppercase text-center py-4">Enter callsign to search</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "WARS" && (
            <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
              <Target size={24} className="mx-auto text-white/20 mb-2" />
              <p className="text-xs font-black text-white uppercase">Tournaments</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">No active wars in this sector</p>
            </div>
          )}
        </div>
      </main>
    </EnergyBackground>
  );
}