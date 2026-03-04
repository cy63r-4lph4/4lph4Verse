"use client";

import { useState, useEffect, useCallback } from "react";
import { Activity, ShieldAlert, Swords, Trophy, Zap } from "lucide-react";
import { cn } from "@verse/ui";

import MiniLeaderboard from "@verse/arena-web/components/ui/MiniLeaderboard";
import { CreatePostSheet } from "@verse/arena-web/app/course/[id]/modules/CreatePostSheet";
import { ChallengeHero } from "@verse/arena-web/app/course/[id]/modules/ChallengeHero";
import { useArena } from "@verse/arena-web/app/course/[id]/ArenaContext";
import { mockFeed, mockFighters } from "@verse/arena-web/app/course/[id]/modules/MockFighters";
import ActiveFighters from "@verse/arena-web/app/course/[id]/modules/ActiveFighters";
import FeedCard, { FeedItemType } from "@verse/arena-web/app/course/[id]/modules/FeedCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Fighter {
    id: string;
    name: string;
    isOnline: boolean;
    avatar: string;
}

interface LeaderboardPlayer {
    rank: number;
    name: string;
    score: number;
    avatar: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
// Separated from component so it's easy to swap for real API calls later.

// const MOCK_FIGHTERS: Fighter[] = [
//   { id: "1", name: "HAWK", isOnline: true,  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=1" },
//   { id: "2", name: "NEO",  isOnline: true,  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=2" },
//   { id: "3", name: "TRIN", isOnline: false, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=3" },
//   { id: "4", name: "MORPH",isOnline: true,  avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=4" },
//   { id: "5", name: "GHOST",isOnline: false, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=5" },
// ];

const MOCK_LEADERBOARD: LeaderboardPlayer[] = [
    { rank: 1, name: "NIGHT_HAWK", score: 12500, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=hawk" },
    { rank: 2, name: "CYBER_QUEEN", score: 11200, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=queen" },
    { rank: 3, name: "BLAZE_RUN", score: 9800, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze" },
];



// ─── Sub-components ───────────────────────────────────────────────────────────

/** Countdown alert banner — purely presentational, timer logic lives here */
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

/** Section header with a decorative trailing line */
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseHome() {
    // Pull user from context — no prop drilling needed
    const { currentUser } = useArena();

    const [isBooting, setIsBooting] = useState(true);
    const [feedItems, setFeedItems] = useState<FeedItemType[]>(mockFeed);
    const [countdown, setCountdown] = useState("02:45:12");

    // ── Boot animation: one short delay, then reveal everything at once
    // Using a single flag keeps the stagger logic simple and avoids
    // a cascade of individual opacity states.
    useEffect(() => {
        const t = setTimeout(() => setIsBooting(false), 600);
        return () => clearTimeout(t);
    }, []);

    // ── Countdown timer
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

   // ─── Types ────────────────────────────────────────────────────────────────────

// The payload coming FROM CreatePostSheet
interface CreatePostPayload {
  type: "thought" | "question" | "announcement";
  content: string;
}

// ─── Factory ──────────────────────────────────────────────────────────────────
// Builds a correctly-typed FeedItemType from a CreatePostSheet payload.
// When you add a real API, replace this with the response shape from your backend.
//
// Pattern:
//   1. Call your API  → const saved = await api.posts.create(payload)
//   2. Return saved   → return saved as FeedItemType
//   3. Prepend to feed
//
function buildFeedItem(
  payload: CreatePostPayload,
  author: { name: string; avatar: string }
): FeedItemType {
  const base = {
    id: `local-${Date.now()}`, // replace with server-generated id after API call
    time: "NOW",
    reactions: { respect: 0 },
    comments: [],
  };

  // Map the sheet's postType to the FeedCard's UserPostItem shape
  return {
    ...base,
    type: "post",
    author,
    postType: payload.type,   // "thought" | "question" | "announcement"
    content: payload.content,
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

const handleCreatePost = useCallback(
  async (payload: CreatePostPayload) => {
    const author = { name: currentUser.name, avatar: currentUser.avatar };

    // ── Optimistic update ──────────────────────────────────────────────
    // Prepend immediately so the feed feels instant.
    // The temp id starts with "local-" so you can identify and replace it
    // once the server responds.
    const optimistic = buildFeedItem(payload, author);
    setFeedItems((prev) => [optimistic, ...prev]);

    // ── Backend integration point ──────────────────────────────────────
    // Uncomment and adapt when your API is ready:
    //
    // try {
    //   const saved = await api.posts.create({
    //     courseId: currentCourse.id,
    //     type: payload.type,
    //     content: payload.content,
    //   });
    //
    //   // Swap the optimistic entry for the real one (has server id, timestamp etc.)
    //   setFeedItems((prev) =>
    //     prev.map((item) => (item.id === optimistic.id ? saved : item))
    //   );
    // } catch (err) {
    //   // Roll back the optimistic entry and show a toast
    //   setFeedItems((prev) => prev.filter((item) => item.id !== optimistic.id));
    //   toast.error("Failed to broadcast. Try again.");
    // }
  },
  [currentUser]
);

    // ── Stagger helpers
    const reveal = (delayMs: number) =>
        cn(
            "transition-all duration-700",
            isBooting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        );

    const revealStyle = (delayMs: number): React.CSSProperties =>
        isBooting ? {} : { transitionDelay: `${delayMs}ms` };

    return (
        <div className="w-full space-y-8 py-6">

            {/* ── 1. CHALLENGE HERO ──────────────────────────────────────────────── */}
            <section
                className={cn(
                    "transition-all duration-700",
                    isBooting ? "opacity-0 scale-95" : "opacity-100 scale-100"
                )}
                style={{ transitionDelay: "100ms" }}
            >
                <ChallengeHero
                    onSelectMode={(mode) => console.log(`Initializing ${mode}`)}
                />
            </section>

            {/* ── 2. ACTIVE FIGHTERS RADAR ───────────────────────────────────────── */}
            <section className={reveal(200)} style={revealStyle(200)}>
                <div className="space-y-3">
                    <SectionHeading
                        icon={<Zap size={14} className="text-primary animate-pulse" />}
                        label="Fighters_Online"
                        iconClass="text-primary"
                    />
                    <ActiveFighters fighters={mockFighters} />
                </div>
            </section>

            {/* ── 3. LIVE TACTICAL FEED ──────────────────────────────────────────── */}
            <section className={reveal(300)} style={revealStyle(300)}>
                <div className="space-y-4">
                    <SectionHeading
                        icon={<Activity size={14} className="text-primary animate-pulse" />}
                        label="Live_Tactical_Logs"
                    />

                    {/* Tournament alert with live countdown */}
                    <TournamentAlert startsIn={countdown} />

                    {/* Feed cards with per-item stagger */}
                    <div className="space-y-3">
                        {feedItems.map((item, idx) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "transition-all duration-500",
                                    isBooting
                                        ? "opacity-0 translate-y-6"
                                        : "opacity-100 translate-y-0"
                                )}
                                style={{ transitionDelay: `${400 + idx * 80}ms` }}
                            >
                                <FeedCard item={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. LEADERBOARD ─────────────────────────────────────────────────── */}
            <section className={reveal(500)} style={revealStyle(500)}>
                <div className="space-y-3">
                    <SectionHeading
                        icon={<Trophy size={14} className="text-yellow-400" />}
                        label="Sector_Rankings"
                    />
                    <MiniLeaderboard players={MOCK_LEADERBOARD} />
                </div>
            </section>

            {/* ── 5. CREATE POST FAB ─────────────────────────────────────────────── */}
            {/* Rendered outside the space-y flow so it can be fixed/floating */}
            <CreatePostSheet currentUser={currentUser} onCreatePost={handleCreatePost} />
        </div>
    );
}