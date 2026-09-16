"use client";

import { useParams, useRouter } from "next/navigation";
import { BookOpen, Database, FileText, Lock, CheckCircle2, CircleDashed, Fingerprint, ChevronRight } from "lucide-react";
import { cn } from "@verse/ui";
import { useResources, useResourceProgress } from "@verse/arena-web/hooks/useResources";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { readFrontmatter } from "@verse/arena-web/lib/markdown/datapad-markdown-plugins";

export default function MaterialsDirectoryPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    
    const { data: resources = [], isLoading } = useResources(courseId);
    const { data: progressData = [] } = useResourceProgress(courseId);
    
    const publishedResources = resources.filter(r => r.isPublished);

    return (
        <div className="min-h-screen w-full relative bg-black pb-32">
            <EnergyBackground className="opacity-10 fixed inset-0 pointer-events-none" color="rgba(34, 211, 238, 0.4)" />
            
            <main className="max-w-4xl mx-auto px-4 md:px-8 pt-12 md:pt-20 relative z-10">
                <header className="mb-16 border-b border-cyan-500/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30">
                                <Database className="text-cyan-400" size={20} />
                            </div>
                            <h1 className="font-display text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 uppercase tracking-wide">
                                Master Index
                            </h1>
                        </div>
                        <p className="font-mono text-xs md:text-sm text-cyan-500/60 uppercase tracking-widest max-w-xl leading-relaxed">
                            Classified intelligence archives and curriculum materials. Select a datapad to initiate synchronization sequence.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-cyan-500/40 bg-cyan-950/20 px-4 py-2 rounded-lg border border-cyan-500/10">
                        <div className="flex flex-col gap-1">
                            <span>Total Files</span>
                            <span className="text-cyan-300 font-bold">{publishedResources.length}</span>
                        </div>
                        <div className="w-px h-6 bg-cyan-500/20" />
                        <div className="flex flex-col gap-1">
                            <span>Clearance</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Lock size={10} /> GRANTED
                            </span>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-cyan-500/50">
                        <Database className="animate-pulse mb-6 opacity-50" size={48} />
                        <p className="font-mono text-xs uppercase tracking-widest">Decrypting archive index...</p>
                    </div>
                ) : publishedResources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-cyan-500/20 rounded-2xl bg-cyan-950/10 backdrop-blur-sm">
                        <FileText className="text-cyan-500/30 mb-4" size={48} />
                        <p className="font-mono text-xs text-cyan-500/50 uppercase tracking-widest">Archive is currently empty</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-2 font-mono text-[10px] uppercase tracking-widest text-cyan-500/50 border-b border-white/5">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-6">Designation</div>
                            <div className="col-span-3">Classification</div>
                            <div className="col-span-2 text-right">Sync Status</div>
                        </div>

                        {publishedResources.map((res, index) => {
                            const progress = progressData.find(p => p.resourceId === res.id)?.progress || 0;
                            const isComplete = progress === 100;
                            const isStarted = progress > 0 && !isComplete;
                            
                            const { meta } = readFrontmatter(res.content || "");
                            const title = meta.title || res.title;
                            const classification = meta.classification || "UNCLASSIFIED";
                            const author = meta.author || "ARCHIVE";

                            return (
                                <button
                                    key={res.id}
                                    onClick={() => router.push(`/course/${courseId}/materials/${res.id}`)}
                                    className="group relative w-full text-left bg-black/40 hover:bg-cyan-950/20 border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all duration-300 overflow-hidden flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 p-4 md:px-6 md:py-4 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                >
                                    {/* Active glow indicator on hover */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

                                    {/* ID Column */}
                                    <div className="col-span-1 hidden md:flex font-mono text-[10px] text-cyan-500/30 group-hover:text-cyan-400/50 transition-colors">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    {/* Title Column */}
                                    <div className="col-span-6 flex items-center gap-4">
                                        <div className={cn(
                                            "flex-none flex items-center justify-center w-10 h-10 rounded-lg border transition-colors",
                                            isComplete ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400" :
                                            isStarted ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400" :
                                            "bg-white/5 border-white/10 text-white/40 group-hover:bg-cyan-950/20 group-hover:border-cyan-500/20 group-hover:text-cyan-400"
                                        )}>
                                            <FileText size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-display text-sm md:text-base font-bold text-white/90 group-hover:text-white uppercase tracking-wide truncate transition-colors">
                                                {title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 font-mono text-[9px] uppercase tracking-widest text-cyan-500/40">
                                                <span className="flex items-center gap-1">
                                                    <Fingerprint size={10} /> {author}
                                                </span>
                                                <span className="md:hidden text-cyan-500/20">•</span>
                                                <span className="md:hidden">{classification}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Classification Column */}
                                    <div className="col-span-3 hidden md:flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 text-cyan-400/70 group-hover:text-cyan-300 transition-colors">
                                            {classification}
                                        </span>
                                    </div>

                                    {/* Status Column */}
                                    <div className="col-span-2 flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0">
                                        <div className="flex items-center gap-2">
                                            {isComplete ? (
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            ) : isStarted ? (
                                                <CircleDashed size={14} className="text-cyan-500 animate-[spin_4s_linear_infinite]" />
                                            ) : (
                                                <CircleDashed size={14} className="text-white/20" />
                                            )}
                                            <span className={cn(
                                                "font-mono text-[10px] font-bold uppercase tracking-widest",
                                                isComplete ? "text-emerald-500" :
                                                isStarted ? "text-cyan-400" :
                                                "text-white/40"
                                            )}>
                                                {progress}%
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="text-cyan-500/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all md:ml-4" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}