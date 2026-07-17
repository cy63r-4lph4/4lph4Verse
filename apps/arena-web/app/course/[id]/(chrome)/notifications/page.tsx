"use client";

import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    Swords, ShieldCheck, Hourglass,
    ArrowLeft, Hammer, Bell,
    CheckCircle2, XCircle,
} from "lucide-react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useNotifications } from "@verse/arena-web/hooks/useNotifications";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Challenge {
    showdownId: string;
    fromUsername?: string;
    toUsername?: string;
    createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dicebearUrl(name: string) {
    return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

function relativeTime(iso: string) {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return "Now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="text-white/25 shrink-0">{icon}</span>
            <span className="font-display text-[9px] font-black text-white/25 uppercase tracking-[.3em] whitespace-nowrap">
                {label}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
        </div>
    );
}

// ─── Incoming card ────────────────────────────────────────────────────────────

function IncomingCard({
    challenge,
    onAccept,
    onDecline,
}: {
    challenge: Challenge;
    onAccept: () => void;
    onDecline: () => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
            className="rounded-2xl border border-primary/20 bg-primary/[0.04] overflow-hidden"
            style={{ boxShadow: "0 0 20px hsl(var(--primary) / .05)" }}
        >
            {/* Top accent */}
            <div className="h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

            <div className="p-4">
                {/* Fighter row */}
                <div className="flex items-center gap-3 mb-4">
                    <ArenaAvatar
                        src={dicebearUrl(challenge.fromUsername ?? "unknown")}
                        size="md"
                        glow
                        glowColor="primary"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-display text-[13px] font-black text-white uppercase tracking-wide truncate">
                            {challenge.fromUsername}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Swords size={9} className="text-primary/50 shrink-0" />
                            <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
                                Challenges you · {relativeTime(challenge.createdAt)}
                            </p>
                        </div>
                    </div>
                    {/* Live pulse */}
                    <div
                        className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse"
                        style={{ boxShadow: "0 0 8px hsl(var(--primary) / .8)" }}
                    />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2.5">
                    <button
                        onClick={onDecline}
                        className="py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] font-display text-[10px] font-black text-white/40 uppercase tracking-[.2em] flex items-center justify-center gap-2 hover:bg-white/[0.07] hover:text-white/60 transition-all active:scale-95"
                    >
                        <XCircle size={12} />
                        Decline
                    </button>
                    <button
                        onClick={onAccept}
                        className="py-3.5 rounded-xl font-display text-[10px] font-black text-black uppercase tracking-[.2em] flex items-center justify-center gap-2 active:scale-95 transition-all"
                        style={{
                            background: "hsl(var(--primary))",
                            boxShadow: "0 4px 16px hsl(var(--primary) / .35)",
                        }}
                    >
                        <CheckCircle2 size={12} />
                        Accept
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Outgoing card ────────────────────────────────────────────────────────────

function OutgoingCard({
    challenge,
    onClick,
}: {
    challenge: Challenge;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left active:scale-[.98] transition-all hover:bg-white/[0.04] hover:border-white/10"
        >
            <ArenaAvatar src={dicebearUrl(challenge.toUsername ?? "unknown")} size="md" />
            <div className="flex-1 min-w-0">
                <p className="font-display text-[13px] font-black text-white uppercase tracking-wide truncate">
                    {challenge.toUsername}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Hourglass size={9} className="text-white/20 animate-pulse shrink-0" />
                    <p className="font-display text-[9px] font-bold text-white/25 uppercase tracking-wider">
                        Sent {relativeTime(challenge.createdAt)} · Awaiting response
                    </p>
                </div>
            </div>
        </button>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center gap-4 py-24">
            <div className="relative">
                <div
                    className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                    style={{ background: "hsl(var(--primary) / .07)", transform: "scale(2.5)" }}
                />
                <div className="relative w-16 h-16 rounded-2xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center">
                    <Bell size={24} className="text-white/15" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-display text-[12px] font-black text-white/20 uppercase tracking-[.25em]">
                    All Clear
                </p>
                <p className="font-display text-[9px] font-bold text-white/10 uppercase tracking-[.2em]">
                    No signals in the arena
                </p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const {
        incoming,
        outgoing,
        pendingForge,
        canReview,
        isLoading,
        accept,
        decline,
    } = useNotifications(params.id);

    const hasContent =
        incoming.length > 0 ||
        outgoing.length > 0 ||
        (canReview && pendingForge.length > 0);

    return (
        <div className="py-5 space-y-6">

            {/* ── PAGE HEADER ───────────────────────────────────────────────────── */}
            {/*
       * Not sticky here — the CourseLayout header is already sticky.
       * This is just a page title row that scrolls with the content.
       */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all active:scale-90 shrink-0"
                >
                    <ArrowLeft size={15} />
                </button>
                <div className="flex items-center gap-2">
                    <Bell
                        size={12}
                        className="text-primary"
                        style={{ filter: "drop-shadow(0 0 5px hsl(var(--primary) / .6))" }}
                    />
                    <span className="font-display text-[11px] font-black text-white/50 uppercase tracking-[.25em]">
                        Signal Log
                    </span>
                </div>
                {incoming.length > 0 && (
                    <div
                        className="ml-auto px-2.5 py-0.5 rounded-full font-display text-[9px] font-black text-black shrink-0"
                        style={{ background: "hsl(var(--primary))" }}
                    >
                        {incoming.length} new
                    </div>
                )}
            </div>

            {/* ── LOADING ───────────────────────────────────────────────────────── */}
            {isLoading && (
                <div className="flex flex-col items-center gap-3 py-20">
                    <div
                        className="w-8 h-8 rounded-full border-2 border-primary/40 border-t-primary"
                        style={{ animation: "spin 1s linear infinite" }}
                    />
                    <p className="font-display text-[9px] font-bold text-white/20 uppercase tracking-[.3em]">
                        Syncing signals…
                    </p>
                </div>
            )}

            {/* ── EMPTY ─────────────────────────────────────────────────────────── */}
            {!isLoading && !hasContent && <EmptyState />}

            {/* ── INCOMING CHALLENGES ───────────────────────────────────────────── */}
            {incoming.length > 0 && (
                <section>
                    <SectionLabel
                        icon={<Swords size={11} />}
                        label={`Incoming · ${incoming.length}`}
                    />
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-2.5">
                            {incoming.map((c: Challenge) => (
                                <IncomingCard
                                    key={c.showdownId}
                                    challenge={c}
                                    onAccept={() => {
                                        accept(c.showdownId);
                                        router.push(`/course/${params.id}/duels/challenge/${c.showdownId}`);
                                    }}
                                    onDecline={() => decline(c.showdownId)}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                </section>
            )}

            {/* ── OUTGOING ──────────────────────────────────────────────────────── */}
            {outgoing.length > 0 && (
                <section>
                    <SectionLabel
                        icon={<Hourglass size={11} />}
                        label={`Awaiting Response · ${outgoing.length}`}
                    />
                    <div className="space-y-2.5">
                        {outgoing.map((c: Challenge) => (
                            <OutgoingCard
                                key={c.showdownId}
                                challenge={c}
                                onClick={() =>
                                    router.push(`/course/${params.id}/duels/challenge/${c.showdownId}`)
                                }
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── INSTRUCTOR FORGE QUEUE ────────────────────────────────────────── */}
            {canReview && pendingForge.length > 0 && (
                <section>
                    <SectionLabel
                        icon={<Hammer size={11} />}
                        label="Instructor Console"
                    />
                    <button
                        onClick={() => router.push(`/course/${params.id}/forge/review`)}
                        className="w-full flex items-center gap-3 rounded-2xl border border-orange-500/25 bg-orange-500/[0.05] px-4 py-4 active:scale-[.98] transition-all hover:bg-orange-500/[0.08]"
                        style={{ boxShadow: "0 0 20px rgba(249,115,22,.06)" }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
                            <ShieldCheck size={16} className="text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="font-display text-[12px] font-black text-white uppercase tracking-wide">
                                Tempering Queue
                            </p>
                            <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider mt-0.5">
                                Questions awaiting review
                            </p>
                        </div>
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center font-display text-[11px] font-black text-black shrink-0"
                            style={{ background: "#f97316", boxShadow: "0 0 10px rgba(249,115,22,.5)" }}
                        >
                            {pendingForge.length}
                        </div>
                    </button>
                </section>
            )}

        </div>
    );
}