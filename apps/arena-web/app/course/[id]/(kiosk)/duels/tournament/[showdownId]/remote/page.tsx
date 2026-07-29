"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@verse/ui";
import { ArrowLeft, Swords, Play, SkipForward, ChevronRight, Trophy, AlertTriangle, Settings, QrCode } from "lucide-react";
import { useShowdownState } from "@verse/arena-web/lib/showdown/useShowdownState";
import { useQuestionTimer } from "@verse/arena-web/lib/showdown/useQuestionTimer";
import {
  getMaxRound,
  getRoundMatches,
  isRoundComplete,
  getActiveMatchQuestion,
  getLastMatchQuestion,
} from "@verse/arena-web/lib/showdown/types";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { useCourseMembers } from "@verse/arena-web/hooks/useCourseMembers";
import { useDeleteTournament } from "@verse/arena-web/hooks/useDeleteTournament";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

export default function TournamentRemotePage() {
  const params = useParams<{ id: string; showdownId: string }>();
  const router = useRouter();
  const token = useArenaToken();
  const { state, emit, error } = useShowdownState(params.showdownId, token);
  const [qrOpen, setQrOpen] = useState(false);
  function toggleQr() {
    const next = !qrOpen;
    setQrOpen(next);
    emit("showdown:toggle-qr", { show: next });
  }
  const [visibleError, setVisibleError] = useState<string | null>(null);
  useEffect(() => {
    if (!error) return;
    setVisibleError(error);
    const t = setTimeout(() => setVisibleError(null), 5000);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* ── PERSISTENT EXIT BAR — always rendered regardless of showdown status ── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button onClick={() => router.push(`/course/${params.id}/console`)} >
          <ArrowLeft size={15} />
          <span className="font-display text-[10px] font-black uppercase tracking-[.2em]">Exit Remote</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleQr}
            className={cn(
              "w-8 h-8 rounded-lg border flex items-center justify-center transition-colors",
              qrOpen ? "border-primary/40 bg-primary/10 text-primary" : "border-white/10 bg-white/[0.04] text-white/40 hover:text-white",
            )}
          >
            <QrCode size={14} />
          </button>
          <span className="font-display text-[9px] font-bold text-white/20 uppercase tracking-[.2em]">
            {state ? "Connected" : "Connecting…"}
          </span>
          {state && <TournamentControlsMenu showdown={state.showdown} courseId={params.id} emit={emit} />}
        </div>
      </div>

      {/* ── ERROR TOAST ── */}
      {visibleError && (
        <div className="shrink-0 mx-4 mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5">
          <AlertTriangle size={13} className="text-red-400 shrink-0" />
          <p className="font-display text-[10px] font-bold text-red-300 uppercase tracking-wide">{visibleError}</p>
        </div>
      )}

      <div className="flex-1 px-4 py-6">
        <RemoteBody state={state} courseId={params.id} emit={emit} />
      </div>
    </div>
  );
}

function RemoteBody({ state, courseId, emit }: { state: any; courseId: string; emit: any }) {
  if (!state) {
    return (
      <div className="h-full grid place-items-center">
        <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Establishing uplink…</p>
      </div>
    );
  }

  const { showdown, participants } = state;

  if (showdown.status === "draft" || showdown.status === "lobby") {
    return <LobbyPanel courseId={courseId} emit={emit} />;
  }

  if (showdown.status === "complete") {
    const champion = participants.find((p: any) => p.id === showdown.championId);
    return (
      <div className="grid place-items-center px-6 min-h-[60dvh]">
        <div className="text-center">
          <Trophy size={36} className="mx-auto mb-4 text-amber-400" />
          <p className="font-display text-2xl font-black text-white uppercase">
            {champion ? champion.arenaUser.user.username : "Cancelled"}
          </p>
          <p className="font-display text-[10px] font-bold text-amber-400/70 uppercase tracking-[.3em] mt-2">
            {champion ? "Champion" : "Tournament ended without a winner"}
          </p>
        </div>
      </div>
    );
  }

  const maxRound = getMaxRound(state);
  const currentRound = getRoundMatches(state, maxRound);
  const pendingMatch = currentRound.find((m: any) => m.status === "pending");
  const activeMatch = currentRound.find((m: any) => m.status === "active");

  return (
    <div className="max-w-md mx-auto space-y-4">
      <header className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Swords size={14} className="text-primary" />
        <p className="font-display text-[10px] font-black text-primary uppercase tracking-[.25em]">
          {showdown.title} · Round {maxRound + 1}
        </p>
      </header>

      {activeMatch && <ActiveMatchPanel match={activeMatch} emit={emit} />}

      {!activeMatch && pendingMatch && (
        <PendingMatchPanel match={pendingMatch} participants={participants} emit={emit} />
      )}

      {!activeMatch && !pendingMatch && isRoundComplete(state) && (
        <button
          onClick={() => emit("showdown:advance", {})}
          className="w-full py-3.5 rounded-2xl bg-primary text-black font-display text-[11px] font-black uppercase tracking-[.2em] flex items-center justify-center gap-2"
        >
          <ChevronRight size={14} />
          Advance Round
        </button>
      )}
    </div>
  );
}

