"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Activity, ShieldAlert, Trophy, Zap } from "lucide-react";
import { cn } from "@verse/ui";

import MiniLeaderboard from "@verse/arena-web/components/ui/MiniLeaderboard";
import { CreatePostSheet } from "@verse/arena-web/app/course/[id]/modules/CreatePostSheet";
import { ChallengeHero } from "@verse/arena-web/app/course/[id]/modules/ChallengeHero";
import { useArena } from "@verse/arena-web/app/course/[id]/ArenaContext";
import ActiveFighters from "@verse/arena-web/app/course/[id]/modules/ActiveFighters";
import FeedCard from "@verse/arena-web/components/ui/FeedCard";
import { useFeed } from "@verse/arena-web/hooks/useFeed";
import { useArenaToken } from "@verse/arena-web/hooks/useArenaToken";
import { getShowdownSocket } from "@verse/arena-web/lib/showdown/socket";
import useAuth from "@verse/arena-web/hooks/useAuth";
import { useForgePending } from "@verse/arena-web/hooks/useForgeSubmissions";
import { InstructorToolsPanel } from "@verse/arena-web/components/ui/InstructorToolsPanel";
import { useCoursePresence } from "@verse/arena-web/hooks/useCoursePresence";
import { useCreateDuelChallenge } from "@verse/arena-web/hooks/useDuelChallengeActions";

