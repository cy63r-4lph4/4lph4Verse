"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, ShieldCheck, Hourglass, ArrowLeft, Hammer, Bell } from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import { useNotifications } from "@verse/arena-web/hooks/useNotifications";

function dicebearUrl(name: string) {
    return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
}

function relativeTime(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "NOW";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 px-1 mb-2">
            <span className="shrink-0 text-white/40">{icon}</span>
            <span className="font-display text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">{label}</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
    );
}

export default function NotificationsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { incoming, outgoing, pendingForge, canReview, isLoading, accept, decline } = useNotifications(params.id);

    const hasAnything = incoming.length > 0 || outgoing.length > 0 || (canReview && pendingForge.length > 0);

    return (
        <EnergyBackground className="px-4 py-6" variant="duel">
            <div className="max-w-md mx-auto space-y-6">
                <header className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90"
                    >
                        <ArrowLeft size={15} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Bell size={13} className="text-primary" />
                        <span className="font-display text-[10px] font-black text-primary uppercase tracking-[0.25em]">
                            Signal Log
                        </span>
                    </div>
                </header>

                {isLoading && (
                    <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-10">
                        Syncing…
                    </p>
                )}

                {!isLoading && !hasAnything && (
                    <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
                        <Bell size={28} className="mx-auto mb-3 text-white/10" />
                        <p className="font-display text-[10px] text-white/25 uppercase tracking-widest">
                            No signals — all quiet in the arena
                        </p>
                    </div>
                )}

                {incoming.length > 0 && (
                    <section>
                        <SectionLabel icon={<Swords size={12} />} label={`Incoming Challenges · ${incoming.length}`} />
                        <AnimatePresence>
                            {incoming.map((c: any) => (
                                <motion.div
                                    key={c.showdownId}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="mb-2.5 rounded-2xl border border-primary/20 bg-primary/[0.05] p-3.5"
                                >
                                    <div className="flex items-center gap-3">
                                        <ArenaAvatar src={dicebearUrl(c.fromUsername)} size="sm" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-display text-xs font-black text-white uppercase truncate">{c.fromUsername}</p>
                                            <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider">
                                                {relativeTime(c.createdAt)} · Wants a duel
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <button
                                            onClick={() => decline(c.showdownId)}
                                            className="py-2.5 rounded-xl border border-white/10 bg-white/[0.03] font-display text-[10px] font-black text-white/50 uppercase tracking-wider active:scale-95"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => {
                                                accept(c.showdownId);
                                                router.push(`/course/${params.id}/duels/challenge/${c.showdownId}`);
                                            }}
                                            className="py-2.5 rounded-xl bg-primary text-black font-display text-[10px] font-black uppercase tracking-wider active:scale-95"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </section>
                )}

                {outgoing.length > 0 && (
                    <section>
                        <SectionLabel icon={<Hourglass size={12} />} label={`Awaiting Response · ${outgoing.length}`} />
                        {outgoing.map((c: any) => (
                            <div
                                key={c.showdownId}
                                onClick={() => router.push(`/course/${params.id}/duels/challenge/${c.showdownId}`)}
                                className="mb-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
                            >
                                <ArenaAvatar src={dicebearUrl(c.toUsername)} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-display text-xs font-black text-white uppercase truncate">{c.toUsername}</p>
                                    <p className="font-display text-[9px] font-bold text-white/25 uppercase tracking-wider">
                                        Sent {relativeTime(c.createdAt)} · No response yet
                                    </p>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {canReview && pendingForge.length > 0 && (
                    <section>
                        <SectionLabel icon={<Hammer size={12} />} label="Instructor Console" />
                        <button
                            onClick={() => router.push(`/course/${params.id}/forge/review`)}
                            className="w-full flex items-center justify-between rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-3.5 active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck size={15} className="text-orange-400" />
                                <span className="font-display text-xs font-black text-white uppercase tracking-wide">
                                    Tempering Queue
                                </span>
                            </div>
                            <span className="rounded-full bg-orange-400 px-2 py-0.5 font-display text-[10px] font-black text-black">
                                {pendingForge.length}
                            </span>
                        </button>
                    </section>
                )}
            </div>
        </EnergyBackground>
    );
}