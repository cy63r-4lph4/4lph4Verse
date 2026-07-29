"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Clock, Swords, Radio, Timer } from "lucide-react";
import { cn } from "@verse/ui";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return [m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function getUrgency(ms: number): "calm" | "warming" | "urgent" {
  const mins = ms / 60000;
  if (mins > 60)  return "calm";
  if (mins > 15)  return "warming";
  return "urgent";
}

// ─── Urgency config ───────────────────────────────────────────────────────────

const URGENCY_CFG = {
  calm: {
    bg:        "bg-primary/[0.04]",
    border:    "border-primary/15",
    iconColor: "text-primary/60",
    textColor: "text-primary/50",
    titleColor:"text-primary/80",
    timeColor: "text-primary",
    icon:      Timer,
    pulse:     false,
    label:     "Scheduled",
  },
  warming: {
    bg:        "bg-amber-500/[0.05]",
    border:    "border-amber-500/20",
    iconColor: "text-amber-500",
    textColor: "text-amber-400/70",
    titleColor:"text-amber-300",
    timeColor: "text-amber-300",
    icon:      Clock,
    pulse:     false,
    label:     "Starting Soon",
  },
  urgent: {
    bg:        "bg-red-500/[0.06]",
    border:    "border-red-500/25",
    iconColor: "text-red-500",
    textColor: "text-red-400/80",
    titleColor:"text-red-300",
    timeColor: "text-red-300",
    icon:      ShieldAlert,
    pulse:     true,
    label:     "Imminent",
  },
} as const;

// ─── Scheduled tournament banner ──────────────────────────────────────────────

export function ScheduledTournamentBanner({
  title,
  scheduledAt,
  isOverdue,
}: {
  title:       string;
  scheduledAt: string;
  isOverdue:   boolean;
}) {
  const [remaining, setRemaining] = useState(
    () => new Date(scheduledAt).getTime() - Date.now()
  );

  useEffect(() => {
    if (isOverdue) return;
    const tick = setInterval(() => {
      setRemaining(new Date(scheduledAt).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(tick);
  }, [scheduledAt, isOverdue]);

  // ── Overdue state — instructor hasn't started yet ─────────────────────────
  if (isOverdue) {
    return (
      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
        <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
          <Clock size={14} className="text-white/25" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-[11px] font-black text-white/40 uppercase tracking-wide truncate">
            {title}
          </p>
          <p className="font-display text-[9px] font-bold text-white/20 uppercase tracking-wider mt-0.5">
            Was scheduled · Waiting on instructor
          </p>
        </div>
      </div>
    );
  }

  // ── Live countdown ─────────────────────────────────────────────────────────
  const urgency = getUrgency(remaining);
  const cfg     = URGENCY_CFG[urgency];
  const Icon    = cfg.icon;

  return (
    <div className={cn(
      "flex items-center gap-3 px-3.5 py-3 rounded-2xl border transition-all duration-500",
      cfg.bg,
      cfg.border,
    )}>
      {/* Icon block */}
      <div className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
        urgency === "urgent"  ? "bg-red-500/10 border border-red-500/20"    :
        urgency === "warming" ? "bg-amber-500/10 border border-amber-500/20" :
                                "bg-primary/10 border border-primary/20"
      )}>
        <Icon
          size={14}
          className={cn(cfg.iconColor, cfg.pulse && "animate-pulse")}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("font-display text-[11px] font-black uppercase tracking-wide truncate", cfg.titleColor)}>
            {title}
          </p>
          {/* Urgency pill */}
          <span className={cn(
            "shrink-0 px-1.5 py-0.5 rounded-full font-display text-[8px] font-black uppercase tracking-wider",
            urgency === "urgent"  ? "bg-red-500/15 text-red-400"     :
            urgency === "warming" ? "bg-amber-500/15 text-amber-400" :
                                    "bg-primary/10 text-primary/70"
          )}>
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className={cn("font-display text-[9px] font-bold uppercase tracking-wider", cfg.textColor)}>
            Starts in
          </p>
          <p className={cn("font-display text-[11px] font-black uppercase tracking-wide", cfg.timeColor)}>
            {formatCountdown(remaining)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Live tournament banner ───────────────────────────────────────────────────
// This is a completely different component — it's an action, not just info.
// It should feel like an interrupt, not an alert pill.

export function LiveTournamentBanner({
  title,
  showdownId,
  courseId,
  onClick,
}: {
  title:      string;
  showdownId: string;
  courseId:   string;
  onClick:    () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full relative rounded-2xl border border-red-500/30 overflow-hidden active:scale-[.98] transition-all duration-200"
      style={{ boxShadow: "0 0 24px rgba(239,68,68,.08)" }}
    >
      {/* Top accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-500/80 via-red-400/40 to-transparent" />

      {/* Animated background sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,.07) 0%, rgba(0,0,0,.3) 100%)",
        }}
      />

      <div className="relative flex items-center gap-3 px-4 py-3.5">
        {/* Live pulse ring */}
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"
            style={{ animationDuration: "1.5s" }}
          />
          <div className="relative w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <Swords size={15} className="text-red-400" />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 mb-0.5">
            {/* Live dot */}
            <div
              className="w-[6px] h-[6px] rounded-full bg-red-400 shrink-0"
              style={{ boxShadow: "0 0 6px rgba(239,68,68,.8)", animation: "pulse 1s ease-in-out infinite" }}
            />
            <span className="font-display text-[8px] font-black text-red-400/70 uppercase tracking-[.3em]">
              Live Now
            </span>
          </div>
          <p className="font-display text-[13px] font-black text-white uppercase tracking-wide leading-tight truncate">
            {title}
          </p>
          <p className="font-display text-[9px] font-bold text-red-400/50 uppercase tracking-wider mt-0.5">
            Tap to enter the arena
          </p>
        </div>

        {/* CTA arrow */}
        <div className="shrink-0 w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center group-hover:bg-red-500/25 transition-colors">
          <Radio size={13} className="text-red-400 animate-pulse" />
        </div>
      </div>
    </button>
  );
}