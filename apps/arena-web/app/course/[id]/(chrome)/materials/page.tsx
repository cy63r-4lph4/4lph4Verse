"use client";

import { useParams, useRouter } from "next/navigation";
import { BookOpen, ChevronRight, FileText } from "lucide-react";
import { cn } from "@verse/ui";
import { useResources, useResourceProgress } from "@verse/arena-web/hooks/useResources";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";

export default function MaterialsDirectoryPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    
    const { data: resources = [], isLoading } = useResources(courseId);
    const { data: progressData = [] } = useResourceProgress(courseId);
    
    const publishedResources = resources.filter(r => r.isPublished);

    return (
        <div className="min-h-screen w-full relative bg-black pb-32">
            <EnergyBackground className="opacity-20" color="rgba(34, 211, 238, 0.3)" />
            
            <main className="max-w-5xl mx-auto px-4 md:px-8 pt-8 md:pt-16 relative z-10">
                <div className="mb-12">
                    <h1 className="font-display text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 uppercase tracking-wide flex items-center gap-4">
                        <BookOpen className="text-cyan-400" size={36} />
                        Datapad Directory
                    </h1>
                    <p className="font-mono text-xs md:text-sm text-cyan-500/70 mt-3 uppercase tracking-widest">
                        Course Materials & Official Intelligence
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-cyan-500/50">
                        <BookOpen className="animate-pulse mb-4" size={48} />
                        <p className="font-mono text-xs uppercase tracking-widest">Accessing secure archives...</p>
                    </div>
                ) : publishedResources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-cyan-500/20 rounded-3xl bg-cyan-950/10">
                        <FileText className="text-cyan-500/30 mb-4" size={48} />
                        <p className="font-mono text-xs text-cyan-500/50 uppercase tracking-widest">No datapads available in this sector</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publishedResources.map(res => {
                            const progress = progressData.find(p => p.resourceId === res.id)?.progress || 0;
                            const isComplete = progress === 100;
                            
                            return (
                                <button
                                    key={res.id}
                                    onClick={() => router.push(`/course/${courseId}/materials/${res.id}`)}
                                    className="group relative flex flex-col items-start p-6 rounded-2xl bg-black/40 border border-cyan-500/10 hover:border-cyan-400/50 hover:bg-cyan-950/30 transition-all text-left overflow-hidden hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(34,211,238,0.3)]"
                                >
                                    {/* Background glow on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 group-hover:to-cyan-500/10 transition-colors" />
                                    
                                    <div className="flex items-start justify-between w-full mb-8 relative z-10">
                                        <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all">
                                            <FileText className={cn("transition-colors", isComplete ? "text-green-400" : "text-cyan-400")} size={24} />
                                        </div>
                                        <ChevronRight className="text-cyan-500/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    
                                    <h3 className="font-display text-lg font-bold text-white/90 group-hover:text-white uppercase tracking-wide mb-2 relative z-10 line-clamp-2">
                                        {res.title}
                                    </h3>
                                    
                                    <div className="mt-auto w-full pt-6 relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 group-hover:text-cyan-200/70 transition-colors">
                                                Intelligence Sync
                                            </span>
                                            <span className={cn("font-mono text-[9px] font-bold uppercase tracking-widest", isComplete ? "text-green-400" : "text-cyan-400")}>
                                                {progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5 group-hover:border-cyan-500/20 transition-colors">
                                            <div 
                                                className={cn("h-full rounded-full transition-all duration-700 ease-out", isComplete ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-cyan-500 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]")}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
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