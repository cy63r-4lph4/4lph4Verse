"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Download, Target, TerminalSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@verse/ui";
import { useResources, useResourceProgress } from "@verse/arena-web/hooks/useResources";
import { api } from "@verse/arena-web/lib/api";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";

export default function DatapadReaderPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const datapadId = params.datapadId as string;
    
    const { data: resources = [], isLoading } = useResources(courseId);
    const { data: progressData = [], updateProgress } = useResourceProgress(courseId);
    
    const resource = resources.find(r => r.id === datapadId);
    const progress = progressData.find(p => p.resourceId === datapadId)?.progress || 0;
    
    const [isDownloading, setIsDownloading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!resource) return;
        const target = e.currentTarget;
        
        let scrollPercentage = 0;
        if (target.scrollHeight <= target.clientHeight) {
            scrollPercentage = 100;
        } else {
            scrollPercentage = Math.round((target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100);
        }
        
        if (scrollPercentage > progress && scrollPercentage - progress >= 5 || scrollPercentage === 100 && progress < 100) {
            updateProgress.mutate({ resourceId: resource.id, progress: scrollPercentage });
        }
    };

    const handleDownloadPdf = async () => {
        if (!resource) return;
        setIsDownloading(true);
        try {
            const res = await api.get(`/v1/arena/courses/${courseId}/resources/${resource.id}/download`, { responseType: 'blob' });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${resource.title.replace(/\s+/g, "_")}_Codex.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Failed to download PDF.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-cyan-500/50">
                <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Decrypting Datapad...</p>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-cyan-500/50">
                <p className="font-mono text-xs uppercase tracking-widest">Datapad not found</p>
                <button 
                    onClick={() => router.push(`/course/${courseId}/materials`)}
                    className="mt-4 px-4 py-2 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 transition-colors font-mono text-xs uppercase tracking-widest text-cyan-400"
                >
                    Return to Directory
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-black relative">
            <EnergyBackground className="opacity-10 fixed inset-0 pointer-events-none" color="rgba(34, 211, 238, 0.4)" />
            
            {/* Header / Nav */}
            <header className="flex-none bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 md:px-8 py-4 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push(`/course/${courseId}/materials`)}
                            className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-center group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <p className="font-mono text-[10px] text-cyan-500/50 uppercase tracking-widest">Datapad // {resource.id.substring(0, 8)}</p>
                            <h1 className="font-display text-lg md:text-xl font-black text-white uppercase tracking-wide truncate max-w-[200px] md:max-w-md">
                                {resource.title}
                            </h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isDownloading}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black/50 hover:bg-white/5 border border-white/10 transition-all font-display text-[10px] md:text-xs font-bold text-white/50 hover:text-white/80 uppercase tracking-widest disabled:opacity-50"
                        >
                            <Download size={14} />
                            <span className="hidden md:inline">{isDownloading ? "Decrypting..." : "Download"}</span>
                        </button>
                        
                        <button
                            onClick={() => router.push(`/course/${courseId}/assessment/${resource.id}`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all font-display text-[10px] md:text-xs font-black uppercase tracking-wide"
                        >
                            <Target size={14} />
                            <span>Intel Assessment</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Progress Bar (Global) */}
            <div className="h-1 w-full bg-black/80 relative z-50">
                <div 
                    className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                    style={{ width: `${progress}%` }} 
                />
            </div>

            {/* Markdown Content */}
            <div 
                ref={contentRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto styled-scrollbar relative z-10 p-4 md:p-8"
            >
                <div className="max-w-3xl mx-auto pb-32">
                    <ReactMarkdown
                        components={{
                            h1: ({node, ...props}) => <h1 className="font-display text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-500 uppercase tracking-wide mt-12 mb-8" {...props} />,
                            h2: ({node, ...props}) => <h2 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mt-12 mb-6 border-b border-cyan-500/20 pb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="font-display text-lg md:text-xl font-bold text-cyan-300 mt-8 mb-4 uppercase tracking-wide" {...props} />,
                            p: ({node, ...props}) => <p className="font-sans text-white/80 text-base md:text-lg leading-relaxed mb-6" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-6 pl-4 text-white/80 font-sans" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-6 pl-4 text-white/80 font-sans" {...props} />,
                            li: ({node, ...props}) => <li className="pl-2 marker:text-cyan-500" {...props} />,
                            blockquote: ({node, ...props}) => (
                                <blockquote className="border-l-4 border-cyan-500 bg-cyan-950/20 p-4 md:p-6 my-8 rounded-r-xl italic text-cyan-100 font-sans shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]" {...props} />
                            ),
                            a: ({node, ...props}) => <a className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 underline-offset-4 transition-colors" {...props} />,
                            code: ({node, className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || "");
                                const isInline = !match && !className;
                                
                                if (isInline) {
                                    return <code className="bg-cyan-950/50 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-sm border border-cyan-500/20" {...props}>{children}</code>;
                                }
                                
                                return (
                                    <div className="relative my-8 rounded-xl overflow-hidden border border-cyan-500/20 bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
                                        <div className="flex items-center justify-between px-4 py-2 bg-cyan-950/40 border-b border-cyan-500/20">
                                            <div className="flex items-center gap-2 text-cyan-500/50">
                                                <TerminalSquare size={14} />
                                                <span className="font-mono text-[10px] uppercase tracking-widest">{match?.[1] || 'code'}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 overflow-x-auto styled-scrollbar">
                                            <code className={cn("font-mono text-sm text-cyan-50 leading-relaxed block min-w-max", className)} {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    </div>
                                );
                            },
                            table: ({node, ...props}) => (
                                <div className="w-full overflow-x-auto my-8 border border-cyan-500/20 rounded-xl bg-black/40">
                                    <table className="w-full text-left font-sans text-sm md:text-base border-collapse" {...props} />
                                </div>
                            ),
                            th: ({node, ...props}) => <th className="p-4 border-b border-cyan-500/30 bg-cyan-950/40 font-display font-bold uppercase tracking-wide text-cyan-300 whitespace-nowrap" {...props} />,
                            td: ({node, ...props}) => <td className="p-4 border-b border-white/5 text-white/80 group-hover:bg-white/[0.02] transition-colors" {...props} />,
                            tr: ({node, ...props}) => <tr className="group" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-cyan-100" {...props} />,
                            em: ({node, ...props}) => <em className="italic text-cyan-200" {...props} />,
                            hr: ({node, ...props}) => <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" {...props} />
                        }}
                    >
                        {resource.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
