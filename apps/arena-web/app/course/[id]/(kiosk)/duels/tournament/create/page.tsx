"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trophy, Clock, Hash, ArrowRight, Sparkles, Users } from "lucide-react";
import { cn } from "@verse/ui";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useCreateTournament } from "@verse/arena-web/hooks/useCreateTournament";

const QUESTION_COUNTS = [3, 5, 7, 10];
const TIME_LIMITS = [15, 20, 30, 45];

function CornerBrackets() {
  const cls = "absolute w-3 h-3 border-amber-400/25";
  return (
    <>
      <div className={cn(cls, "top-0 left-0 border-t border-l rounded-tl-lg")} />
      <div className={cn(cls, "top-0 right-0 border-t border-r rounded-tr-lg")} />
      <div className={cn(cls, "bottom-0 left-0 border-b border-l rounded-bl-lg")} />
      <div className={cn(cls, "bottom-0 right-0 border-b border-r rounded-br-lg")} />
    </>
  );
}

export default function CreateTournamentPage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const canManage = !!user && (user.role === "instructor" || user.role === "admin");

  const [title, setTitle] = useState("");
  const [questionsPerMatch, setQuestionsPerMatch] = useState(5);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(20);
  const [scheduledAt, setScheduledAt] = useState("");

  const createTournament = useCreateTournament(courseId);

  if (authLoading) {
    return (
      <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs text-center py-16">
        Verifying access…
      </p>
    );
  }

  if (!canManage) {
    return (
      <p className="font-display text-white/40 uppercase tracking-[.3em] text-sm text-center py-16">
        Instructor access required
      </p>
    );
  }

  function submit() {
    if (!title.trim()) return;
    createTournament.mutate(
      {
        title: title.trim(),
        questionsPerMatch,
        timeLimitSeconds,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      },
      { onSuccess: (showdown) => router.push(`/course/${courseId}/duels/tournament/${showdown.id}/remote`) },
    );
  }

  const estimatedMinutesPerMatch = Math.ceil((questionsPerMatch * (timeLimitSeconds + 4)) / 60);

  return (
    <div className="max-w-md mx-auto space-y-6 py-2">
      {/* ── Header block ─────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl border border-amber-500/20 overflow-hidden px-4 py-5 text-center"
        style={{ background: "linear-gradient(135deg, rgba(245,158,11,.1) 0%, rgba(0,0,0,.4) 100%)" }}
      >
        <CornerBrackets />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 mb-3">
          <Trophy size={11} className="text-amber-400" />
          <span className="font-display text-[9px] font-black text-amber-400 uppercase tracking-[.25em]">
            Bracket Forge
          </span>
        </div>
        <h1 className="font-display text-2xl font-black text-white uppercase tracking-wide">
          Launch Tournament
        </h1>
        <p className="font-display text-[9px] font-bold text-white/25 uppercase tracking-[.2em] mt-1">
          Configure the arena before opening the lobby
        </p>
      </div>

      {/* ── Title ─────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">
          Tournament Title
        </p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Midterm Showdown"
          className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white/90 outline-none focus:border-amber-500/40 transition-colors"
        />
      </div>

      {/* ── Questions per showdown ────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 font-display text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">
          <Hash size={11} />
          Questions per Showdown
        </p>
        <div className="grid grid-cols-4 gap-2">
          {QUESTION_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setQuestionsPerMatch(n)}
              className={cn(
                "rounded-xl border py-3 font-display text-sm font-black transition-all active:scale-95",
                questionsPerMatch === n
                  ? "border-amber-400/50 bg-amber-400/10 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,.15)]"
                  : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ── Time per question ────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 font-display text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">
          <Clock size={11} />
          Time per Question
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TIME_LIMITS.map((s) => (
            <button
              key={s}
              onClick={() => setTimeLimitSeconds(s)}
              className={cn(
                "rounded-xl border py-3 font-display text-sm font-black transition-all active:scale-95",
                timeLimitSeconds === s
                  ? "border-amber-400/50 bg-amber-400/10 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,.15)]"
                  : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20",
              )}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      {/* ── Schedule (optional) ──────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">
          Schedule (optional)
        </p>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white/90 outline-none focus:border-amber-500/40 transition-colors [color-scheme:dark]"
        />
        {scheduledAt && (
          <p className="font-display text-[9px] text-amber-400/60 uppercase tracking-wider px-1">
            Students will see a countdown until this time
          </p>
        )}
      </div>

      {/* ── Live preview summary ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-[11px] font-black text-white uppercase tracking-wide truncate">
            {title.trim() || "Untitled Tournament"}
          </p>
          <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
            ~{estimatedMinutesPerMatch} min per match · {questionsPerMatch} rounds
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0 text-white/20">
          <Users size={12} />
        </div>
      </div>

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <button
        onClick={submit}
        disabled={!title.trim() || createTournament.isPending}
        className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 font-display text-xs font-black uppercase tracking-[0.2em] text-black disabled:opacity-30 active:scale-[0.98] transition-all"
        style={{ boxShadow: "0 4px 24px rgba(245,158,11,.3)" }}
      >
        {createTournament.isPending ? "Opening Arena…" : "Create & Open Lobby"}
        {!createTournament.isPending && <ArrowRight size={15} />}
      </button>

      {createTournament.isError && (
        <p className="text-center font-display text-[10px] text-red-400 uppercase tracking-wider">
          Something went wrong — try again.
        </p>
      )}
    </div>
  );
}