"use client";

// components/datapad/DatapadToc.tsx
//
// Navigation index for a datapad. Two things make this non-trivial:
//  1. The page scrolls inside a div, not the window — so native `#anchor`
//     jumps and `position: sticky` both need the container as their frame.
//  2. Heading ids come from rehype-slug at render time, so the TOC is built
//     from the same slugger to guarantee the ids line up.

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { List, X } from "lucide-react";
import { cn } from "@verse/ui";
import { extractToc } from "@verse/arena-web/lib/markdown/datapad-markdown-plugins";

interface Props {
  content: string;
  /** The scrolling element that wraps the rendered markdown. */
  containerRef: RefObject<HTMLElement | null>;
  className?: string;
}

/** Tracks which heading is currently at the top of the reading area. */
function useActiveHeading(
  ids: string[],
  containerRef: RefObject<HTMLElement | null>
) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);
  const visible = useRef<Set<string>>(new Set());

  useEffect(() => {
    const root = containerRef.current;
    if (!root || ids.length === 0) return;

    visible.current = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.current.add(id);
          else visible.current.delete(id);
        }
        // Pick the earliest heading currently in the band; if none is in it,
        // keep the last one we reported so the marker never blanks out.
        const first = ids.find((id) => visible.current.has(id));
        if (first) setActiveId(first);
      },
      {
        root,
        // Band across the upper third of the viewport.
        rootMargin: "-96px 0px -70% 0px",
        threshold: 0,
      }
    );

    const nodes = ids
      .map((id) => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
      .filter((el): el is HTMLElement => Boolean(el));

    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, containerRef]);

  return activeId;
}

export function scrollToHeading(
  container: HTMLElement | null,
  id: string,
  offset = 24
) {
  if (!container) return;
  const target = container.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
  if (!target) return;

  const delta =
    target.getBoundingClientRect().top - container.getBoundingClientRect().top;

  container.scrollTo({
    top: container.scrollTop + delta - offset,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });

  // Keep the URL shareable without letting the browser do its own jump.
  window.history.replaceState(null, "", `#${id}`);
}

export default function DatapadToc({ content, containerRef, className }: Props) {
  const entries = useMemo(() => extractToc(content), [content]);
  const ids = useMemo(() => entries.map((e) => e.id), [entries]);
  const activeId = useActiveHeading(ids, containerRef);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Honour a deep link once the content has rendered.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    const t = setTimeout(() => scrollToHeading(containerRef.current, hash), 120);
    return () => clearTimeout(t);
  }, [containerRef, content]);

  if (entries.length < 2) return null;

  const go = (id: string) => {
    scrollToHeading(containerRef.current, id);
    setMobileOpen(false);
  };

  const list = (
    <nav aria-label="Datapad contents" className="space-y-1">
      {entries.map((entry) => {
        const active = entry.id === activeId;
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => go(entry.id)}
            aria-current={active ? "location" : undefined}
            className={cn(
              "group relative block w-full text-left rounded-r border-l py-1.5 pr-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400",
              entry.depth === 2
                ? "pl-4 font-display text-[11px] font-bold uppercase tracking-widest"
                : "pl-8 font-sans text-[12px]",
              active
                ? "border-cyan-400 text-cyan-300 bg-cyan-500/5"
                : "border-white/10 text-white/40 hover:text-white/80 hover:border-cyan-500/40"
            )}
          >
            {entry.title}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside
        className={cn(
          "hidden xl:block w-64 flex-none sticky top-8 self-start max-h-[calc(100vh-10rem)] overflow-y-auto styled-scrollbar",
          className
        )}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-500/40 mb-3 pl-4">
          Index
        </p>
        {list}
      </aside>

      {/* Mobile sheet */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="xl:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-black/90 backdrop-blur px-4 py-3 font-display text-[10px] font-black uppercase tracking-widest text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.15)]"
      >
        <List size={16} />
        Index
      </button>

      {mobileOpen && (
        <div
          className="xl:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute bottom-0 inset-x-0 max-h-[70vh] overflow-y-auto styled-scrollbar rounded-t-2xl border-t border-cyan-500/20 bg-black p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-500/50">
                Index
              </p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close index"
                className="p-1 text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            {list}
          </div>
        </div>
      )}
    </>
  );
}