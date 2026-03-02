"use client";

import { useState, useRef } from "react";
import ArenaAvatar from "@verse/arena-web/components/ui/ArenaAvatar";
import NeonButton from "@verse/arena-web/components/ui/NeonButton";
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetTrigger,
} from "@verse/arena-web/components/ui/sheet";
import { Textarea } from "@verse/arena-web/components/ui/textArea";
import {
  MessageSquarePlus, Lightbulb, HelpCircle,
  Megaphone, Send, Radio, Terminal,
} from "lucide-react";
import { cn } from "@verse/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

type PostType = "thought" | "question" | "announcement";

interface CreatePostSheetProps {
  currentUser: { name: string; avatar: string; level?: number };
  onCreatePost: (post: { type: PostType; content: string }) => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const POST_TYPES = [
  {
    type: "thought" as PostType,
    label: "Intel",
    sublabel: "Share insight",
    icon: Lightbulb,
    color: "text-amber-400",
    activeBg: "bg-amber-500/12",
    border: "border-amber-500/35",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    glowColor: "rgba(245,158,11,0.4)",
    placeholder: "Drop a tactical insight for the sector...",
  },
  {
    type: "question" as PostType,
    label: "Query",
    sublabel: "Ask for help",
    icon: HelpCircle,
    color: "text-sky-400",
    activeBg: "bg-sky-500/12",
    border: "border-sky-500/35",
    badgeColor: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    glowColor: "rgba(56,189,248,0.4)",
    placeholder: "Request intel from your sector...",
  },
  {
    type: "announcement" as PostType,
    label: "Signal",
    sublabel: "Announce",
    icon: Megaphone,
    color: "text-violet-400",
    activeBg: "bg-violet-500/12",
    border: "border-violet-500/35",
    badgeColor: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    glowColor: "rgba(167,139,250,0.4)",
    placeholder: "Broadcast to the entire sector...",
  },
] as const;

const MAX_CHARS = 500;

// ─── Char bar colour ──────────────────────────────────────────────────────────

function charBarColor(len: number): string {
  const pct = len / MAX_CHARS;
  if (pct >= 0.95) return "bg-red-500";
  if (pct >= 0.80) return "bg-amber-400";
  return "bg-primary";
}

function charCountColor(len: number): string {
  const pct = len / MAX_CHARS;
  if (pct >= 0.95) return "text-red-400";
  if (pct >= 0.80) return "text-amber-400";
  return "text-white/25";
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CreatePostSheet = ({ currentUser, onCreatePost }: CreatePostSheetProps) => {
  const [isOpen, setIsOpen]             = useState(false);
  const [selectedType, setSelectedType] = useState<PostType>("thought");
  const [content, setContent]           = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false); // submit flash state
  const [isShaking, setIsShaking]       = useState(false);     // empty-submit shake

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConfig = POST_TYPES.find((t) => t.type === selectedType)!;
  const charPct      = content.length / MAX_CHARS;

  // ── Shake the textarea when user tries to submit empty
  const shake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
    textareaRef.current?.focus();
  };

  // ── Submit: flash the button, brief delay, then close
  const handleSubmit = () => {
    if (!content.trim()) { shake(); return; }

    setIsBroadcasting(true);
    setTimeout(() => {
      onCreatePost({ type: selectedType, content });
      setContent("");
      setIsBroadcasting(false);
      setIsOpen(false);
    }, 600); // let the flash animation play
  };

