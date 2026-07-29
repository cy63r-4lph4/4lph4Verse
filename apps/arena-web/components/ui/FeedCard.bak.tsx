"use client";

import { useState } from "react";
import { cn } from "@verse/ui";
import {
  Swords, Zap, Megaphone, HelpCircle, Lightbulb,
  Trophy, ChevronRight, CheckCircle2, XCircle,
  MessageCircle, Send, Pin, MoreHorizontal,
  Pencil, Trash2, X, Check,
} from "lucide-react";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import useAuth from "@verse/arena-web/hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseFeedItem {
  id:        string;
  time:      string;
  reactions?: Record<string, number>;
  comments?:  CommentShape[];
}

interface CommentShape {
  id:     string;
  user:   string;
  avatar: string;
  text:   string;
  time:   string;
}

interface BattleResultItem extends BaseFeedItem {
  type:     "battle";
  winner:   { name: string; avatar: string; score: number };
  loser:    { name: string; avatar: string; score: number };
  quizName: string;
}

interface ChallengeItem extends BaseFeedItem {
  type:       "challenge";
  challenger: { name: string; avatar: string };
  isForYou?:  boolean;
}

interface AnnouncementItem extends BaseFeedItem {
  type:       "announcement";
  instructor: { name: string; avatar: string };
  title:      string;
  content:    string;
  pinned?:    boolean;
}

interface UserPostItem extends BaseFeedItem {
  type:     "post";
  author:   { name: string; avatar: string };
  postType: "thought" | "question" | "announcement";
  content:  string;
}

export type FeedItemType =
  | BattleResultItem
  | ChallengeItem
  | AnnouncementItem
  | UserPostItem;

interface FeedCardProps {
  item:                FeedItemType;
  onAcceptChallenge?:  () => void;
  onDeclineChallenge?: () => void;
  onReact?:            (type: string) => void;
  onAddComment?:       (text: string) => void;
  onDelete?:           () => void;
  onEdit?:             (newContent: string) => void;
  className?:          string;
  style?:              React.CSSProperties;
}

// ─── Accent config ────────────────────────────────────────────────────────────

const ACCENT: Record<FeedItemType["type"], string> = {
  battle:       "from-orange-500/60 via-orange-400/20 to-transparent",
  challenge:    "from-primary/60 via-primary/20 to-transparent",
  announcement: "from-amber-400/60 via-amber-400/20 to-transparent",
  post:         "from-white/10 via-white/5 to-transparent",
};

// ─── Post actions menu ────────────────────────────────────────────────────────