function PendingMatchPanel({ match, participants, emit }: any) {
  const [pending, setPending] = useState(false);
  const a = participants.find((p: any) => p.id === match.playerAId);
  const b = participants.find((p: any) => p.id === match.playerBId);

  function start() {
    setPending(true);
    emit("showdown:start-match", { matchId: match.id });
    // Cleared automatically once the match transitions server-side and this
    // component unmounts (a new ActiveMatchPanel takes over) — this timeout
    // is just a safety net if the action silently failed.
    setTimeout(() => setPending(false), 4000);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <ArenaAvatar src={dicebearUrl(a?.arenaUser.user.username ?? "a")} size="md" />
        <p className="flex-1 font-display text-sm font-black text-white uppercase truncate">
          {a?.arenaUser.user.username}
        </p>
        <span className="font-display text-[9px] font-black text-white/30">VS</span>
        <p className="flex-1 font-display text-sm font-black text-white uppercase text-right truncate">
          {b?.arenaUser.user.username}
        </p>
        <ArenaAvatar src={dicebearUrl(b?.arenaUser.user.username ?? "b")} size="md" />
      </div>
      <button
        onClick={start}
        disabled={pending}
        className="w-full mt-4 py-3 rounded-2xl bg-primary text-black font-display text-[11px] font-black uppercase tracking-[.2em] flex items-center justify-center gap-2 disabled:opacity-40"
      >
        <Play size={14} />
        {pending ? "Starting…" : "Start Showdown"}
      </button>
    </div>
  );
}

function ActiveMatchPanel({ match, emit }: any) {
  const lastQ = getLastMatchQuestion(match);
  const { secondsLeft } = useQuestionTimer(lastQ);
  const answeredCount = lastQ?.answers.length ?? 0;
  const questionResolved = lastQ ? match.questionsCompleted >= lastQ.questionNumber : false;
  const isMatchComplete = match.status === "complete";

  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [match.questionsCompleted, match.status]);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(false), 6000);
    return () => clearTimeout(t);
  }, [pending]);

  const windowStillOpen =
    lastQ?.endsAt && !questionResolved ? new Date(lastQ.endsAt).getTime() > Date.now() : false;

  function resolve() {
    setPending(true);
    emit("showdown:resolve-question", { matchId: match.id });
  }

  function next() {
    setPending(true);
    emit("showdown:next-question", { matchId: match.id });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-display text-[9px] font-bold text-white/40 uppercase tracking-[.2em]">
          Q{lastQ?.questionNumber ?? match.questionsCompleted}
        </span>
        <span className="font-display text-[9px] font-bold text-white/40 uppercase tracking-[.2em]">
          {answeredCount}/2 answered
        </span>
      </div>

      {lastQ && (
        <p className="font-display text-sm font-bold text-white leading-snug">{lastQ.question.prompt}</p>
      )}

      {!isMatchComplete && !questionResolved && (
        <button
          onClick={resolve}
          disabled={windowStillOpen || pending}
          className={cn(
            "w-full py-3 rounded-2xl font-display text-[11px] font-black uppercase tracking-[.2em] flex items-center justify-center gap-2",
            windowStillOpen || pending ? "bg-white/5 text-white/30" : "bg-emerald-400 text-black",
          )}
        >
          {windowStillOpen ? `Starting in ${secondsLeft}…` : pending ? "Scoring…" : "Score Question"}
        </button>
      )}

      {!isMatchComplete && questionResolved && (
        <button
          onClick={next}
          disabled={pending}
          className="w-full py-3 rounded-2xl bg-primary text-black font-display text-[11px] font-black uppercase tracking-[.2em] flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <SkipForward size={14} />
          {pending ? "Loading…" : "Next Question"}
        </button>
      )}

      {isMatchComplete && (
        <p className="text-center font-display text-[10px] font-bold text-emerald-400 uppercase tracking-[.2em]">
          Match complete — return to round view
        </p>
      )}
    </div>
  );
}

