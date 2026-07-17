"use client";

import { useState } from "react";
import { cn } from "@verse/ui";
import { Swords, Play, SkipForward, ChevronRight, Trophy, RotateCcw } from "lucide-react";
import { useShowdownState } from "@verse/arena-web/lib/showdown/useShowdownState";
import { useQuestionTimer } from "@verse/arena-web/lib/showdown/useQuestionTimer";
import {
  getMaxRound,
  getRoundMatches,
  isRoundComplete,
  getActiveMatchQuestion,
} from "@verse/arena-web/lib/showdown/types";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { api } from "@verse/arena-web/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { useParams } from "next/navigation";
import { useCourseMembers } from "@verse/arena-web/hooks/useCourseMembers";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

export default function TournamentRemotePage({ params }: { params: { showdownId: string; id: string } }) {
  const token = useArenaToken();
  const { state, emit } = useShowdownState(params.showdownId, token);

  if (!state) {
    return (
      <EnergyBackground className="grid place-items-center" variant="duel">
        <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Establishing uplink…</p>
      </EnergyBackground>
    );
  }

  const { showdown, participants, matches } = state;

  if (showdown.status === "draft" || showdown.status === "lobby") {
    return <LobbyPanel showdownId={showdown.id} emit={emit} />;
  }

  if (showdown.status === "complete") {
    const champion = participants.find((p) => p.id === showdown.championId);
    return (
      <EnergyBackground className="grid place-items-center px-6" variant="duel">
        <div className="text-center">
          <Trophy size={36} className="mx-auto mb-4 text-amber-400" />
          <p className="font-display text-2xl font-black text-white uppercase">
            {champion?.arenaUser.user.username}
          </p>
          <p className="font-display text-[10px] font-bold text-amber-400/70 uppercase tracking-[.3em] mt-2">
            Champion
          </p>
        </div>
      </EnergyBackground>
    );
  }

  const maxRound = getMaxRound(state);
  const currentRound = getRoundMatches(state, maxRound);
  const pendingMatch = currentRound.find((m) => m.status === "pending");
  const activeMatch = currentRound.find((m) => m.status === "active");

  return (
    <EnergyBackground className="px-4 py-6" variant="duel">
      <div className="max-w-md mx-auto space-y-4">
        <header className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Swords size={14} className="text-primary" />
          <p className="font-display text-[10px] font-black text-primary uppercase tracking-[.25em]">
            {showdown.title} · Round {maxRound + 1}
          </p>
        </header>

        {activeMatch && (
          <ActiveMatchPanel
            match={activeMatch}
            participants={participants}
            emit={emit}
          />
        )}

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
    </EnergyBackground>
  );
}

function PendingMatchPanel({ match, participants, emit }: any) {
  const a = participants.find((p: any) => p.id === match.playerAId);
  const b = participants.find((p: any) => p.id === match.playerBId);

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
        onClick={() => emit("showdown:start-match", { matchId: match.id })}
        className="w-full mt-4 py-3 rounded-2xl bg-primary text-black font-display text-[11px] font-black uppercase tracking-[.2em] flex items-center justify-center gap-2"
      >
        <Play size={14} />
        Start Showdown
      </button>
    </div>
  );
}

function ActiveMatchPanel({ match, participants, emit }: any) {
  const activeQ = getActiveMatchQuestion(match);
  const { isCountingDown, secondsLeft } = useQuestionTimer(activeQ);
  const answeredCount = activeQ?.answers.length ?? 0;
  const questionResolved = activeQ ? match.questionsCompleted >= activeQ.questionNumber : false;
  const isMatchComplete = match.status === "complete";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-display text-[9px] font-bold text-white/40 uppercase tracking-[.2em]">
          Q{activeQ?.questionNumber ?? match.questionsCompleted}
        </span>
        <span className="font-display text-[9px] font-bold text-white/40 uppercase tracking-[.2em]">
          {answeredCount}/2 answered
        </span>
      </div>

      {activeQ && (
        <p className="font-display text-sm font-bold text-white leading-snug">{activeQ.question.prompt}</p>
      )}

      {!isMatchComplete && !questionResolved && (
        <button
          onClick={() => emit("showdown:resolve-question", { matchId: match.id })}
          disabled={isCountingDown}
          className={cn(
            "w-full py-3 rounded-2xl font-display text-[11px] font-black uppercase tracking-[.2em] flex items-center justify-center gap-2",
            isCountingDown ? "bg-white/5 text-white/30" : "bg-emerald-400 text-black",
          )}
        >
          {isCountingDown ? `Starting in ${secondsLeft}…` : "Score Question"}
        </button>
      )}

      {!isMatchComplete && questionResolved && (
        <button
          onClick={() => emit("showdown:next-question", { matchId: match.id })}
          className="w-full py-3 rounded-2xl bg-primary text-black font-display text-[11px] font-black uppercase tracking-[.2em] flex items-center justify-center gap-2"
        >
          <SkipForward size={14} />
          Next Question
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

function LobbyPanel({ showdownId, emit }: { showdownId: string; emit: (event: string, payload: any) => void }) {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const [selected, setSelected] = useState<string[]>([]);

  const { data: members = [], isLoading } = useCourseMembers(courseId);
  const students = members.filter((m) => m.role === "student");

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <EnergyBackground className="px-4 py-6" variant="duel">
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
          {students.map((m) => (
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
    </EnergyBackground>
  );
}
