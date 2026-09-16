"use client";

// app/course/[id]/materials/[datapadId]/page.tsx

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, Target } from "lucide-react";
import { useResources, useResourceProgress } from "@verse/arena-web/hooks/useResources";
import { api } from "@verse/arena-web/lib/api";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import DatapadMarkdown from "@verse/arena-web/components/ui/datapad/DatapadMarkdown";
import DatapadToc from "@verse/arena-web/components/ui/datapad/DatapadToc";
import { readFrontmatter } from "@verse/arena-web/lib/markdown/datapad-markdown-plugins";

/** Progress is only persisted when it advances past this many points. */
const PROGRESS_STEP = 5;

export default function DatapadReaderPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const datapadId = params.datapadId as string;

  const { data: resources = [], isLoading } = useResources(courseId);
  const { data: progressData = [], updateProgress } = useResourceProgress(courseId);

  const resource = resources.find((r) => r.id === datapadId);
  const storedProgress =
    progressData.find((p) => p.resourceId === datapadId)?.progress ?? 0;

  const [displayProgress, setDisplayProgress] = useState(storedProgress);
  const [isDownloading, setIsDownloading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Highest value we've committed to the server this session. Progress only
  // ever moves forward — scrolling back up shouldn't undo a completed read.
  const committed = useRef(storedProgress);
  const ticking = useRef(false);

  const { meta, body } = useMemo(
    () => readFrontmatter(resource?.content ?? ""),
    [resource?.content]
  );

  useEffect(() => {
    committed.current = Math.max(committed.current, storedProgress);
    setDisplayProgress((p) => Math.max(p, storedProgress));
  }, [storedProgress]);

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !resource) return;

    const scrollable = el.scrollHeight - el.clientHeight;
    const pct =
      scrollable <= 4
        ? 100 // Content fits the viewport: reading it is finishing it.
        : Math.min(100, Math.round((el.scrollTop / scrollable) * 100));

    setDisplayProgress((prev) => Math.max(prev, pct));

    const crossedStep = pct - committed.current >= PROGRESS_STEP;
    const justFinished = pct >= 100 && committed.current < 100;

    if (crossedStep || justFinished) {
      committed.current = pct;
      updateProgress.mutate({ resourceId: resource.id, progress: pct });
    }
  }, [resource, updateProgress]);

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      measure();
    });
  }, [measure]);

  // Re-measure when the content finishes laying out (images, fonts, tables)
  // so a short datapad doesn't sit at 0% forever.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !resource) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    measure();
    return () => ro.disconnect();
  }, [resource, measure]);

  const handleDownloadPdf = async () => {
    if (!resource) return;
    setIsDownloading(true);
    try {
      const res = await api.get(
        `/v1/arena/courses/${courseId}/resources/${resource.id}/download`,
        { responseType: "blob" }
      );
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
      alert("The download didn't complete. Try again in a moment.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-cyan-500/50">
        <p className="font-mono text-xs uppercase tracking-widest animate-pulse">
          Decrypting datapad…
        </p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-cyan-500/50 px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest">
          This datapad isn’t in the course directory.
        </p>
        <button
          onClick={() => router.push(`/course/${courseId}/materials`)}
          className="mt-4 px-4 py-2 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 transition-colors font-mono text-xs uppercase tracking-widest text-cyan-400"
        >
          Return to directory
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black relative">
      <EnergyBackground
        className="opacity-10 fixed inset-0 pointer-events-none"
        color="rgba(34, 211, 238, 0.4)"
      />

      <header className="flex-none bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 md:px-8 py-4 z-50">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => router.push(`/course/${courseId}/materials`)}
              aria-label="Back to materials"
              className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-center group flex-none"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-cyan-500/50 uppercase tracking-widest">
                Datapad // {resource.id.substring(0, 8)}
                {meta.classification ? ` // ${meta.classification}` : ""}
              </p>
              <h1 className="font-display text-lg md:text-xl font-black text-white uppercase tracking-wide truncate max-w-[220px] md:max-w-md">
                {meta.title ?? resource.title}
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
              <span className="hidden md:inline">
                {isDownloading ? "Preparing…" : "Download"}
              </span>
            </button>

            <button
              onClick={() =>
                router.push(`/course/${courseId}/assessment/${resource.id}`)
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all font-display text-[10px] md:text-xs font-black uppercase tracking-wide"
            >
              <Target size={14} />
              <span>Intel assessment</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className="h-1 w-full bg-black/80 relative z-50"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={displayProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-cyan-500 transition-[width] duration-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          style={{ width: `${displayProgress}%` }}
        />
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto styled-scrollbar relative z-10 p-4 md:p-8"
      >
        <div className="max-w-6xl mx-auto flex gap-12 pb-32">
          <article className="min-w-0 flex-1 max-w-3xl mx-auto xl:mx-0">
            <DatapadMarkdown content={body} />
          </article>

          <DatapadToc content={body} containerRef={scrollRef} />
        </div>
      </div>
    </div>
  );
}