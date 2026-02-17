"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Activity, ShieldAlert } from "lucide-react";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { cn } from "@verse/ui";
import ActiveFighters from "@verse/arena-web/components/ui/ActiveFighters";
import MiniLeaderboard from "@verse/arena-web/components/ui/MiniLeaderboard";
import { CourseBottomNav } from "@verse/arena-web/app/course/[id]/modules/BottomNav";
import { CourseHeader } from "@verse/arena-web/app/course/[id]/modules/SectorSwitcher";
import FeedCard, { FeedItemType } from "@verse/arena-web/components/ui/FeedCard";
import { CreatePostSheet } from "@verse/arena-web/app/course/[id]/modules/CreatePostSheet";
import { ChallengeHero } from "@verse/arena-web/app/course/[id]/modules/ChallengeHero";

// Tactical Components


// --- MOCK DATA ---
const currentCourse = { id: "sector-7g", code: "CS_101", name: "DATA_STRUCTURES", members: 124 };
const allCourses = [currentCourse, { id: "sector-42", code: "MATH_201", name: "CALCULUS_II", members: 89 }];
const currentUser = { name: "SHADOW_OPERATOR", level: 14, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=shadow" };


const mockFeed: FeedItemType[] = [
    {
        id: "log-001",
        type: "battle",
        time: "2M_AGO",
        winner: { name: "NIGHT_HAWK", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=hawk", score: 98 },
        loser: { name: "BLAZE_RUNNER", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze", score: 74 },
        quizName: "BINARY_SEARCH_TREES",
        reactions: { respect: 5 }
    },
    {
        id: "log-002",
        type: "rank",
        time: "15M_AGO",
        user: { name: "CYBER_QUEEN", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=queen" },
        newRank: "PLATINUM_III",
        direction: "up"
    },
    {
        id: "log-003",
        type: "battle",
        time: "2M_AGO",
        winner: { name: "NIGHT_HAWK", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=hawk", score: 98 },
        loser: { name: "BLAZE_RUNNER", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze", score: 74 },
        quizName: "BINARY_SEARCH_TREES",
        reactions: { respect: 5 }
    },
    {
        id: "log-004",
        type: "battle",
        time: "2M_AGO",
        winner: { name: "NIGHT_HAWK", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=hawk", score: 98 },
        loser: { name: "BLAZE_RUNNER", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze", score: 74 },
        quizName: "BINARY_SEARCH_TREES",
        reactions: { respect: 5 }
    },
];

export default function CourseHome() {
    const [isBooting, setIsBooting] = useState(true);
    const [feedItems, setFeedItems] = useState<FeedItemType[]>(mockFeed);

    useEffect(() => {
        // Simulate UI Calibration
        const timer = setTimeout(() => setIsBooting(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleCreatePost = (post: any) => {
        const newEntry: FeedItemType = {
            id: `log-${Date.now()}`,
            type: "battle", // Or custom post type
            time: "NOW",
            winner: { name: "NIGHT_HAWK", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=hawk", score: 98 },
            loser: { name: "BLAZE_RUNNER", avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze", score: 74 },
            quizName: "BINARY_SEARCH_TREES",
            reactions: { respect: 5 }
        };
        setFeedItems([newEntry, ...feedItems]);
    };

    return (
        
            <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide overflow-x-hidden">
                <main className="max-w-md mx-auto px-4 pt-6 space-y-8 h-full ">

                    {/* 2. COMBAT TERMINAL (HERO) */}
                    <section className={cn("transition-all duration-1000 delay-300 transform", isBooting ? "scale-95 opacity-0" : "scale-100 opacity-100")}>
                        <ChallengeHero onSelectMode={(mode) => console.log(`Initializing ${mode}`)} />
                    </section>

                    {/* 3. RADAR STRIP */}
                    <section className={cn("transition-all duration-1000 delay-500", isBooting ? "opacity-0" : "opacity-100")}>
                        <ActiveFighters fighters={[
                            { id: '1', name: 'Hawk', isOnline: true, avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=1' },
                            { id: '2', name: 'Neo', isOnline: true, avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=2' },
                            { id: '3', name: 'Trinity', isOnline: false, avatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=3' },
                        ]} />
                    </section>

                    {/* 4. LIVE LOGS (FEED) */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <Activity size={14} className="text-primary animate-pulse" />
                                <h2 className="font-display text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
                                    Live_Tactical_Logs
                                </h2>
                            </div>
                            <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent" />
                        </div>

                        <div className="space-y-4">
                            {/* High Priority Alerts (Optional Placeholder) */}
                            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center gap-3 animate-pulse">
                                <ShieldAlert size={16} className="text-red-500" />
                                <p className="text-[10px] font-mono text-red-500 uppercase tracking-tighter">
                                    Warning: Sector tournament starts in 02:45:12
                                </p>
                            </div>

                            {/* Feed Cards */}
                            {feedItems.map((item, idx) => (
                                <div
                                    key={item.id}
                                    className={cn("transition-all duration-700", isBooting ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100")}
                                    style={{ transitionDelay: `${700 + (idx * 100)}ms` }}
                                >
                                    <FeedCard item={item} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. SIDEBAR WIDGET (Leaderboard) */}
                    <section className={cn("pb-10 transition-all duration-1000 delay-1000", isBooting ? "opacity-0" : "opacity-100")}>
                        <MiniLeaderboard
                            players={[
                                { rank: 1, name: "NIGHT_HAWK", score: 12500, avatar: "..." },
                                { rank: 2, name: "CYBER_QUEEN", score: 11200, avatar: "..." },
                            ]}
                        />
                    </section>
                </main>

                {/* 6. UPLINK TRIGGER (FAB) */}
                <CreatePostSheet currentUser={currentUser} onCreatePost={handleCreatePost} />
            </div>
    );
}