"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useForgePending, useForgeReview } from "@verse/arena-web/hooks/useForgeSubmissions";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

export default function ForgeReviewPage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  // Explicit allow-list: only render the queue once we've confirmed the
  // role, not merely "no mismatch found." Absence of `user` (logged out,
  // still loading, or fetch failed) must never fall through to access.
  const canReview = isAuthenticated && (user?.role === "instructor" || user?.role === "admin");

  const { data: pending = [], isLoading } = useForgePending(courseId, canReview);
  const { approve, reject } = useForgeReview(courseId);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  if (authLoading) {
    return (
      <EnergyBackground className="grid place-items-center px-6" variant="duel">
        <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Verifying access…</p>
      </EnergyBackground>
    );
  }

  if (!canReview) {
    return (
      <EnergyBackground className="grid place-items-center px-6" variant="duel">
        <p className="font-display text-white/40 uppercase tracking-[.3em] text-sm text-center">
          Instructor access required
        </p>
      </EnergyBackground>
    );
  }

  function startReject(id: string) {
    setRejectingId(id);
    setNote(""); // never carry a previous submission's draft note into a new one
  }

  function cancelReject() {
    setRejectingId(null);
    setNote("");
  }

  function confirmReject(id: string) {
    reject.mutate(
      { id, note: note.trim() || undefined },
      { onSuccess: () => { setRejectingId(null); setNote(""); } },
    );
  }

  return (
    <EnergyBackground className="px-4 py-6" variant="duel">
      <div className="max-w-md mx-auto space-y-5">
        <header className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" />
          <p className="font-display text-[10px] font-black text-primary uppercase tracking-[0.25em]">
            {isLoading ? "Tempering Queue" : `Tempering Queue · ${pending.length} pending`}
          </p>
        </header>

        {isLoading && (
          <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-10">
            Loading…
          </p>
        )}

        {!isLoading && pending.length === 0 && (
          <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-10">
            No submissions awaiting review.
          </p>
        )}

        <AnimatePresence>
          {pending.map((s: any) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <ArenaAvatar src={dicebearUrl(s.submittedBy?.user?.username ?? "?")} size="xs" />
                <span className="font-display text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  {s.submittedBy?.user?.username ?? "Unknown"}
                </span>
                <span className="ml-auto font-display text-[8px] font-bold text-white/25 uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/10">
                  {s.difficulty}
                </span>
              </div>

              <p className="font-display text-sm font-bold text-white leading-snug">{s.prompt}</p>

              <div className="space-y-1.5">
                {s.options.map((opt: string, i: number) => (
                  <div
                    key={i}
                    className={
                      i === s.correctIndex
                        ? "flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300"
                        : "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/40"
                    }
                  >
                    {i === s.correctIndex && <CheckCircle2 size={12} className="shrink-0" />}
                    {opt}
                  </div>
                ))}
              </div>

              {rejectingId === s.id ? (
                <div className="space-y-2">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reason (optional)"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2 text-xs text-white/80 outline-none focus:border-red-500/40"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={cancelReject}
                      className="rounded-xl bg-white/[0.05] py-2.5 font-display text-[10px] font-bold text-white/50 uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => confirmReject(s.id)}
                      disabled={reject.isPending}
                      className="rounded-xl bg-red-500/20 py-2.5 font-display text-[10px] font-black text-red-300 uppercase tracking-wider disabled:opacity-40"
                    >
                      {reject.isPending ? "Rejecting…" : "Confirm Reject"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => startReject(s.id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 font-display text-[10px] font-bold text-white/50 uppercase tracking-wider active:scale-95"
                  >
                    <XCircle size={13} />
                    Reject
                  </button>
                  <button
                    onClick={() => approve.mutate({ id: s.id })}
                    disabled={approve.isPending}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/90 py-2.5 font-display text-[10px] font-black text-black uppercase tracking-wider active:scale-95 disabled:opacity-40"
                  >
                    <CheckCircle2 size={13} />
                    {approve.isPending ? "…" : "Temper"}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </EnergyBackground>
  );
}