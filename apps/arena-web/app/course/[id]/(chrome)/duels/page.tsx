"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft, Shuffle, Users, Clock, Hammer,
  Flame, Skull, FileText, Target, Zap, Swords, BookOpen
} from "lucide-react";
import { cn } from "@verse/ui";

import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { LiveTournamentBanner, ScheduledTournamentBanner } from "@verse/arena-web/components/ui/TournamentBanners";

import useAuth from "@verse/arena-web/hooks/useAuth";
import { useAsyncDuel } from "@verse/arena-web/hooks/useAsyncDuel";
import { useActiveTournament } from "@verse/arena-web/hooks/useActiveTournament";
import { useScheduledTournament } from "@verse/arena-web/hooks/useScheduledTournament";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

function relativeExpiry(iso?: string | null) {
  if (!iso) return "—";
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs <= 0) return "Expired";
  const hrs = Math.floor(diffMs / 3600000);
  if (hrs < 1) return `${Math.max(1, Math.floor(diffMs / 60000))}m left`;
  if (hrs < 24) return `${hrs}h left`;
  return `${Math.floor(hrs / 24)}d left`;
}

/**
 * Topic-based battles are presentational only for now — the question bank
 * has no topic/tag column and ShowdownService.createAsyncDuelChallenge just
 * pulls a random slice of the course's whole bank. Selecting a discipline
 * here is carried through as a `topic` query param so it's a one-line wire-up
 * once the backend supports filtering; it does nothing today.
 */
const TOPICS = [
  { id: "mechanics", label: "Mechanics", icon: Zap },
  { id: "thermo", label: "Thermodynamics", icon: Flame },
  { id: "waves", label: "Waves", icon: Target },
  { id: "energy", label: "Energy & Work", icon: BookOpen },
];