function LobbyPanel({ courseId, emit }: { courseId: string; emit: (event: string, payload: any) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const { data: members = [], isLoading } = useCourseMembers(courseId);
  const students = members.filter((m: any) => m.role === "student");

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <p className="font-display text-[10px] font-black text-primary uppercase tracking-[.25em]">
        Select Contestants ({students.length} enrolled)
      </p>

      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {isLoading && (
          <p className="font-display text-[10px] text-white/30 uppercase tracking-wider text-center py-6">
            Loading roster…
          </p>
        )}
        {!isLoading && students.length === 0 && (
          <p className="font-display text-[10px] text-white/30 uppercase tracking-wider text-center py-6">
            No students enrolled in this course yet.
          </p>
        )}
        {students.map((m: any) => (
          <button
            key={m.arenaUserId}
            onClick={() => toggle(m.arenaUserId)}
            className={cn(
              "w-full flex items-center gap-2 rounded-xl border px-3 py-2 text-left",
              selected.includes(m.arenaUserId) ? "border-primary/40 bg-primary/10" : "border-white/10 bg-white/[0.02]",
            )}
          >
            <ArenaAvatar src={dicebearUrl(m.username)} size="sm" />
            <span className="font-display text-xs font-bold text-white">{m.username}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => emit("showdown:build-bracket", { arenaUserIds: selected })}
        disabled={selected.length < 2}
        className="w-full py-3.5 rounded-2xl bg-primary text-black font-display text-[11px] font-black uppercase tracking-[.2em] disabled:opacity-30"
      >
        Draw Bracket ({selected.length})
      </button>
    </div>
  );
}
function TournamentControlsMenu({ showdown, courseId, emit }: any) {
  const router = useRouter();
  const deleteTournament = useDeleteTournament();
  const [confirmAction, setConfirmAction] = useState<"reset" | "cancel" | "delete" | null>(null);
  const [open, setOpen] = useState(false);



  function runConfirmed() {
    if (confirmAction === "reset") emit("showdown:reset", {});
    if (confirmAction === "cancel") emit("showdown:cancel", {});
    if (confirmAction === "delete") {
      deleteTournament.mutate(showdown.id, {
        onSuccess: () => router.push(`/course/${courseId}/console`),
      });
    }
    setConfirmAction(null);
    setOpen(false);
  }

  if (confirmAction) {
    const copy = {
      reset: "Wipe the bracket and return to Lobby? Scores and matches will be lost.",
      cancel: "End this tournament with no winner?",
      delete: "Permanently delete this tournament? This cannot be undone.",
    }[confirmAction];

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6">
        <div className="max-w-xs w-full rounded-2xl border border-red-500/30 bg-black/90 p-5 space-y-4">
          <p className="font-display text-xs font-bold text-white/80 leading-relaxed">{copy}</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setConfirmAction(null)}
              className="py-2.5 rounded-xl bg-white/[0.06] font-display text-[10px] font-bold text-white/60 uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={runConfirmed}
              className="py-2.5 rounded-xl bg-red-500/80 font-display text-[10px] font-black text-white uppercase tracking-wider"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white transition-colors"
      >
        <Settings size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-40 w-44 rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl p-1.5 space-y-1">
          <button
            onClick={() => { setConfirmAction("reset"); setOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg font-display text-[10px] font-bold text-white/60 hover:bg-white/[0.06] uppercase tracking-wide"
          >
            Reset Bracket
          </button>
          {showdown.status !== "complete" && (
            <button
              onClick={() => { setConfirmAction("cancel"); setOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg font-display text-[10px] font-bold text-amber-400/80 hover:bg-amber-500/10 uppercase tracking-wide"
            >
              Cancel Tournament
            </button>
          )}
          <button
            onClick={() => { setConfirmAction("delete"); setOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg font-display text-[10px] font-bold text-red-400/80 hover:bg-red-500/10 uppercase tracking-wide"
          >
            Delete Tournament
          </button>
        </div>
      )}
    </div>
  );
}