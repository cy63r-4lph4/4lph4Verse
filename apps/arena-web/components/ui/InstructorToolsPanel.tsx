"use client";

import Link from "next/link";
import { ShieldCheck, Library, Hammer, Trophy, ChevronRight, Zap } from "lucide-react";
import { cn } from "@verse/ui";

// ─── Tool card ────────────────────────────────────────────────────────────────

interface ToolCardProps {
    href: string;
    icon: React.ElementType;
    label: string;
    desc: string;
    badge?: number;
    // Color identity for each tool
    glow: string;   // CSS color for box-shadow
    border: string;   // Tailwind border class
    iconBg: string;   // Tailwind bg class
    iconCol: string;   // Tailwind text class
    accent: string;   // top bar gradient
    index: number;
}

function ToolCard({
    href, icon: Icon, label, desc, badge,
    glow, border, iconBg, iconCol, accent, index,
}: ToolCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative flex items-center gap-4 rounded-2xl border p-4 overflow-hidden",
                "bg-black/40 transition-all duration-200 active:scale-[0.97]",
                border,
            )}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Top accent line */}
            <div className={cn("absolute top-0 left-0 right-0 h-[2px]", accent)} />

            {/* Hover glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 20% 50%, ${glow} 0%, transparent 70%)` }}
            />

            {/* Icon block */}
            <div
                className={cn(
                    "relative shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                    iconBg,
                )}
                style={{ boxShadow: `0 0 16px ${glow}` }}
            >
                <Icon size={20} className={iconCol} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-display text-[13px] font-black text-white uppercase tracking-wide truncate">
                        {label}
                    </p>
                    {typeof badge === "number" && badge > 0 && (
                        <span
                            className="shrink-0 px-1.5 py-0.5 rounded-full font-display text-[9px] font-black text-black"
                            style={{ background: "#f59e0b", boxShadow: "0 0 8px rgba(245,158,11,.6)" }}
                        >
                            {badge}
                        </span>
                    )}
                </div>
                <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider truncate">
                    {desc}
                </p>
            </div>

            {/* Chevron */}
            <ChevronRight
                size={16}
                className="shrink-0 text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all relative z-10"
            />
        </Link>
    );
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

const TOOLS = (courseId: string, pendingForgeCount?: number) => [
    {
        href: `/course/${courseId}/duels/tournament/create`,
        icon: Trophy,
        label: "Launch Tournament",
        desc: "Build a bracket · Take the remote",
        glow: "rgba(245,158,11,.15)",
        border: "border-amber-500/15 hover:border-amber-500/35",
        iconBg: "bg-amber-500/10",
        iconCol: "text-amber-400",
        accent: "bg-gradient-to-r from-amber-500/50 via-amber-400/20 to-transparent",
    },
    {
        href: `/course/${courseId}/forge/review`,
        icon: Hammer,
        label: "Tempering Queue",
        desc: "Review student-submitted questions",
        badge: pendingForgeCount,
        glow: "rgba(249,115,22,.15)",
        border: "border-orange-500/15 hover:border-orange-500/35",
        iconBg: "bg-orange-500/10",
        iconCol: "text-orange-400",
        accent: "bg-gradient-to-r from-orange-500/50 via-orange-400/20 to-transparent",
    },
    {
        href: `/course/${courseId}/questions`,
        icon: Library,
        label: "Question Bank",
        desc: "Author or bulk-import questions",
        glow: "rgba(var(--primary-rgb),.15)",
        border: "border-primary/15 hover:border-primary/35",
        iconBg: "bg-primary/10",
        iconCol: "text-primary",
        accent: "bg-gradient-to-r from-primary/50 via-primary/20 to-transparent",
    },
] as const;

// ─── Panel ────────────────────────────────────────────────────────────────────

interface InstructorToolsPanelProps {
    courseId: string;
    pendingForgeCount?: number;
}

export function InstructorToolsPanel({ courseId, pendingForgeCount }: InstructorToolsPanelProps) {
    const tools = TOOLS(courseId, pendingForgeCount);

    return (
        <div className="space-y-3">
            {/* Console header */}
            <div
                className="relative rounded-2xl border border-orange-500/20 overflow-hidden px-4 py-3 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, rgba(249,115,22,.08) 0%, rgba(0,0,0,.4) 100%)" }}
            >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 via-orange-500 to-transparent rounded-l-2xl" />

                <div className="flex items-center gap-2.5 pl-2">
                    <ShieldCheck
                        size={16}
                        className="text-orange-400 shrink-0"
                        style={{ filter: "drop-shadow(0 0 6px rgba(249,115,22,.7))" }}
                    />
                    <div>
                        <p className="font-display text-[12px] font-black text-white uppercase tracking-[.2em] leading-none">
                            Instructor Console
                        </p>
                        <p className="font-display text-[8px] font-bold text-white/25 uppercase tracking-[.25em] mt-0.5">
                            Elevated access active
                        </p>
                    </div>
                </div>

                {/* Live indicator */}
                <div className="flex items-center gap-1.5">
                    <div
                        className="w-1.5 h-1.5 rounded-full bg-orange-400"
                        style={{ boxShadow: "0 0 6px rgba(249,115,22,.8)", animation: "pulse 1.5s ease-in-out infinite" }}
                    />
                    <span className="font-display text-[8px] font-black text-orange-400/60 uppercase tracking-[.2em]">
                        Live
                    </span>
                </div>
            </div>

            {/* Tool cards */}
            <div className="space-y-2">
                {tools.map((tool, i) => (
                    <ToolCard key={tool.href} {...tool} index={i} />
                ))}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-center gap-1.5 py-1 opacity-30">
                <Zap size={9} className="text-white" />
                <span className="font-display text-[8px] font-bold text-white uppercase tracking-[.25em]">
                    Visible to instructors only
                </span>
            </div>
        </div>
    );
}