"use client";

import Link from "next/link";
import { ShieldCheck, Library, Hammer, Trophy, ChevronRight } from "lucide-react";
import { cn } from "@verse/ui";

interface ToolLinkProps {
    href: string;
    icon: React.ElementType;
    label: string;
    desc: string;
    badge?: number;
    accent: string; // tailwind text/border color token
}

function ToolLink({ href, icon: Icon, label, desc, badge, accent }: ToolLinkProps) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-all active:scale-[0.98] hover:bg-white/[0.05] hover:border-white/[0.1]"
        >
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-black/30", accent)}>
                <Icon size={17} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-display text-[12px] font-black text-white uppercase tracking-wide truncate">
                        {label}
                    </p>
                    {typeof badge === "number" && badge > 0 && (
                        <span className="shrink-0 rounded-full bg-amber-400 px-1.5 py-px font-display text-[9px] font-black text-black">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-wider mt-0.5 truncate">
                    {desc}
                </p>
            </div>
            <ChevronRight
                size={15}
                className="shrink-0 text-white/20 transition-all group-hover:text-white/50 group-hover:translate-x-0.5"
            />
        </Link>
    );
}

interface InstructorToolsPanelProps {
    courseId: string;
    pendingForgeCount?: number;
}

export function InstructorToolsPanel({ courseId, pendingForgeCount }: InstructorToolsPanelProps) {
    return (
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/[0.06] to-transparent p-4 space-y-3">
            <div className="flex items-center gap-2 px-1">
                <ShieldCheck size={13} className="text-primary" />
                <span className="font-display text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                    Instructor Console
                </span>
            </div>

            <div className="space-y-2">
                <ToolLink
                    href={`/course/${courseId}/duels/tournament/create`}
                    icon={Trophy}
                    label="Launch Tournament"
                    desc="Build a bracket and take the Remote"
                    accent="border-amber-500/25 text-amber-400"
                />
                <ToolLink
                    href={`/course/${courseId}/forge/review`}
                    icon={Hammer}
                    label="Tempering Queue"
                    desc="Review student-submitted questions"
                    badge={pendingForgeCount}
                    accent="border-orange-500/25 text-orange-400"
                />
                <ToolLink
                    href={`/course/${courseId}/questions`}
                    icon={Library}
                    label="Question Bank"
                    desc="Author or bulk-import questions"
                    accent="border-primary/25 text-primary"
                />
            </div>
        </div>
    );
}