const MOCK_LEADERBOARD = [
    { rank: 1, name: "NIGHT_HAWK", score: 12500, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=hawk" },
    { rank: 2, name: "CYBER_QUEEN", score: 11200, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=queen" },
    { rank: 3, name: "BLAZE_RUN", score: 9800, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze" },
];

function TournamentAlert({ startsIn }: { startsIn: string }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
            <ShieldAlert size={15} className="text-red-500 shrink-0 animate-pulse" />
            <p className="text-[10px] font-mono text-red-400 uppercase tracking-tighter">
                Warning: Sector tournament starts in{" "}
                <span className="text-red-300 font-bold">{startsIn}</span>
            </p>
        </div>
    );
}

function SectionHeading({
    icon,
    label,
    iconClass,
}: {
    icon: React.ReactNode;
    label: string;
    iconClass?: string;
}) {
    return (
        <div className="flex items-center gap-2 px-1">
            <span className={cn("shrink-0", iconClass)}>{icon}</span>
            <h2 className="font-display text-[10px] font-black text-white/50 uppercase tracking-[0.3em] whitespace-nowrap">
                {label}
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-primary/20 to-transparent" />
        </div>
    );
}

export default function CourseHome() {
    const params = useParams<{ id: string }>();
    const courseId = params.id;
    const router = useRouter();
    const token = useArenaToken();

    const { currentUser } = useArena();
    const { user } = useAuth();

    const canManage = !!user && (user.role === "instructor" || user.role === "admin");
    const { data: pendingForge = [] } = useForgePending(courseId, canManage);
    const createChallenge = useCreateDuelChallenge(courseId);



    const [isBooting, setIsBooting] = useState(true);
    const [countdown, setCountdown] = useState("02:45:12");

    const { data: feedItems = [], isLoading: feedLoading, createPost, react, comment } = useFeed(courseId);

    useEffect(() => {
        const t = setTimeout(() => setIsBooting(false), 600);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const tick = setInterval(() => {
            setCountdown((prev) => {
                const [h, m, s] = prev.split(":").map(Number);
                const total = h * 3600 + m * 60 + s - 1;
                if (total <= 0) { clearInterval(tick); return "00:00:00"; }
                const nh = Math.floor(total / 3600);
                const nm = Math.floor((total % 3600) / 60);
                const ns = total % 60;
                return [nh, nm, ns].map((n) => String(n).padStart(2, "0")).join(":");
            });
        }, 1000);
        return () => clearInterval(tick);
    }, []);

    const handleCreatePost = useCallback(
        (payload: { type: "thought" | "question" | "announcement"; content: string }) => {
            createPost.mutate(payload);
        },
        [createPost],
    );

    function handleAcceptChallenge(showdownId: string) {
        if (!token) return;
        getShowdownSocket(token).emit("duel:accept", { showdownId });
        router.push(`/course/${courseId}/duels/challenge/${showdownId}`);
    }

    function handleDeclineChallenge(showdownId: string) {
        if (!token) return;
        getShowdownSocket(token).emit("duel:decline", { showdownId });
    }
    function handleChallengeFighter(fighter: { id: string }) {
        createChallenge.mutate(fighter.id, {
            onSuccess: (showdown) => {
                router.push(`/course/${courseId}/duels/challenge/${showdown.id}`);
            },
        });
    }
    function dicebearUrl(name: string) {
        return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`;
    }

    const reveal = () =>
        cn("transition-all duration-700", isBooting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0");

    const revealStyle = (delayMs: number): React.CSSProperties =>
        isBooting ? {} : { transitionDelay: `${delayMs}ms` };

    const presence = useCoursePresence(courseId);
    const liveFighters = presence
        .filter((f) => f.arenaUserId !== user?.arenaUserId)
        .map((f) => ({
            id: f.arenaUserId,
            name: f.username,
            isOnline: f.status === "online",
            avatar: dicebearUrl(f.username),
        }));
    return (
        <div className="w-full space-y-8 py-6">

            {/* ── 1. CHALLENGE HERO ──────────────────────────────────────────────── */}
            <section
                className={cn("transition-all duration-700", isBooting ? "opacity-0 scale-95" : "opacity-100 scale-100")}
                style={{ transitionDelay: "100ms" }}
            >
                <ChallengeHero
                    onSelectMode={(mode) => {
                        if (mode === "duel") {
                            document.getElementById("fighter-radar")?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }}
                />            </section>

            {/* ── 2. ACTIVE FIGHTERS — now real presence ──────────────────────────── */}
            <section id="fighter-radar" className={reveal()} style={revealStyle(200)}>
                <div className="space-y-3">
                    <SectionHeading icon={<Zap size={14} className="text-primary animate-pulse" />} label={`Fighters_Online · ${liveFighters.length}`} iconClass="text-primary" />
                    {liveFighters.length > 0 ? (
                        <ActiveFighters fighters={liveFighters} onChallenge={handleChallengeFighter} />
                    ) : (
                        <p className="font-display text-[10px] text-white/20 uppercase tracking-widest text-center py-4">
                            No one else is online right now
                        </p>
                    )}
                </div>
            </section>

            {/* ── 3. LIVE TACTICAL FEED ──────────────────────────────────────────── */}
            <section className={reveal()} style={revealStyle(300)}>
                <div className="space-y-4">
                    <SectionHeading icon={<Activity size={14} className="text-primary animate-pulse" />} label="Live_Tactical_Logs" />
                    <TournamentAlert startsIn={countdown} />

                    <div className="space-y-3">
                        {feedLoading && (
                            <p className="font-display text-[10px] text-white/25 uppercase tracking-widest text-center py-6">
                                Syncing feed…
                            </p>
                        )}
                        {!feedLoading && feedItems.length === 0 && (
                            <p className="font-display text-[10px] text-white/25 uppercase tracking-widest text-center py-6">
                                No activity yet — be the first to broadcast.
                            </p>
                        )}
                        {feedItems.map((item, idx) => {
                            const showdownId = (item as any)._showdownId as string | undefined;
                            const postId = (item as any)._postId as string | undefined;
                            return (
                                <div
                                    key={item.id}
                                    className={cn("transition-all duration-500", isBooting ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0")}
                                    style={{ transitionDelay: `${400 + idx * 80}ms` }}
                                >
                                    <FeedCard
                                        item={item}
                                        onAcceptChallenge={showdownId ? () => handleAcceptChallenge(showdownId) : undefined}
                                        onDeclineChallenge={showdownId ? () => handleDeclineChallenge(showdownId) : undefined}
                                        onReact={postId ? (type) => react.mutate({ postId, type }) : undefined}
                                        onAddComment={postId ? (content) => comment.mutate({ postId, content }) : undefined}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 4. LEADERBOARD (mock — real backend later) ──────────────────────── */}
            <section className={reveal()} style={revealStyle(500)}>
                <div className="space-y-3">
                    <SectionHeading icon={<Trophy size={14} className="text-yellow-400" />} label="Sector_Rankings" />
                    <MiniLeaderboard players={MOCK_LEADERBOARD} />
                </div>
            </section>

            {/* ── 5. CREATE POST FAB ─────────────────────────────────────────────── */}
            <CreatePostSheet currentUser={currentUser} onCreatePost={handleCreatePost} />
        </div>
    );
}