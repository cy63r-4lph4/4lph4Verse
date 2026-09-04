"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Plus, Crown, Users, Radio, CircleDot, ChevronRight, X, Check } from "lucide-react";
import { cn } from "@verse/ui";
import { useTournaments } from "@verse/arena-web/hooks/useTournaments";
import { useCreateTournament } from "@verse/arena-web/hooks/useCreateTournament";

const STATUS_CFG: Record<string, { label: string; dot: string; text: string; border: string; bg: string }> = {
  draft:    { label: "Draft",       dot: "bg-white/20",    text: "text-white/40",    border: "border-white/[0.07]",     bg: "bg-white/[0.02]" },
  lobby:    { label: "Lobby Open",  dot: "bg-sky-400",     text: "text-sky-400",     border: "border-sky-500/20",       bg: "bg-sky-500/[0.04]" },
  seeding:  { label: "Seeding",     dot: "bg-amber-400",   text: "text-amber-400",   border: "border-amber-500/20",     bg: "bg-amber-500/[0.04]" },
  live:     { label: "Live",        dot: "bg-red-500",     text: "text-red-400",     border: "border-red-500/20",       bg: "bg-red-500/[0.04]" },
  complete: { label: "Complete",    dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/20",   bg: "bg-emerald-500/[0.04]" },
};

function TournamentCard({ tournament, courseId, onManage }: {
  tournament: any;
  courseId: string;
  onManage: () => void;
}) {
  const cfg = STATUS_CFG[tournament.status] ?? STATUS_CFG.draft;
  const isLive = ["lobby", "seeding", "live"].includes(tournament.status);

  return (
    <div className={cn("rounded-2xl border p-4 transition-all hover:scale-[1.005]", cfg.border, cfg.bg)}>
      {/* Top line for active */}
      {isLive && (
        <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-red-500/50 via-orange-400/25 to-transparent rounded-t-2xl" />
      )}

      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          {tournament.status === "complete"
            ? <Crown size={18} className="text-amber-400" />
            : <Trophy size={18} className="text-amber-400" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-display text-[13px] font-black text-white uppercase tracking-wide truncate">{tournament.title}</p>
            <span className={cn("flex items-center gap-1 shrink-0 font-display text-[8px] font-black uppercase tracking-wider", cfg.text)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} style={isLive ? { animation: "pulse 1.5s ease-in-out infinite" } : undefined} />
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
              <Users size={10} /> {tournament.participantCount} fighters
            </span>
            {tournament.currentRound > 0 && (
              <span className="flex items-center gap-1.5 font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
                <CircleDot size={10} /> Round {tournament.currentRound}{tournament.totalRounds ? `/${tournament.totalRounds}` : ""}
              </span>
            )}
            {tournament.questionsPerMatch && (
              <span className="font-display text-[9px] font-bold text-white/20 uppercase tracking-wider">
                {tournament.questionsPerMatch}Q per match
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onManage}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] font-display text-[9px] font-black text-white/60 uppercase tracking-wider transition-all"
        >
          {isLive ? "Control" : "View"}
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

function CreateForm({ courseId, onSuccess, onCancel }: { courseId: string; onSuccess: () => void; onCancel: () => void }) {
  const create = useCreateTournament(courseId);
  const [title, setTitle] = useState("");
  const [qPerMatch, setQPerMatch] = useState(5);
  const [timeLimit, setTimeLimit] = useState(30);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await create.mutateAsync({ title: title.trim(), questionsPerMatch: qPerMatch, timeLimitSeconds: timeLimit });
    onSuccess();
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-[11px] font-black text-white uppercase tracking-[.25em]">Launch New Tournament</p>
        <button onClick={onCancel}><X size={14} className="text-white/30 hover:text-white/60 transition-colors" /></button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Tournament Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Week 5 Championship"
            className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[11px] font-display font-bold outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Questions / Match</label>
            <div className="flex items-center gap-2">
              {[3, 5, 7, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setQPerMatch(n)}
                  className={cn(
                    "flex-1 py-2 rounded-xl border font-display text-[10px] font-black transition-all",
                    qPerMatch === n ? "bg-primary/15 border-primary/30 text-primary" : "bg-white/[0.03] border-white/[0.06] text-white/30"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Time / Question (s)</label>
            <div className="flex items-center gap-2">
              {[15, 30, 45, 60].map(n => (
                <button
                  key={n}
                  onClick={() => setTimeLimit(n)}
                  className={cn(
                    "flex-1 py-2 rounded-xl border font-display text-[10px] font-black transition-all",
                    timeLimit === n ? "bg-primary/15 border-primary/30 text-primary" : "bg-white/[0.03] border-white/[0.06] text-white/30"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={!title.trim() || create.isPending}
        className="w-full py-3 rounded-xl font-display text-[10px] font-black uppercase tracking-wider text-white transition-all disabled:opacity-40"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), color-mix(in srgb, hsl(var(--primary)) 70%, black))", boxShadow: "0 4px 20px hsl(var(--primary) / .25)" }}
      >
        {create.isPending ? "Launching…" : "Launch & Open Lobby"}
      </button>
    </div>
  );
}

export function TournamentPanel({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { data: tournaments = [], isLoading } = useTournaments(courseId);
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [showCreate, setShowCreate] = useState(false);

  const active    = tournaments.filter((t: any) => t.status !== "complete");
  const completed = tournaments.filter((t: any) => t.status === "complete");
  const displayed = tab === "active" ? active : completed;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-[16px] font-black text-white uppercase tracking-wide">Tournaments</h2>
          <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[.2em] mt-0.5">
            {active.length} active · {completed.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowCreate(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-[9px] font-black uppercase tracking-wider text-white transition-all"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), color-mix(in srgb, hsl(var(--primary)) 70%, black))", boxShadow: "0 4px 14px hsl(var(--primary) / .3)" }}
        >
          <Plus size={12} />
          New Tournament
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <CreateForm
          courseId={courseId}
          onSuccess={() => setShowCreate(false)}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {([
          { key: "active",    label: `Active (${active.length})` },
          { key: "completed", label: `Completed (${completed.length})` },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2 rounded-xl font-display text-[9px] font-black uppercase tracking-wider border transition-all",
              tab === t.key
                ? "bg-primary/15 border-primary/30 text-primary"
                : "bg-white/[0.03] border-white/[0.06] text-white/35 hover:text-white/60"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tournament cards */}
      <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto styled-scrollbar pr-1">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <p className="font-display text-[9px] text-white/18 uppercase tracking-widest">Loading tournaments…</p>
          </div>
        )}
        {!isLoading && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Trophy size={28} className="text-white/10" />
            <p className="font-display text-[10px] font-black text-white/18 uppercase tracking-[.25em]">
              {tab === "active" ? "No active tournaments — launch one above" : "No completed tournaments yet"}
            </p>
          </div>
        )}
        {displayed.map((t: any) => (
          <div key={t.id} className="relative">
            <TournamentCard
              tournament={t}
              courseId={courseId}
              onManage={() => router.push(`/course/${courseId}/duels/tournament/${t.id}/remote`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
