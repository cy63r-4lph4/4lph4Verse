"use client";

import { useState } from "react";
import { cn } from "@verse/ui";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import FeedComments from "@verse/arena-web/components/ui/FeedComments";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import {
  Swords, Zap, Brain, Trophy, Megaphone,
  Clock, ChevronRight, Lightbulb, HelpCircle, Share2, Pin,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseFeedItem {
  id: string;
  time: string;
  reactions?: Record<string, number>;
  comments?: Array<{ id: string; user: string; avatar: string; text: string; time: string }>;
}

interface BattleResultItem extends BaseFeedItem {
  type: "battle";
  winner: { name: string; avatar: string; score: number };
  loser:  { name: string; avatar: string; score: number };
  quizName: string;
}

interface ChallengeItem extends BaseFeedItem {
  type: "challenge";
  challenger: { name: string; avatar: string };
  expiresIn: string;
  isForYou?: boolean;
}

interface NewQuizItem extends BaseFeedItem {
  type: "quiz";
  quizName: string;
  difficulty: "easy" | "medium" | "hard";
  instructor: { name: string; avatar: string };
}

interface RankChangeItem extends BaseFeedItem {
  type: "rank";
  user: { name: string; avatar: string };
  newRank: string;
  direction: "up" | "down";
}

interface AnnouncementItem extends BaseFeedItem {
  type: "announcement";
  instructor: { name: string; avatar: string };
  title: string;
  content: string;
  pinned?: boolean;
}

interface UserPostItem extends BaseFeedItem {
  type: "post";
  author: { name: string; avatar: string };
  postType: "thought" | "question" | "announcement";
  content: string;
}

export type FeedItemType =
  | BattleResultItem
  | ChallengeItem
  | NewQuizItem
  | RankChangeItem
  | AnnouncementItem
  | UserPostItem;

interface FeedCardProps {
  item: FeedItemType;
  onAcceptChallenge?: () => void;
  onDeclineChallenge?: () => void;
  onReviewBattle?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  battle:       { label: "Battle Result",   dotColor: "#ef4444", accent: "from-red-500 via-orange-500" },
  challenge:    { label: "Challenge",        dotColor: "#f59e0b", accent: "from-amber-500 via-yellow-400" },
  quiz:         { label: "New Quiz",         dotColor: "#6366f1", accent: "from-indigo-500 via-violet-400" },
  rank:         { label: "Rank Change",      dotColor: "#22c55e", accent: "from-green-500 via-emerald-400" },
  announcement: { label: "Announcement",     dotColor: "#6366f1", accent: "from-indigo-500 via-violet-400" },
  post:         { label: "Student Post",     dotColor: "#06b6d4", accent: "from-cyan-500 via-sky-400" },
} as const;

const DIFFICULTY_COLOR = {
  easy:   "text-green-400 bg-green-500/10 border-green-500/25",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  hard:   "text-red-400   bg-red-500/10   border-red-500/25",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Thin 2px accent bar at top of every card — color varies by type */
function AccentBar({ gradient }: { gradient: string }) {
  return (
    <div className={cn("h-[2px] w-full bg-gradient-to-r to-transparent", gradient)} />
  );
}

/** Unified card header: type label + dot + time + share */
function CardHeader({ item }: { item: FeedItemType }) {
  const cfg = TYPE_CONFIG[item.type];
  const accentLabel =
    item.type === "rank"
      ? (item as RankChangeItem).direction === "up" ? "#22c55e" : "#ef4444"
      : cfg.dotColor;

  return (
    <div className="flex items-center justify-between px-3.5 py-2 bg-black/20 border-b border-white/[0.04]">
      <div className="flex items-center gap-2">
        <span
          className="w-[5px] h-[5px] rounded-full shrink-0"
          style={{ background: accentLabel, boxShadow: `0 0 6px ${accentLabel}` }}
        />
        <span className="font-display text-[9px] font-bold text-white/25 uppercase tracking-[0.25em]">
          {cfg.label}
          {item.type === "announcement" && (item as AnnouncementItem).pinned && " · Pinned"}
          &nbsp;·&nbsp;{item.time}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {item.type === "announcement" && (item as AnnouncementItem).pinned && (
          <Pin size={10} className="text-indigo-400" />
        )}
        <button className="text-white/15 hover:text-white/40 transition-colors">
          <Share2 size={12} />
        </button>
      </div>
    </div>
  );
}

/** Reaction buttons with local bump state */
function Reactions({ initial }: { initial?: Record<string, number> }) {
  const DEFAULT_REACTIONS: Record<string, { emoji: string; count: number }> = {
    swords: { emoji: "⚔️", count: 0 },
    fire:   { emoji: "🔥", count: 0 },
  };

  const [reactions, setReactions] = useState(() => {
    if (!initial) return DEFAULT_REACTIONS;
    return Object.fromEntries(
      Object.entries(initial).map(([key, count]) => [
        key,
        { emoji: key === "respect" ? "⚔️" : "🔥", count },
      ])
    );
  });

  const bump = (key: string) => {
    setReactions((prev) => ({
      ...prev,
      [key]: { ...prev[key], count: prev[key].count + 1 },
    }));
  };

  return (
    <div className="flex gap-1.5 items-center">
      {Object.entries(reactions).map(([key, { emoji, count }]) => (
        <button
          key={key}
          onClick={() => bump(key)}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-lg",
            "bg-white/[0.04] border border-white/[0.06]",
            "transition-all duration-150 active:scale-90",
            "hover:bg-white/[0.08] hover:border-white/[0.12]"
          )}
        >
          <span className="text-xs leading-none">{emoji}</span>
          <span className="font-display text-[10px] font-bold text-white/40 leading-none">
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Shared footer strip */
function CardFooter({ item }: { item: FeedItemType }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-white/[0.04] bg-black/10">
      <Reactions initial={item.reactions} />
      <span className="font-display text-[9px] font-semibold text-white/20 uppercase tracking-[0.15em]">
        {item.time}
      </span>
    </div>
  );
}

// ─── Card bodies ──────────────────────────────────────────────────────────────

function BattleBody({ item, onReview }: { item: BattleResultItem; onReview?: () => void }) {
  const total = item.winner.score + item.loser.score || 1;
  const winPct = Math.round((item.winner.score / total) * 100);

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* VS layout */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Winner */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative">
            <div
              className="absolute -inset-[3px] rounded-full border border-green-500/50"
              style={{ boxShadow: "0 0 12px rgba(34,197,94,.3)" }}
            />
            <ArenaAvatar src={item.winner.avatar} size="md" />
          </div>
          <p className="font-display text-[11px] font-black text-white uppercase tracking-wide max-w-[72px] truncate text-center">
            {item.winner.name}
          </p>
          <p className="font-display text-[12px] font-black text-green-400 tracking-wide">
            {item.winner.score} PTS
          </p>
        </div>

        {/* VS */}
        <p className="font-display text-[11px] font-black text-white/20 tracking-widest">VS</p>

        {/* Loser */}
        <div className="flex flex-col items-center gap-1.5 opacity-50">
          <ArenaAvatar src={item.loser.avatar} size="md" />
          <p className="font-display text-[11px] font-black text-white uppercase tracking-wide max-w-[72px] truncate text-center">
            {item.loser.name}
          </p>
          <p className="font-display text-[12px] font-black text-red-400 tracking-wide">
            {item.loser.score} PTS
          </p>
        </div>
      </div>

      {/* Score bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-l-full transition-all duration-700"
          style={{ width: `${winPct}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-r-full ml-auto transition-all duration-700"
          style={{ width: `${100 - winPct}%` }}
        />
      </div>

      {/* Quiz pill */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
        <div>
          <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Topic</p>
          <p className="font-display text-[11px] font-black text-white/80 uppercase tracking-wide mt-0.5">
            {item.quizName}
          </p>
        </div>
        <button
          onClick={onReview}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 transition-all hover:bg-orange-500/20"
        >
          Review <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}

function ChallengeBody({
  item,
  onAccept,
  onDecline,
}: {
  item: ChallengeItem;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {/* Pulsing ring on challenger avatar */}
        <div className="relative shrink-0">
          <div
            className="absolute -inset-[4px] rounded-full border border-amber-500/50"
            style={{ boxShadow: "0 0 14px rgba(245,158,11,.35)", animation: "pulse 2s ease-in-out infinite" }}
          />
          <ArenaAvatar src={item.challenger.avatar} size="md" />
        </div>
        <div className="flex-1">
          <p className="font-display text-[13px] font-black text-white leading-tight">
            <span className="text-amber-400">{item.challenger.name}</span>
            {item.isForYou ? " challenged YOU to a duel" : " issued an open challenge"}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Clock size={10} className="text-amber-500/60" />
            <span className="font-display text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.1em]">
              {item.expiresIn} remaining
            </span>
          </div>
        </div>
      </div>

      {item.isForYou && (
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="flex-1 py-2.5 rounded-xl font-display text-[12px] font-black uppercase tracking-wider text-white transition-transform active:scale-97"
            style={{
              background: "linear-gradient(135deg,#f59e0b,#d97706)",
              boxShadow: "0 4px 16px rgba(245,158,11,.35)",
            }}
          >
            ⚔ Accept Battle
          </button>
          <button
            onClick={onDecline}
            className="px-5 py-2.5 rounded-xl font-display text-[12px] font-bold uppercase tracking-wide text-white/30 bg-white/[0.04] border border-white/[0.08] hover:text-white/50 transition-colors"
          >
            Pass
          </button>
        </div>
      )}
    </div>
  );
}

function RankBody({ item }: { item: RankChangeItem }) {
  const up = item.direction === "up";
  return (
    <div className="p-4 flex items-center gap-3">
      <ArenaAvatar
        src={item.user.avatar}
        size="md"
        className={cn(up ? "ring-2 ring-green-500/40 ring-offset-1 ring-offset-black" : "ring-2 ring-red-500/40 ring-offset-1 ring-offset-black")}
      />
      <span
        className="font-display text-3xl font-black leading-none shrink-0"
        style={{
          color: up ? "#4ade80" : "#f87171",
          textShadow: up ? "0 0 14px rgba(74,222,128,.5)" : "0 0 14px rgba(248,113,113,.5)",
        }}
      >
        {up ? "↑" : "↓"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-display text-[13px] font-black text-white leading-tight">
          {item.user.name} {up ? "promoted to" : "demoted to"}
        </p>
        <p
          className="font-display text-[17px] font-black leading-tight mt-0.5"
          style={{
            color: up ? "#fbbf24" : "#f87171",
            textShadow: up ? "0 0 10px rgba(251,191,36,.35)" : "none",
          }}
        >
          {item.newRank}
        </p>
        <p className="font-display text-[9px] font-semibold text-white/25 uppercase tracking-[0.15em] mt-1">
          Combat rating recalibrated
        </p>
      </div>
    </div>
  );
}

function AnnouncementBody({ item }: { item: AnnouncementItem }) {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl overflow-hidden border border-indigo-500/30 shrink-0 bg-black/40">
          <ArenaAvatar src={item.instructor.avatar} size="sm" className="w-full h-full rounded-none" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
            {item.instructor.name}
          </p>
          <p className="font-display text-[14px] font-black text-white leading-tight mt-0.5">
            {item.title}
          </p>
        </div>
      </div>
      <p className="text-[12px] text-white/55 leading-relaxed pl-12">
        {item.content}
      </p>
    </div>
  );
}

function PostBody({ item }: { item: UserPostItem }) {
  const typeLabel = {
    thought: { icon: <Lightbulb size={9} />, label: "Thought", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
    question: { icon: <HelpCircle size={9} />, label: "Question", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25" },
    announcement: { icon: <Megaphone size={9} />, label: "Post", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25" },
  }[item.postType];

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <ArenaAvatar src={item.author.avatar} size="sm" />
        <div>
          <p className="font-display text-[12px] font-black text-white uppercase tracking-wide">
            {item.author.name}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-px rounded border",
              "font-display text-[8px] font-bold uppercase tracking-[0.15em]",
              typeLabel.color
            )}
          >
            {typeLabel.icon} {typeLabel.label}
          </span>
        </div>
      </div>
      <p className="text-[13px] text-white/65 leading-relaxed pl-10">
        {item.content}
      </p>
    </div>
  );
}

function QuizBody({ item }: { item: NewQuizItem }) {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Brain size={18} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-[14px] font-black text-white leading-tight uppercase tracking-wide">
            {item.quizName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={cn(
                "px-1.5 py-px rounded border font-display text-[8px] font-bold uppercase tracking-[0.15em]",
                DIFFICULTY_COLOR[item.difficulty]
              )}
            >
              {item.difficulty}
            </span>
            <span className="font-display text-[9px] text-white/30 uppercase tracking-[0.1em]">
              by {item.instructor.name}
            </span>
          </div>
        </div>
      </div>
      <button className="w-full py-2.5 rounded-xl font-display text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-97"
        style={{
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          boxShadow: "0 4px 16px rgba(99,102,241,.3)",
        }}
      >
        Enter Quiz Arena
      </button>
    </div>
  );
}

// ─── Main FeedCard ────────────────────────────────────────────────────────────

export function FeedCard({
  item,
  onAcceptChallenge,
  onDeclineChallenge,
  onReviewBattle,
  className,
  style,
}: FeedCardProps) {
  const cfg = TYPE_CONFIG[item.type];
  const accentGradient =
    item.type === "rank"
      ? (item as RankChangeItem).direction === "up"
        ? "from-green-500 via-emerald-400"
        : "from-red-500 via-red-400"
      : cfg.accent;

  return (
    <div
      style={style}
      className={cn(
        "relative w-full rounded-2xl overflow-hidden",
        "bg-black/40 backdrop-blur-md",
        "border border-white/[0.07]",
        "transition-all duration-200 hover:border-white/[0.12]",
        className
      )}
    >
      <AccentBar gradient={accentGradient} />
      <CardHeader item={item} />

      {item.type === "battle"       && <BattleBody       item={item} onReview={onReviewBattle} />}
      {item.type === "challenge"    && <ChallengeBody    item={item} onAccept={onAcceptChallenge} onDecline={onDeclineChallenge} />}
      {item.type === "rank"         && <RankBody         item={item} />}
      {item.type === "announcement" && <AnnouncementBody item={item} />}
      {item.type === "post"         && <PostBody         item={item} />}
      {item.type === "quiz"         && <QuizBody         item={item} />}

      <CardFooter item={item} />

      {item.comments && item.comments.length > 0 && (
        <div className="px-3.5 pb-3 border-t border-white/[0.04]">
          <FeedComments comments={item.comments} />
        </div>
      )}
    </div>
  );
}

export default FeedCard;