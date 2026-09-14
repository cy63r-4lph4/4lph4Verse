"use client";

import { useState } from "react";
import { Hammer, Check, X, MessageSquare, Flame, BarChart2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useForgePending, useForgeReview } from "@verse/arena-web/hooks/useForgeSubmissions";
import { useResources } from "@verse/arena-web/hooks/useResources";

function dicebearUrl(name: string) {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

const DIFF_CFG = {
  easy:   { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  medium: { color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
  hard:   { color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
};

function SubmissionCard({ submission, onApprove, onReject, isActing, courseId }: {
  submission: any;
  onApprove: (note: string, explanation?: string, resourceId?: string) => void;
  onReject: (note: string) => void;
  isActing: boolean;
  courseId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [explanation, setExplanation] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [showApproveOptions, setShowApproveOptions] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const { data: resources = [] } = useResources(courseId);

  const diff = submission.difficulty as keyof typeof DIFF_CFG ?? "medium";
  const cfg = DIFF_CFG[diff] ?? DIFF_CFG.medium;

  const handleAction = (type: "approve" | "reject") => {
    if (type === "approve") onApprove(note, explanation || undefined, resourceId || undefined);
    else onReject(note);
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      {/* Card header */}
      <div className="flex items-start gap-3 p-4">
        <ArenaAvatar
          src={dicebearUrl(submission.submittedBy?.username ?? submission.submittedById ?? "?")}
          size="sm"
          className="shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-display text-[11px] font-black text-white/80 uppercase tracking-wide truncate">
              {submission.submittedBy?.username ?? "Unknown"}
            </p>
            <span className={cn("font-display text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", cfg.color, cfg.bg)}>
              {diff}
            </span>
            {submission.category && (
              <span className="font-display text-[7px] font-bold text-white/25 uppercase tracking-wider">
                {submission.category}
              </span>
            )}
          </div>
          <p className="font-display text-[12px] font-black text-white leading-snug">{submission.prompt}</p>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="shrink-0 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
          {expanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
        </button>
      </div>

      {/* Expanded: options */}
      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {(submission.options ?? []).map((opt: string, i: number) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-2 px-3 py-2 rounded-xl border text-left",
                i === submission.correctIndex
                  ? "bg-emerald-500/[0.08] border-emerald-500/25"
                  : "bg-white/[0.02] border-white/[0.05]"
              )}
            >
              <span className={cn("font-display text-[8px] font-black shrink-0 mt-0.5",
                i === submission.correctIndex ? "text-emerald-400" : "text-white/25"
              )}>
                {i === submission.correctIndex ? "✓" : String.fromCharCode(65 + i)}
              </span>
              <p className={cn("font-display text-[10px] font-bold leading-snug",
                i === submission.correctIndex ? "text-emerald-300" : "text-white/50"
              )}>
                {opt}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-4 space-y-3">
        {/* Extra options for approving */}
        {showApproveOptions && (
          <div className="grid grid-cols-2 gap-2 p-3 bg-white/[0.03] border border-emerald-500/10 rounded-xl">
            <div>
              <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Explanation (optional)</label>
              <textarea
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                rows={1}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[10px] font-display font-bold outline-none focus:border-emerald-500/40 transition-colors resize-none"
                placeholder="Explain the answer..."
              />
            </div>
            <div>
              <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Link Datapad (optional)</label>
              <select
                value={resourceId}
                onChange={e => setResourceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[10px] font-display font-bold outline-none focus:border-emerald-500/40 transition-colors"
              >
                <option value="">None</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Note input */}
        {showNote && (
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Optional feedback note…"
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-[10px] font-display font-bold outline-none focus:border-primary/40 transition-colors"
          />
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowNote(s => !s); setShowApproveOptions(false); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <MessageSquare size={11} className="text-white/30" />
            <span className="font-display text-[8px] font-black text-white/30 uppercase tracking-wider">Note</span>
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={isActing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] hover:bg-red-500/15 font-display text-[9px] font-black text-red-400 uppercase tracking-wider transition-all disabled:opacity-40"
          >
            <X size={12} />
            Reject
          </button>
          <button
            onClick={() => {
              if (!showApproveOptions) {
                setShowApproveOptions(true);
                setShowNote(false);
              } else {
                handleAction("approve");
              }
            }}
            disabled={isActing}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.1] hover:bg-emerald-500/20 font-display text-[9px] font-black text-emerald-400 uppercase tracking-wider transition-all disabled:opacity-40"
          >
            <Check size={12} />
            {showApproveOptions ? "Confirm Approve" : "Approve..."}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ForgeReviewPanel({ courseId }: { courseId: string }) {
  const { data: pending = [], isLoading } = useForgePending(courseId);
  const { approve, reject } = useForgeReview(courseId);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-[16px] font-black text-white uppercase tracking-wide">Forge Queue</h2>
          <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[.2em] mt-0.5">
            Student-submitted questions awaiting review
          </p>
        </div>

        {/* Badge */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl border",
          pending.length > 0
            ? "bg-amber-500/[0.08] border-amber-500/25"
            : "bg-white/[0.03] border-white/[0.06]"
        )}>
          <Flame size={13} className={pending.length > 0 ? "text-amber-400" : "text-white/20"} />
          <span className={cn("font-display text-[10px] font-black uppercase tracking-wider", pending.length > 0 ? "text-amber-400" : "text-white/25")}>
            {pending.length} pending
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending Review", value: pending.length, color: "text-amber-400", bg: "bg-amber-500/[0.06] border-amber-500/15" },
          { label: "Difficulty Breakdown",
            value: `${pending.filter((p: any) => p.difficulty === "easy").length}E / ${pending.filter((p: any) => p.difficulty === "medium").length}M / ${pending.filter((p: any) => p.difficulty === "hard").length}H`,
            color: "text-white/50", bg: "bg-white/[0.02] border-white/[0.06]"
          },
          { label: "Categories", value: new Set(pending.map((p: any) => p.category).filter(Boolean)).size, color: "text-violet-400", bg: "bg-violet-500/[0.05] border-violet-500/15" },
        ].map(stat => (
          <div key={stat.label} className={cn("flex flex-col gap-1 p-4 rounded-2xl border", stat.bg)}>
            <p className={cn("font-display text-[22px] font-black leading-none", stat.color)}>{stat.value}</p>
            <p className="font-display text-[8px] font-bold text-white/25 uppercase tracking-[.2em]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Submissions */}
      <div className="space-y-3 max-h-[calc(100vh-22rem)] overflow-y-auto styled-scrollbar pr-1">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <p className="font-display text-[9px] text-white/18 uppercase tracking-widest">Loading submissions…</p>
          </div>
        )}
        {!isLoading && pending.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Hammer size={28} className="text-white/10" />
            <p className="font-display text-[10px] font-black text-white/18 uppercase tracking-[.25em]">Queue is clear — all caught up!</p>
          </div>
        )}
        {pending.map((sub: any) => (
          <SubmissionCard
            key={sub.id}
            submission={sub}
            courseId={courseId}
            isActing={approve.isPending || reject.isPending}
            onApprove={(note, explanation, resourceId) => approve.mutate({ id: sub.id, note, explanation, resourceId })}
            onReject={(note) => reject.mutate({ id: sub.id, note })}
          />
        ))}
      </div>
    </div>
  );
}
