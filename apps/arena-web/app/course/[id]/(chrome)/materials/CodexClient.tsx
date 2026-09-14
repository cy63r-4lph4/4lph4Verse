"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, FileText, Download, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@verse/ui";
import { useResources, type ArenaResource } from "@verse/arena-web/hooks/useResources";
import { api } from "@verse/arena-web/lib/api";

export function CodexClient({ courseId }: { courseId: string }) {
  const { data: resources = [], isLoading } = useResources(courseId);
  const searchParams = useSearchParams();
  const datapadId = searchParams.get("datapad");
  
  const [selectedRes, setSelectedRes] = useState<ArenaResource | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const publishedResources = resources.filter(r => r.isPublished);

  useEffect(() => {
    if (datapadId && resources.length > 0 && !selectedRes) {
      const match = resources.find(r => r.id === datapadId);
      if (match) setSelectedRes(match);
    }
  }, [datapadId, resources, selectedRes]);

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
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden">
      {/* Sidebar: List of Datapads */}
      <div className="w-1/3 max-w-sm border-r border-white/10 bg-black/50 overflow-y-auto styled-scrollbar">
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
            <div className="space-y-2">
              {publishedResources.map(res => (
                <button
                  key={res.id}
                  onClick={() => setSelectedRes(res)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                    selectedRes?.id === res.id
                      ? "bg-cyan-500/10 border-cyan-500/30"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                  )}
                >
                  <div>
                    <h3 className={cn(
                      "font-display text-xs font-bold uppercase tracking-wide",
                      selectedRes?.id === res.id ? "text-cyan-400" : "text-white/80 group-hover:text-white"
                    )}>
                      {res.title}
                    </h3>
                  </div>
                  <ChevronRight size={14} className={cn(
                    "transition-transform",
                    selectedRes?.id === res.id ? "text-cyan-400 translate-x-1" : "text-white/20"
                  )} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-black/20 overflow-y-auto styled-scrollbar">
        {selectedRes ? (
          <div className="max-w-4xl mx-auto p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
                  {selectedRes.title}
                </h1>
                <p className="font-mono text-[10px] text-white/30 mt-2">
                  Datapad ID: {selectedRes.id}
                </p>
              </div>
              <button
                onClick={() => handleDownloadPdf(selectedRes.id, selectedRes.title)}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 transition-all font-display text-[10px] font-black text-cyan-400 uppercase tracking-wide disabled:opacity-50"
              >
                <Download size={14} />
                {isDownloading ? "Generating..." : "Request Secure Download"}
              </button>
            </div>
            <div className="prose prose-invert prose-cyan max-w-none prose-sm sm:prose-base">
              <ReactMarkdown>{selectedRes.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <FileText size={48} className="mb-4" />
            <p className="font-display text-sm font-bold uppercase tracking-widest">
              Select a datapad to read
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
