"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trophy, Clock, Hash, ArrowRight } from "lucide-react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useCreateTournament } from "@verse/arena-web/hooks/useCreateTournament";

const QUESTION_COUNTS = [3, 5, 7, 10];
const TIME_LIMITS = [15, 20, 30, 45];

export default function CreateTournamentPage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const canManage = !!user && (user.role === "instructor" || user.role === "admin");

  const [title, setTitle] = useState("");
  const [questionsPerMatch, setQuestionsPerMatch] = useState(5);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(20);

  const createTournament = useCreateTournament(courseId);

  if (authLoading) {
    return (
      <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Verifying access…</p>
    );
  }

  if (!canManage) {
    return (
      <p className="font-display text-white/40 uppercase tracking-[.3em] text-sm text-center">
        Instructor access required
      </p>
    );
  }

  function submit() {
    if (!title.trim()) return;
    createTournament.mutate(
      { title: title.trim(), questionsPerMatch, timeLimitSeconds },
      {
        onSuccess: (showdown) => {
          router.push(`/course/${courseId}/duels/tournament/${showdown.id}/remote`);
        },
      },
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <header className="flex items-center gap-2">
        <Trophy size={14} className="text-amber-400" />
        <p className="font-display text-[10px] font-black text-amber-400 uppercase tracking-[0.25em]">
          Launch Tournament
        </p>
      </header>

      <div className="space-y-2">
        <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">
          Title
        </p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Midterm Showdown"
          className="w-full rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3.5 text-sm text-white/90 outline-none focus:border-primary/40"
        />
      </div>

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
              className={`rounded-xl border py-3 font-display text-sm font-black transition-all active:scale-95 ${questionsPerMatch === n
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-white/10 bg-white/[0.02] text-white/40"
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

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
              className={`rounded-xl border py-3 font-display text-sm font-black transition-all active:scale-95 ${timeLimitSeconds === s
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-white/10 bg-white/[0.02] text-white/40"
                }`}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!title.trim() || createTournament.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-4 font-display text-xs font-black uppercase tracking-[0.2em] text-black disabled:opacity-30 active:scale-[0.98] transition-all"
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