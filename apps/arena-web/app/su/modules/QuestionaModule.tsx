"use client";
import React, { useState } from "react";
import { HelpCircle, Search, School, BookOpen, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@verse/ui";
import { useHubs } from "@verse/arena-web/hooks/useHubs";
import { useSectors } from "@verse/arena-web/hooks/useSectors";
import { useQuestionBank } from "@verse/arena-web/hooks/useQuestionBank";

export default function QuestionsModule() {
  const { hubs } = useHubs();
  const [schoolId, setSchoolId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { sectors } = useSectors(schoolId);
  const { data: questions = [], isLoading } = useQuestionBank(courseId, !!courseId);

  const filtered = questions.filter((q: any) =>
    q.prompt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 md:p-10 w-full min-h-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-arena-warning shadow-[0_0_10px_rgba(var(--warning-rgb),0.5)]" />
            <span className="text-[10px] font-mono text-arena-warning tracking-[0.4em] uppercase">Intel_Repository_Live</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter">
            Knowledge_Assets
          </h1>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-arena-warning transition-colors" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query Intel Patterns..."
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[11px] font-mono text-white focus:border-arena-warning/50 outline-none w-64 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative group">
          <School className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
          <select
            value={schoolId}
            onChange={(e) => { setSchoolId(e.target.value); setCourseId(""); }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-[10px] font-mono text-white/80 outline-none appearance-none cursor-pointer"
          >
            <option value="" className="bg-black">SOURCE_HUB</option>
            {hubs.map((h: any) => <option key={h.id} value={h.id} className="bg-black">{h.name.toUpperCase()}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none" size={12} />
        </div>

        <div className="relative group">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            disabled={!schoolId}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-[10px] font-mono text-white/80 outline-none appearance-none cursor-pointer disabled:opacity-30"
          >
            <option value="" className="bg-black">COMBAT_SECTOR</option>
            {sectors.map((s: any) => <option key={s.id} value={s.id} className="bg-black">{s.title.toUpperCase()}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none" size={12} />
        </div>
      </div>

      {!courseId && (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <HelpCircle size={40} className="mx-auto mb-4 text-white/10" />
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Select a sector to view its intel bank</p>
        </div>
      )}

      {courseId && isLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {courseId && !isLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((q: any) => <IntelCard key={q.id} question={q} />)}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-xs font-mono text-muted-foreground uppercase py-10">
              No questions match this sector yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function IntelCard({ question }: { question: any }) {
  const difficultyColor = {
    easy: "text-arena-success border-arena-success/30",
    medium: "text-arena-warning border-arena-warning/30",
    hard: "text-destructive border-destructive/30",
  }[question.difficulty as "easy" | "medium" | "hard"];

  return (
    <div className="group bg-arena-card/20 border border-white/5 rounded-2xl p-6 hover:border-arena-warning/40 transition-all flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex gap-2">
          <span className={cn("text-[8px] font-mono border px-2 py-0.5 rounded uppercase", difficultyColor)}>
            Tier_{question.difficulty}
          </span>
          {question.category && (
            <span className="text-[8px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded uppercase">
              {question.category}
            </span>
          )}
        </div>

        <h3 className="text-white font-display font-medium text-lg leading-snug">{question.prompt}</h3>

        <div className="space-y-1.5">
          {question.options.map((opt: string, i: number) => (
            <div key={i} className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs",
              i === question.correctIndex ? "bg-arena-success/10 text-arena-success" : "text-white/40",
            )}>
              {i === question.correctIndex && <CheckCircle2 size={12} />}
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}