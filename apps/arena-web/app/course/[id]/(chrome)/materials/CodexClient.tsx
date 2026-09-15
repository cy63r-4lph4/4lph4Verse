"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, FileText, Download, ChevronRight, Target } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@verse/ui";
import { useResources, type ArenaResource } from "@verse/arena-web/hooks/useResources";
import { useResourceProgress } from "@verse/arena-web/hooks/useResources";
import { api } from "@verse/arena-web/lib/api";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import { useRouter } from "next/navigation";

export function CodexClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { data: resources = [], isLoading } = useResources(courseId);
  const { data: progressData = [], updateProgress } = useResourceProgress(courseId);
  const searchParams = useSearchParams();
  const datapadId = searchParams.get("datapad");
  
  const [selectedRes, setSelectedRes] = useState<ArenaResource | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const publishedResources = resources.filter(r => r.isPublished);

  useEffect(() => {
    if (datapadId && resources.length > 0) {
      const match = resources.find(r => r.id === datapadId);
      if (match && match.id !== selectedRes?.id) setSelectedRes(match);
    }
  }, [datapadId, resources, selectedRes]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!selectedRes) return;
    const target = e.currentTarget;
    
    let scrollPercentage = 0;
    if (target.scrollHeight <= target.clientHeight) {
      scrollPercentage = 100;
    } else {
      scrollPercentage = Math.round((target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100);
    }
    
    const currentProgress = progressData.find(p => p.resourceId === selectedRes.id)?.progress || 0;
    
    if (scrollPercentage > currentProgress && scrollPercentage - currentProgress >= 5 || scrollPercentage === 100 && currentProgress < 100) {
      updateProgress.mutate({ resourceId: selectedRes.id, progress: scrollPercentage });
    }
  };

  const handleDownloadPdf = async (resId: string, title: string) => {
    setIsDownloading(true);
    try {
      const res = await api.get(`/arena/courses/${courseId}/resources/${resId}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}_Codex.pdf`;
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

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden relative bg-black">
      <EnergyBackground className="opacity-20" color="rgba(34, 211, 238, 0.4)" />
      
      {/* Sidebar: List of Datapads */}
      <div className="w-1/3 max-w-sm border-r border-cyan-500/10 bg-black/40 overflow-y-auto styled-scrollbar relative z-10 backdrop-blur-sm">
        <div className="p-6">
          <h2 className="font-display text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
            <BookOpen size={20} className="text-cyan-400" />
            Codex
          </h2>
          <p className="font-display text-[10px] text-white/40 uppercase tracking-widest mt-1 mb-6">
            Course Datapads & Materials
          </p>
          
          {isLoading ? (
            <p className="text-white/40 text-sm">Loading...</p>
          ) : publishedResources.length === 0 ? (
            <p className="text-white/40 text-sm italic">No datapads available yet.</p>
          ) : (
            <div className="space-y-3">
              {publishedResources.map(res => {
                const progress = progressData.find(p => p.resourceId === res.id)?.progress || 0;
                
                return (
                  <button
                    key={res.id}
                    onClick={() => {
                      router.push(`?datapad=${res.id}`, { scroll: false });
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex flex-col group",
                      selectedRes?.id === res.id
                        ? "bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                        : "bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <h3 className={cn(
                        "font-display text-xs font-bold uppercase tracking-wide",
                        selectedRes?.id === res.id ? "text-cyan-400" : "text-white/80 group-hover:text-white"
                      )}>
                        {res.title}
                      </h3>
                      <ChevronRight size={14} className={cn(
                        "transition-transform",
                        selectedRes?.id === res.id ? "text-cyan-400 translate-x-1" : "text-white/20"
                      )} />
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-500", progress === 100 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-cyan-500")}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 overflow-y-auto styled-scrollbar relative z-10"
        onScroll={handleScroll}
      >
        {selectedRes ? (
          <div className="max-w-4xl mx-auto p-8 space-y-6 bg-black/40 min-h-full backdrop-blur-md border-x border-cyan-500/5">
            <div className="flex items-start justify-between border-b border-cyan-500/20 pb-6">
              <div>
                <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 uppercase tracking-wide">
                  {selectedRes.title}
                </h1>
                <p className="font-mono text-[10px] text-cyan-500/50 mt-2">
                  DATAPAD // {selectedRes.id.toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => router.push(`/course/${courseId}/assessment/${selectedRes.id}`)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all font-display text-xs font-black uppercase tracking-wide"
                >
                  <Target size={16} />
                  Initiate Intel Assessment
                </button>
                
                <button
                  onClick={() => handleDownloadPdf(selectedRes.id, selectedRes.title)}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-black/50 hover:bg-white/5 border border-white/10 transition-all font-display text-[10px] font-bold text-white/50 hover:text-white/80 uppercase tracking-widest disabled:opacity-50 w-full"
                >
                  <Download size={12} />
                  {isDownloading ? "Decrypting..." : "Download Secure Copy"}
                </button>
              </div>
            </div>
            
            <div className="prose prose-invert prose-cyan max-w-none prose-sm sm:prose-base font-sans pb-32">
              <ReactMarkdown>{selectedRes.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
              <FileText size={48} className="mb-4 relative z-10 text-cyan-400" />
            </div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-cyan-100">
              Select a datapad to read
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