export default function DuelsHub() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // Same derivation the old QuizSelection used — keeps this page path-agnostic.
  const segments = pathname.split("/").filter(Boolean);
  const courseBasePath = "/" + segments.slice(0, 2).join("/");
  const courseId = segments[1];

  const { getDuelsList } = useAsyncDuel(courseId);
  const activeTournament = useActiveTournament(courseId);
  const scheduledTournament = useScheduledTournament(courseId);

  const [asyncDuels, setAsyncDuels] = useState<any[]>([]);
  const [duelsLoading, setDuelsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [matchmaking, setMatchmaking] = useState(false);

  const loadDuels = useCallback(() => {
    setDuelsLoading(true);
    getDuelsList()
      .then((list: any[]) => setAsyncDuels(Array.isArray(list) ? list : []))
      .finally(() => setDuelsLoading(false));
  }, [getDuelsList]);

  useEffect(() => { loadDuels(); }, [loadDuels]);

  const handleRandomBattle = () => {
    // No random-matchmaking endpoint exists yet. We route to the fighter
    // search page with ?random=1 — that page pulls the real course roster
    // and picks + challenges someone client-side. See find-fighter page.
    setMatchmaking(true);
    const topicParam = selectedTopic ? `&topic=${selectedTopic}` : "";
    router.push(`${courseBasePath}/duels/find-fighter?random=1${topicParam}`);
  };

  const handleFindFighter = () => {
    const topicParam = selectedTopic ? `?topic=${selectedTopic}` : "";
    router.push(`${courseBasePath}/duels/find-fighter${topicParam}`);
  };

  const openDuel = (showdownId: string) => {
    // TODO: build a dedicated async-duel detail/play page. Routing into the
    // hub for now so this doesn't 404.
    router.push(`${courseBasePath}/duels`);
    console.warn(`[DuelsHub] async duel detail page not built yet — showdown ${showdownId}`);
  };

  return (
    <EnergyBackground className="min-h-screen pb-40">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-primary group">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Sector_Exit</span>
        </button>
        <div className="text-right">
          <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Duel_Hub</p>
          <p className="text-[8px] font-mono text-muted-foreground uppercase">Active_Ops: {asyncDuels.length}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">

        {/* TOURNAMENT BANNERS — reuses the same real hooks CourseHome uses */}
        {activeTournament && (
          <LiveTournamentBanner
            title={activeTournament.title}
            courseId={courseId}
            showdownId={activeTournament.id}
            onClick={() => router.push(`${courseBasePath}/duels/tournament/${activeTournament.id}/play`)}
          />
        )}
        {scheduledTournament && (
          <ScheduledTournamentBanner
            title={scheduledTournament.title}
            scheduledAt={scheduledTournament.scheduledAt}
            isOverdue={scheduledTournament.isOverdue}
          />
        )}

        {/* RANDOM ENCOUNTER */}
        <section>
          <button
            onClick={handleRandomBattle}
            disabled={matchmaking}
            className="w-full relative group overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/5 p-5 transition-all active:scale-95 disabled:opacity-60"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Shuffle size={24} className="text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">Random_Encounter</h3>
                <p className="text-[10px] font-mono text-secondary uppercase tracking-widest">
                  {matchmaking ? "Locating Opponent..." : "Auto-Matched Fighter"}
                </p>
              </div>
              <Zap size={16} className="text-secondary animate-pulse" />
            </div>
          </button>
        </section>

        {/* CHALLENGE A FIGHTER */}
        <section>
          <button
            onClick={handleFindFighter}
            className="w-full relative group overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 p-5 transition-all active:scale-95"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Swords size={24} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">Challenge_Fighter</h3>
                <p className="text-[10px] font-mono text-primary uppercase tracking-widest">Search & Send Uplink</p>
              </div>
              <Users size={16} className="text-primary" />
            </div>
          </button>
        </section>

        {/* SUPPORT WINGS — unchanged */}
        <section className="grid grid-cols-2 gap-3">
          <button onClick={() => router.push(`${courseBasePath}/forge`)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="relative">
              <Hammer size={20} className="text-arena-warning" />
              <Flame size={10} className="absolute -top-1 -right-1 text-orange-500 animate-pulse" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/70">The_Forge</span>
          </button>

          <button onClick={() => router.push(`${courseBasePath}/contributions`)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <FileText size={20} className="text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/70">My_Intel</span>
          </button>
        </section>

        {/* PRACTICE DUNGEON — link kept, backend not implemented yet */}
        <section>
          <button onClick={() => router.push(`${courseBasePath}/practice`)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Skull size={20} className="text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-[11px] font-black text-white uppercase">Practice_Dungeon</h4>
              <p className="text-[9px] font-mono text-red-500/60 uppercase">Review_Missed_Data</p>
            </div>
          </button>
        </section>

        {/* TOPIC-BASED BATTLES — new, presentational until the backend can filter by topic */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <BookOpen size={12} className="text-primary" />
            <span className="text-[10px] font-mono text-primary/50 uppercase tracking-[0.3em]">Combat_Disciplines</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              const active = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(active ? null : t.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                    active ? "bg-primary border-primary text-black" : "bg-transparent border-white/10 text-white/40 hover:text-white"
                  )}
                >
                  <Icon size={11} />
                  {t.label}
                </button>
              );
            })}
          </div>
          {selectedTopic && (
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest px-1">
              Discipline locked in — carries through to your next challenge.
            </p>
          )}
        </section>

        {/* ACTIVE CONTRACTS — real async duels this user is a participant in */}
        <section className="space-y-3 pb-10">
          <div className="flex items-center gap-2 px-1">
            <Target size={12} className="text-primary" />
            <span className="text-[10px] font-mono text-primary/50 uppercase tracking-[0.3em]">Active_Contracts</span>
          </div>

          {duelsLoading ? (
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest text-center py-6">Syncing Uplinks...</p>
          ) : asyncDuels.length > 0 ? asyncDuels.map((d) => {
            const myParticipant = d.participants.find((p: any) => p.arenaUser?.user?.id === user?.id);
            const opp = d.participants.find((p: any) => p.id !== myParticipant?.id);
            const oppName = opp?.arenaUser?.user?.username ?? "Unknown";
            const isComplete = d.status === "complete";
            const waitingOnMe = !isComplete && myParticipant && !myParticipant.completedAt;

            return (
              <button
                key={d.id}
                onClick={() => openDuel(d.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-l-4 border border-white/5 transition-all active:scale-[0.98]",
                  isComplete
                    ? "border-l-white/20 bg-white/[0.02]"
                    : waitingOnMe
                      ? "border-l-arena-danger/60 bg-arena-danger/5"
                      : "border-l-arena-warning/50 bg-arena-warning/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <ArenaAvatar src={dicebearUrl(oppName)} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-black text-white uppercase truncate">vs {oppName}</h3>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase mt-1">
                      {isComplete ? "Resolved" : waitingOnMe ? "Awaiting your move" : "Waiting on opponent"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-white/30">
                    <div className="flex items-center gap-1"><Clock size={10} /><span>{relativeExpiry(d.expiresAt)}</span></div>
                  </div>
                </div>
              </button>
            );
          }) : (
            <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-xs font-mono text-muted-foreground uppercase">No active duels — challenge someone</p>
            </div>
          )}
        </section>
      </main>
    </EnergyBackground>
  );
}