  // ── Reset type + content when sheet closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setContent("");
        setSelectedType("thought");
        setIsBroadcasting(false);
      }, 300);
    }
  };

  return (
    <>
      {/* ── KEYFRAMES injected once ─────────────────────────────────────── */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-5px); }
          30%      { transform: translateX(5px); }
          45%      { transform: translateX(-4px); }
          60%      { transform: translateX(4px); }
          75%      { transform: translateX(-2px); }
          90%      { transform: translateX(2px); }
        }
        @keyframes broadcast-flash {
          0%   { opacity: 1; }
          30%  { opacity: 0.2; box-shadow: 0 0 40px var(--flash-color); }
          60%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { opacity: 1; }
        }
        @keyframes fab-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-3px); }
        }
        .shake-anim    { animation: shake 0.45s ease; }
        .fab-float     { animation: fab-float 3s ease-in-out infinite; }
      `}</style>

      <Sheet open={isOpen} onOpenChange={handleOpenChange}>

        {/* ── FAB ─────────────────────────────────────────────────────────── */}
        <SheetTrigger asChild>
          <button
            className="fixed bottom-28 right-6 z-50 group fab-float"
            aria-label="Create post"
          >
            {/* Glow blob behind FAB */}
            <div className="absolute inset-0 bg-primary/25 rounded-2xl blur-xl transition-all duration-300 group-hover:bg-primary/45 group-hover:blur-2xl" />

            {/* FAB body */}
            <div
              className={cn(
                "relative w-14 h-14 rounded-2xl border border-primary/50 bg-black",
                "flex items-center justify-center overflow-hidden",
                "transition-all duration-200 active:scale-90 group-hover:border-primary/80"
              )}
            >
              {/* inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />

              <MessageSquarePlus size={22} className="text-primary relative z-10" />

              {/* Bottom glow bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
          </button>
        </SheetTrigger>

        {/* ── SHEET ───────────────────────────────────────────────────────── */}
        <SheetContent
          side="bottom"
          className="bg-[#080808]/98 backdrop-blur-2xl border-t border-white/8 rounded-t-[2rem] p-0 outline-none"
        >
          {/* Top drag pill */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/10" />
          </div>

          <div className="max-w-md mx-auto px-5 pb-8 pt-2 space-y-5">

            {/* ── HEADER ────────────────────────────────────────────────── */}
            <SheetHeader className="pb-0">
              <div className="flex items-center justify-center gap-2">
                <Radio size={12} className="text-primary animate-pulse" />
                <SheetTitle className="font-display text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">
                  Establish Uplink
                </SheetTitle>
              </div>
            </SheetHeader>

            {/* ── USER IDENTITY ROW ─────────────────────────────────────── */}
            <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <ArenaAvatar src={currentUser.avatar} size="md" />
                <div>
                  <p className="font-display text-[12px] font-black text-white uppercase tracking-wide">
                    {currentUser.name}
                  </p>
                  <p className="font-display text-[8px] font-semibold text-white/25 uppercase tracking-[0.2em] mt-0.5">
                    Operator Identified
                  </p>
                </div>
              </div>

              {/* Active mode badge — transitions with type selection */}
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full border font-display text-[9px] font-black uppercase tracking-wider",
                  "transition-all duration-300",
                  activeConfig.badgeColor
                )}
              >
                {activeConfig.label}
              </span>
            </div>

            {/* ── TYPE SELECTOR ─────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-2">
              {POST_TYPES.map((pt) => {
                const Icon = pt.icon;
                const isActive = selectedType === pt.type;
                return (
                  <button
                    key={pt.type}
                    onClick={() => setSelectedType(pt.type)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 py-3.5 rounded-xl border",
                      "transition-all duration-250 outline-none active:scale-95",
                      isActive
                        ? cn(pt.activeBg, pt.border, pt.color)
                        : "bg-white/[0.03] border-transparent text-white/25 hover:bg-white/[0.06]"
                    )}
                    style={
                      isActive
                        ? { boxShadow: `0 0 16px ${pt.glowColor}` }
                        : undefined
                    }
                  >
                    <Icon size={18} />
                    <div className="text-center">
                      <p className="font-display text-[9px] font-black uppercase tracking-widest leading-none">
                        {pt.label}
                      </p>
                      <p className="font-display text-[7px] font-semibold uppercase tracking-wider opacity-60 mt-0.5 leading-none">
                        {pt.sublabel}
                      </p>
                    </div>

                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-current" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── TEXTAREA ──────────────────────────────────────────────── */}
            <div
              className={cn(
                "relative group rounded-xl",
                isShaking && "shake-anim"
              )}
            >
              {/* INPUT_STREAM label */}
              <div className="flex items-center gap-1 mb-1.5 px-1">
                <Terminal size={9} className="text-white/20 group-focus-within:text-primary transition-colors duration-300" />
                <span className="font-display text-[8px] font-bold uppercase tracking-[0.25em] text-white/20 group-focus-within:text-primary/60 transition-colors duration-300">
                  Input Stream
                </span>
              </div>

              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
                placeholder={activeConfig.placeholder}
                className={cn(
                  "min-h-[140px] w-full bg-black/50 rounded-xl resize-none",
                  "border border-white/8 text-sm text-white/80 font-mono leading-relaxed",
                  "placeholder:text-white/20 placeholder:font-mono",
                  "focus:outline-none focus:ring-0",
                  "transition-all duration-300",
                  "focus:border-white/20",
                  // border tints warning/danger when near limit
                  charPct >= 0.95
                    ? "focus:border-red-500/40"
                    : charPct >= 0.80
                    ? "focus:border-amber-500/40"
                    : "focus:border-primary/30"
                )}
              />

              {/* Char bar + count */}
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="h-[3px] flex-1 rounded-full bg-white/[0.06] overflow-hidden mr-3">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      charBarColor(content.length)
                    )}
                    style={{ width: `${charPct * 100}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "font-display text-[9px] font-bold tabular-nums transition-colors duration-300",
                    charCountColor(content.length)
                  )}
                >
                  {content.length}/{MAX_CHARS}
                </span>
              </div>
            </div>

            {/* ── BROADCAST BUTTON ──────────────────────────────────────── */}
            <button
              onClick={handleSubmit}
              disabled={isBroadcasting}
              className={cn(
                "relative w-full py-4 rounded-2xl overflow-hidden",
                "font-display text-[13px] font-black uppercase tracking-[0.2em] text-white",
                "flex items-center justify-center gap-2.5",
                "transition-all duration-200 active:scale-[0.98] outline-none",
                "disabled:cursor-not-allowed",
                !content.trim() && "opacity-40"
              )}
              style={{
                background: isBroadcasting
                  ? "linear-gradient(135deg, #ffffff22, #ffffff11)"
                  : "linear-gradient(135deg, var(--primary, #6366f1), color-mix(in srgb, var(--primary, #6366f1) 70%, black))",
                boxShadow: isBroadcasting
                  ? `0 0 40px ${activeConfig.glowColor}`
                  : `0 4px 20px ${activeConfig.glowColor}`,
                animation: isBroadcasting ? "broadcast-flash 0.6s ease" : "none",
              }}
            >
              {isBroadcasting ? (
                <>
                  {/* Sending state */}
                  <Radio size={16} className="animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                  <span>Broadcast Signal</span>
                </>
              )}

              {/* Shimmer sweep on hover */}
              {!isBroadcasting && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.08) 50%, transparent 65%)",
                  }}
                />
              )}
            </button>

          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreatePostSheet;