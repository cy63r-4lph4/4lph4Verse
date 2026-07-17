"use client";

import { cn } from "@verse/ui";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Awaiting Review" },
  approved: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Forged" },
  rejected: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Rejected" },
};

export function SubmissionStatusList({ submissions }: { submissions: any[] }) {
  if (submissions.length === 0) {
    return (
      <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-10">
        Nothing forged yet — your first submission appears here.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {submissions.map((s) => {
        const cfg = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG];
        const Icon = cfg.icon;
        return (
          <div key={s.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="flex items-start justify-between gap-3">
              <p className="flex-1 font-display text-sm font-bold text-white leading-snug">{s.prompt}</p>
              <span className={cn("shrink-0 flex items-center gap-1 rounded-full border px-2 py-1 font-display text-[8px] font-black uppercase tracking-wider", cfg.bg, cfg.color)}>
                <Icon size={10} />
                {cfg.label}
              </span>
            </div>
            {s.status === "rejected" && s.reviewNote && (
              <p className="mt-2 text-[11px] text-red-300/70 italic">"{s.reviewNote}"</p>
            )}
          </div>
        );
      })}
    </div>
  );
}