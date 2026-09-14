"use client";

import { useState, useRef } from "react";
import {
  Plus, Search, Trash2, Pencil, Upload, Check, X, ChevronDown, AlertCircle,
} from "lucide-react";
import { cn } from "@verse/ui";
import {
  useQuestionBank, useCreateQuestion, useDeleteQuestion, useUpdateQuestion, useImportQuestionsCsv,
  type Question,
} from "@verse/arena-web/hooks/useQuestionBank";
import { useResources } from "@verse/arena-web/hooks/useResources";

const DIFF_CFG = {
  easy:   { label: "Easy",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  medium: { label: "Medium", color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
  hard:   { label: "Hard",   color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
};

function QuestionRow({
  q, onDelete, onEdit,
}: {
  q: Question;
  onDelete: () => void;
  onEdit: (q: Question) => void;
}) {
  const cfg = DIFF_CFG[q.difficulty] ?? DIFF_CFG.medium;
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors group">
      {/* Prompt */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-[11px] font-black text-white/80 leading-snug line-clamp-1">{q.prompt}</p>
        <p className="font-display text-[8px] font-bold text-white/25 uppercase tracking-wider mt-0.5">
          {q.options.length} options · {q.category || "Uncategorised"}
        </p>
      </div>

      {/* Difficulty */}
      <span className={cn("shrink-0 font-display text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border", cfg.color, cfg.bg)}>
        {cfg.label}
      </span>

      {/* Correct answer */}
      <span className="shrink-0 font-display text-[9px] font-bold text-white/30 truncate max-w-[120px]">
        ✓ {q.options[q.correctIndex]}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(q)}
          className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition-colors"
        >
          <Pencil size={11} className="text-white/40 hover:text-primary" />
        </button>
        {confirming ? (
          <>
            <button onClick={onDelete} className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center hover:bg-red-500/30 transition-colors">
              <Check size={11} className="text-red-400" />
            </button>
            <button onClick={() => setConfirming(false)} className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <X size={11} className="text-white/40" />
            </button>
          </>
        ) : (
          <button onClick={() => setConfirming(true)} className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-red-500/15 hover:border-red-500/25 transition-colors">
            <Trash2 size={11} className="text-white/30 hover:text-red-400 transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionForm({
  initial, onSave, onCancel, isSaving, courseId
}: {
  initial?: Partial<Question>;
  onSave: (data: { prompt: string; options: string[]; correctIndex: number; difficulty: string; category: string; explanation?: string; resourceId?: string }) => void;
  onCancel: () => void;
  isSaving: boolean;
  courseId: string;
}) {
  const [prompt, setPrompt] = useState(initial?.prompt ?? "");
  const [options, setOptions] = useState<string[]>(initial?.options ?? ["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(initial?.correctIndex ?? 0);
  const [difficulty, setDifficulty] = useState<string>(initial?.difficulty ?? "medium");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");
  const [resourceId, setResourceId] = useState(initial?.resourceId ?? "");

  const { data: resources = [] } = useResources(courseId);

  const canSave = prompt.trim() && options.filter(o => o.trim()).length >= 2;

  return (
    <div className="p-5 space-y-4 bg-white/[0.02] rounded-2xl border border-primary/20">
      <p className="font-display text-[10px] font-black text-white uppercase tracking-[.25em]">
        {initial?.id ? "Edit Question" : "New Question"}
      </p>

      {/* Prompt */}
      <div>
        <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Question Prompt</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[11px] font-display font-bold outline-none focus:border-primary/40 transition-colors resize-none"
          placeholder="Enter the question…"
        />
      </div>

      {/* Options */}
      <div>
        <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Answer Options</label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => setCorrectIndex(i)}
                className={cn(
                  "w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-all",
                  correctIndex === i
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-white/[0.04] border-white/[0.08] text-white/20 hover:border-white/20"
                )}
              >
                {correctIndex === i ? <Check size={11} /> : <span className="font-display text-[8px] font-black">{String.fromCharCode(65 + i)}</span>}
              </button>
              <input
                value={opt}
                onChange={e => { const o = [...options]; o[i] = e.target.value; setOptions(o); }}
                className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[11px] font-display font-bold outline-none focus:border-primary/40 transition-colors"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Difficulty</label>
          <div className="flex gap-1.5">
            {(["easy", "medium", "hard"] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "flex-1 py-2 rounded-xl border font-display text-[8px] font-black uppercase tracking-wider transition-all",
                  difficulty === d ? cn(DIFF_CFG[d].color, DIFF_CFG[d].bg) : "bg-white/[0.03] border-white/[0.06] text-white/30"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Category (optional)</label>
          <input
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[11px] font-display font-bold outline-none focus:border-primary/40 transition-colors"
            placeholder="e.g. Week 3, Arrays"
          />
        </div>
      </div>

      {/* Explanation + Datapad */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Explanation (optional)</label>
          <textarea
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[11px] font-display font-bold outline-none focus:border-primary/40 transition-colors resize-none"
            placeholder="Explain the answer..."
          />
        </div>
        <div>
          <label className="font-display text-[8px] font-black text-white/30 uppercase tracking-[.2em] block mb-1.5">Link Datapad (optional)</label>
          <select
            value={resourceId}
            onChange={e => setResourceId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[11px] font-display font-bold outline-none focus:border-primary/40 transition-colors"
          >
            <option value="">None</option>
            {resources.map(r => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onSave({ prompt, options: options.map(o => o.trim()).filter(Boolean), correctIndex, difficulty, category, explanation: explanation || undefined, resourceId: resourceId || undefined })}
          disabled={!canSave || isSaving}
          className="flex-1 py-2.5 rounded-xl font-display text-[10px] font-black uppercase tracking-wider text-white transition-all disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), color-mix(in srgb, hsl(var(--primary)) 70%, black))", boxShadow: "0 4px 20px hsl(var(--primary) / .25)" }}
        >
          {isSaving ? "Saving…" : (initial?.id ? "Save Changes" : "Add Question")}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl font-display text-[10px] font-black uppercase tracking-wider text-white/40 bg-white/[0.04] border border-white/[0.07] hover:text-white/70 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function QuestionBankPanel({ courseId }: { courseId: string }) {
  const { data: questions = [], isLoading } = useQuestionBank(courseId);
  const createQ = useCreateQuestion(courseId);
  const deleteQ = useDeleteQuestion(courseId);
  const updateQ = useUpdateQuestion(courseId);
  const importCsv = useImportQuestionsCsv(courseId);
  const fileRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Question | null>(null);
  const [importResult, setImportResult] = useState<{ insertedCount: number; errorCount: number } | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResourceId, setImportResourceId] = useState("");
  const { data: resources = [] } = useResources(courseId);

  const filtered = questions.filter((q: Question) => {
    if (diffFilter !== "all" && q.difficulty !== diffFilter) return false;
    if (search && !q.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSave = async (data: any) => {
    if (editTarget) {
      await updateQ.mutateAsync({ id: editTarget.id, ...data });
      setEditTarget(null);
    } else {
      await createQ.mutateAsync(data);
      setShowForm(false);
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await importCsv.mutateAsync({ file, resourceId: importResourceId || undefined });
    setImportResult(result);
    setShowImportModal(false);
    e.target.value = "";
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-[16px] font-black text-white uppercase tracking-wide">Question Bank</h2>
          <p className="font-display text-[9px] font-bold text-white/30 uppercase tracking-[.2em] mt-0.5">
            {questions.length} questions total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            disabled={importCsv.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] font-display text-[9px] font-black text-white/60 uppercase tracking-wider transition-all disabled:opacity-40"
          >
            <Upload size={12} />
            {importCsv.isPending ? "Importing…" : "CSV Import"}
          </button>
          <button
            onClick={() => { setShowForm(true); setEditTarget(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-display text-[9px] font-black uppercase tracking-wider text-white transition-all"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), color-mix(in srgb, hsl(var(--primary)) 70%, black))", boxShadow: "0 4px 14px hsl(var(--primary) / .3)" }}
          >
            <Plus size={12} />
            Add Question
          </button>
        </div>
      </div>

      {/* Import result banner */}
      {importResult && (
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl border",
          importResult.errorCount > 0 ? "bg-amber-500/[0.07] border-amber-500/20" : "bg-emerald-500/[0.07] border-emerald-500/20"
        )}>
          {importResult.errorCount > 0 ? <AlertCircle size={14} className="text-amber-400 shrink-0" /> : <Check size={14} className="text-emerald-400 shrink-0" />}
          <p className="font-display text-[10px] font-black text-white/80 uppercase tracking-wide">
            Imported {importResult.insertedCount} questions
            {importResult.errorCount > 0 && ` · ${importResult.errorCount} errors skipped`}
          </p>
          <button onClick={() => setImportResult(null)} className="ml-auto"><X size={12} className="text-white/30" /></button>
        </div>
      )}

      {/* Form (add/edit) */}
      {(showForm || editTarget) && (
        <QuestionForm
          initial={editTarget ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null); }}
          isSaving={createQ.isPending || updateQ.isPending}
          courseId={courseId}
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-gray-900 border border-white/10 space-y-4 shadow-2xl">
            <h3 className="font-display text-sm font-black text-white uppercase tracking-wide">Import CSV</h3>
            <p className="text-xs text-white/50">
              Optionally link all imported questions to a datapad.
            </p>
            <div>
              <label className="block font-display text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Link Datapad (optional)</label>
              <select
                value={importResourceId}
                onChange={e => setImportResourceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[11px] font-display font-bold outline-none focus:border-primary/40 transition-colors"
              >
                <option value="">None</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-lg font-display text-[10px] font-black text-white/50 hover:text-white uppercase tracking-wide"
              >
                Cancel
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-display text-[10px] font-black uppercase tracking-wide hover:bg-cyan-500/30"
              >
                Select File
              </button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCsvImport} />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-8 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 placeholder-white/18 font-display text-[10px] font-bold outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "easy", "medium", "hard"] as const).map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={cn(
                "px-3 py-2 rounded-xl border font-display text-[8px] font-black uppercase tracking-wider transition-all",
                diffFilter === d && d !== "all"
                  ? cn(DIFF_CFG[d as keyof typeof DIFF_CFG].color, DIFF_CFG[d as keyof typeof DIFF_CFG].bg)
                  : diffFilter === d
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-white/[0.03] border-white/[0.06] text-white/30 hover:text-white/60"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Question list */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_6rem_10rem_5rem] gap-3 px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
          {["Prompt", "Difficulty", "Correct Answer", "Actions"].map(h => (
            <span key={h} className="font-display text-[8px] font-black text-white/20 uppercase tracking-[.2em]">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-white/[0.04] max-h-[calc(100vh-24rem)] overflow-y-auto styled-scrollbar">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <p className="font-display text-[9px] text-white/18 uppercase tracking-widest">Loading questions…</p>
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="font-display text-[9px] text-white/18 uppercase tracking-widest">No questions found</p>
            </div>
          )}
          {filtered.map((q: Question) => (
            <QuestionRow
              key={q.id}
              q={q}
              onDelete={() => deleteQ.mutate(q.id)}
              onEdit={() => { setEditTarget(q); setShowForm(false); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
