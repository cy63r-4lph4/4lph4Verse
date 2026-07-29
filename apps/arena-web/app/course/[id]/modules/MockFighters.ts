// mockFighters.ts

import { Fighter } from "@verse/arena-web/app/course/[id]/modules/ActiveFighters";
import { FeedItemType } from "@verse/arena-web/components/ui/FeedCard";

export const mockFighters: Fighter[] = [
    { id: "1", name: "NIGHT_HAWK", isOnline: true, level: 18, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=hawk" },
    { id: "2", name: "CYBER_QUEEN", isOnline: true, level: 14, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=queen" },
    { id: "3", name: "MORPH_ZERO", isOnline: false, level: 9, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=morph" },
    { id: "4", name: "NEO_X", isOnline: false, level: 16, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=neo" },
    { id: "5", name: "BLAZE_RUN", isOnline: true, level: 11, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=blaze" },
    { id: "6", name: "SHADOW_SIX", isOnline: false, level: 7, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=six" },
    { id: "7", name: "TRIN_03", isOnline: true, level: 12, avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=trin" },
];