function PostActions({
  item,
  onDelete,
  onEdit,
}: {
  item:      AnnouncementItem | UserPostItem;
  onDelete?: () => void;
  onEdit?:   (newContent: string) => void;
}) {
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(item.content);
  const { user }              = useAuth();

  const authorArenaUserId = (item as any)._authorArenaUserId as string | undefined;
  const isAuthor    = !!user?.arenaUserId && user.arenaUserId === authorArenaUserId;
  const isPrivileged = user?.role === "instructor" || user?.role === "admin";
  const canEdit     = isAuthor;
  const canDelete   = isAuthor || isPrivileged;

  if (!canEdit && !canDelete) return null;

  function submitEdit() {
    if (!draft.trim() || draft === item.content) { setEditing(false); return; }
    onEdit?.(draft.trim());
    setEditing(false);
  }

  // Edit mode — replaces the entire card body area
  if (editing) {
    return (
      <div className="space-y-2">
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-3 py-2.5 font-display text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 resize-none transition-colors leading-snug"
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setDraft(item.content); setEditing(false); }}
            className="flex-1 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] font-display text-[10px] font-black text-white/40 uppercase tracking-[.2em] flex items-center justify-center gap-1.5 hover:bg-white/[0.06] transition-all active:scale-95"
          >
            <X size={11} /> Cancel
          </button>
          <button
            onClick={submitEdit}
            disabled={!draft.trim() || draft === item.content}
            className="flex-1 py-2 rounded-xl font-display text-[10px] font-black text-black uppercase tracking-[.2em] flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-30"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Check size={11} /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all active:scale-90"
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          {/* Menu */}
          <div className="absolute right-0 top-8 z-20 min-w-[140px] rounded-xl border border-white/[0.08] bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden">
            {canEdit && (
              <button
                onClick={() => { setOpen(false); setEditing(true); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 font-display text-[10px] font-black text-white/60 uppercase tracking-[.2em] hover:bg-white/[0.06] hover:text-white transition-all"
              >
                <Pencil size={11} className="text-primary/70" />
                Edit
              </button>
            )}
            {canEdit && canDelete && (
              <div className="h-px bg-white/[0.05] mx-2" />
            )}
            {canDelete && (
              <button
                onClick={() => { setOpen(false); onDelete?.(); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 font-display text-[10px] font-black text-red-400/70 uppercase tracking-[.2em] hover:bg-red-500/[0.08] hover:text-red-400 transition-all"
              >
                <Trash2 size={11} />
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Reactions ────────────────────────────────────────────────────────────────

const REACTIONS = [
  { emoji: "👍", key: "respect" },
  { emoji: "🔥", key: "hype"    },
  { emoji: "😤", key: "rivalry" },
  { emoji: "💀", key: "brutal"  },
];

function ReactionStrip({
  counts  = {},
  active  = [],
  onReact,
}: {
  counts?:  Record<string, number>;
  active?:  string[];
  onReact?: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {REACTIONS.map((r) => {
        const count    = counts[r.key] ?? 0;
        const isActive = active.includes(r.key);
        return (
          <button
            key={r.key}
            onClick={() => onReact?.(r.key)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 active:scale-110",
              isActive
                ? "bg-primary/15 border border-primary/30"
                : "bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]"
            )}
          >
            <span className="text-[13px] leading-none">{r.emoji}</span>
            {count > 0 && (
              <span className={cn(
                "font-display text-[10px] font-black leading-none",
                isActive ? "text-primary" : "text-white/40"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Comments ─────────────────────────────────────────────────────────────────

function CommentSection({
  comments     = [],
  onAddComment,
}: {
  comments?:    CommentShape[];
  onAddComment?: (text: string) => void;
}) {
  const [expanded,  setExpanded]  = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [draft,     setDraft]     = useState("");

  const visible  = expanded ? comments : comments.slice(0, 2);
  const overflow = comments.length - 2;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    onAddComment?.(draft.trim());
    setDraft("");
    setShowInput(false);
  }

  return (
    <div className="space-y-2.5">
      <button
        onClick={() => setShowInput(v => !v)}
        className="flex items-center gap-1.5 text-white/25 hover:text-white/50 transition-colors"
      >
        <MessageCircle size={12} />
        <span className="font-display text-[9px] font-bold uppercase tracking-wider">
          {comments.length === 0 ? "Add comment" : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
        </span>
      </button>

      {visible.length > 0 && (
        <div className="space-y-2">
          {visible.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <ArenaAvatar src={c.avatar} size="xs" />
              <div className="flex-1 min-w-0 bg-white/[0.03] rounded-xl px-2.5 py-2">
                <div className="flex items-baseline gap-1.5 mb-0.5 min-w-0">
                  <span className="font-display text-[10px] font-black text-white uppercase tracking-wide truncate">
                    {c.user}
                  </span>
                  <span className="font-display text-[8px] font-bold text-white/20 uppercase tracking-wider shrink-0">
                    {c.time}
                  </span>
                </div>
                <p className="font-display text-[11px] font-medium text-white/60 leading-snug break-words">
                  {c.text}
                </p>
              </div>
            </div>
          ))}

          {overflow > 0 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="font-display text-[9px] font-black text-primary/60 uppercase tracking-wider hover:text-primary transition-colors pl-1"
            >
              +{overflow} more
            </button>
          )}
        </div>
      )}

      {showInput && (
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 font-display text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-colors"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="w-8 h-8 shrink-0 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary disabled:opacity-30 hover:bg-primary/25 transition-all active:scale-95"
          >
            <Send size={12} />
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Card bodies ──────────────────────────────────────────────────────────────

function BattleBody({ item }: { item: BattleResultItem }) {
  const total     = item.winner.score + item.loser.score;
  const winnerPct = total > 0 ? (item.winner.score / total) * 100 : 50;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Swords size={13} className="text-orange-400 shrink-0" />
        <span className="font-display text-[9px] font-black text-white/30 uppercase tracking-[.25em]">
          Battle Result
        </span>
        <div className="h-px flex-1 bg-white/[0.05]" />
        <span className="font-display text-[9px] font-bold text-white/20 uppercase tracking-wider shrink-0">
          {item.time}
        </span>
      </div>

      {/* VS row — min-w-0 on every flex child to prevent overflow */}
      <div className="flex items-center gap-3">

        {/* Winner */}
        <div className="flex-1 min-w-0 flex flex-col items-center gap-2">
          <div className="relative shrink-0">
            <ArenaAvatar src={item.winner.avatar} size="lg" glow glowColor="success" />
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center"
              style={{ boxShadow: "0 0 8px rgba(251,191,36,.7)" }}
            >
              <Trophy size={8} className="text-black" />
            </div>
          </div>
          <div className="text-center w-full px-1">
            <p className="font-display text-[10px] font-black text-white uppercase tracking-wide truncate">
              {item.winner.name}
            </p>
            <p
              className="font-display text-[16px] font-black text-green-400 leading-tight"
              style={{ textShadow: "0 0 8px rgba(34,197,94,.5)" }}
            >
              {item.winner.score}
            </p>
          </div>
        </div>

        {/* VS — shrink-0 so it never gets squeezed */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-px h-5 bg-gradient-to-b from-transparent to-white/15" />
          <span className="font-display text-[11px] font-black text-white/20 italic">VS</span>
          <div className="w-px h-5 bg-gradient-to-t from-transparent to-white/15" />
        </div>

        {/* Loser */}
        <div className="flex-1 min-w-0 flex flex-col items-center gap-2">
          <ArenaAvatar src={item.loser.avatar} size="lg" glow glowColor="danger" />
          <div className="text-center w-full px-1">
            <p className="font-display text-[10px] font-black text-white/40 uppercase tracking-wide truncate">
              {item.loser.name}
            </p>
            <p className="font-display text-[16px] font-black text-red-400/60 leading-tight">
              {item.loser.score}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-[4px] rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
            style={{ width: `${winnerPct}%`, boxShadow: "0 0 8px rgba(34,197,94,.5)" }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-[8px] font-bold text-white/15 uppercase tracking-wider truncate mr-2">
            {item.quizName}
          </span>
          <button className="flex items-center gap-1 font-display text-[8px] font-black text-primary/50 uppercase tracking-wider hover:text-primary transition-colors shrink-0">
            Replay <ChevronRight size={9} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChallengeBody({
  item,
  onAccept,
  onDecline,
}: {
  item:       ChallengeItem;
  onAccept?:  () => void;
  onDecline?: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={13} className="text-primary shrink-0" />
        <span className="font-display text-[9px] font-black text-white/30 uppercase tracking-[.25em]">
          Incoming Challenge
        </span>
        <div className="h-px flex-1 bg-white/[0.05]" />
        <span className="font-display text-[9px] font-bold text-white/20 uppercase tracking-wider shrink-0">
          {item.time}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className="absolute -inset-1 rounded-full border border-primary/30 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <ArenaAvatar src={item.challenger.avatar} size="lg" glow glowColor="primary" />
        </div>
        {/* min-w-0 prevents name from pushing the avatar off-screen */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-[13px] font-black text-white uppercase tracking-wide truncate">
            {item.challenger.name}
          </p>
          <p className="font-display text-[9px] font-bold text-primary/50 uppercase tracking-[.2em] mt-0.5">
            Challenges you to a duel
          </p>
        </div>
      </div>

      {item.isForYou && (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onDecline}
            className="py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] font-display text-[10px] font-black text-white/40 uppercase tracking-[.2em] flex items-center justify-center gap-2 hover:bg-white/[0.07] hover:text-white/60 transition-all active:scale-95"
          >
            <XCircle size={12} />
            Decline
          </button>
          <button
            onClick={onAccept}
            className="py-3 rounded-xl font-display text-[10px] font-black text-black uppercase tracking-[.2em] flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{
              background: "hsl(var(--primary))",
              boxShadow: "0 4px 16px hsl(var(--primary) / .35)",
            }}
          >
            <CheckCircle2 size={12} />
            Accept
          </button>
        </div>
      )}
    </div>
  );
}

function AnnouncementBody({
  item,
  editing,
  onDelete,
  onEdit,
}: {
  item:      AnnouncementItem;
  editing?:  boolean;
  onDelete?: () => void;
  onEdit?:   (text: string) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Header row with actions */}
      <div className="flex items-center gap-2">
        <Megaphone size={13} className="text-amber-400 shrink-0" />
        <span className="font-display text-[9px] font-black text-white/30 uppercase tracking-[.25em]">
          Announcement
        </span>
        {item.pinned && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 shrink-0">
            <Pin size={7} className="text-amber-400" />
            <span className="font-display text-[7px] font-black text-amber-400 uppercase tracking-wider">
              Pinned
            </span>
          </div>
        )}
        <div className="h-px flex-1 bg-white/[0.05]" />
        <span className="font-display text-[9px] font-bold text-white/20 uppercase tracking-wider shrink-0">
          {item.time}
        </span>
        <PostActions item={item} onDelete={onDelete} onEdit={onEdit} />
      </div>

      <div className="flex items-center gap-2.5">
        <ArenaAvatar src={item.instructor.avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-display text-[10px] font-black text-white/50 uppercase tracking-wide truncate">
            {item.instructor.name}
          </p>
          <p className="font-display text-[8px] font-bold text-amber-400/40 uppercase tracking-wider">
            Instructor
          </p>
        </div>
      </div>

      <p className="font-display text-[13px] font-bold text-white/80 leading-snug break-words">
        {item.content}
      </p>
    </div>
  );
}

function PostBody({
  item,
  onDelete,
  onEdit,
}: {
  item:      UserPostItem;
  onDelete?: () => void;
  onEdit?:   (text: string) => void;
}) {
  const Icon      = item.postType === "question" ? HelpCircle : Lightbulb;
  const iconColor = item.postType === "question" ? "text-sky-400" : "text-amber-400/70";
  const typeLabel = item.postType === "question" ? "Asked" : "Shared";

  return (
    <div className="space-y-3">
      {/* Header row with actions */}
      <div className="flex items-center gap-2">
        <Icon size={13} className={cn("shrink-0", iconColor)} />
        <span className="font-display text-[9px] font-black text-white/30 uppercase tracking-[.25em]">
          {typeLabel}
        </span>
        <div className="h-px flex-1 bg-white/[0.05]" />
        <span className="font-display text-[9px] font-bold text-white/20 uppercase tracking-wider shrink-0">
          {item.time}
        </span>
        <PostActions item={item} onDelete={onDelete} onEdit={onEdit} />
      </div>

      <div className="flex items-center gap-2.5">
        <ArenaAvatar src={item.author.avatar} size="sm" glow glowColor="primary" />
        {/* min-w-0 on the text container prevents flex overflow */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-[10px] font-black text-white/50 uppercase tracking-wide truncate">
            {item.author.name}
          </p>
        </div>
      </div>

      <p className="font-display text-[13px] font-bold text-white/80 leading-snug whitespace-pre-wrap break-words">
        {item.content}
      </p>
    </div>
  );
}

// ─── Card shell ───────────────────────────────────────────────────────────────

const FeedCard = ({
  item,
  onAcceptChallenge,
  onDeclineChallenge,
  onReact,
  onAddComment,
  onDelete,
  onEdit,
  className,
  style,
}: FeedCardProps) => {
  const supportsInteraction = item.type === "post" || item.type === "announcement";

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/[0.07] overflow-hidden",
        "bg-black/35 backdrop-blur-sm",
        item.type === "challenge"    && "border-primary/20",
        item.type === "announcement" && "border-amber-400/15",
        item.type === "battle"       && "border-orange-500/15",
        className,
      )}
      style={{
        boxShadow:
          item.type === "challenge"    ? "0 0 20px hsl(var(--primary) / .06)"   :
          item.type === "announcement" ? "0 0 20px rgba(251,191,36,.05)"         :
          item.type === "battle"       ? "0 0 20px rgba(249,115,22,.06)"         :
          undefined,
        ...style,
      }}
    >
      <div className={cn("h-[2px] w-full bg-gradient-to-r", ACCENT[item.type])} />

      <div className="p-4">
        {item.type === "battle" && <BattleBody item={item} />}

        {item.type === "challenge" && (
          <ChallengeBody
            item={item}
            onAccept={onAcceptChallenge}
            onDecline={onDeclineChallenge}
          />
        )}

        {item.type === "announcement" && (
          <AnnouncementBody
            item={item}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}

        {item.type === "post" && (
          <PostBody
            item={item}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}

        {supportsInteraction && (
          <div className="mt-4 pt-3 border-t border-white/[0.05] space-y-3">
            <ReactionStrip
              counts={item.reactions}
              active={(item as any)._viewerReactions}
              onReact={onReact}
            />
            <CommentSection
              comments={item.comments}
              onAddComment={onAddComment}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedCard;