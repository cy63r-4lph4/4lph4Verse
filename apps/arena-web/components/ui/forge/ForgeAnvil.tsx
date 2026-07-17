"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@verse/ui";
import {
  Hammer, CheckCircle2, ToggleLeft, ListChecks, Plus, X, Sparkles, ChevronLeft,
} from "lucide-react";
import type { QuestionType } from "@verse/arena-web/lib/forge/questionTypes";
import { optionsForType } from "@verse/arena-web/lib/forge/questionTypes";

interface ForgeAnvilProps {
  onSubmit: (payload: {
    prompt: string; options: string[]; correctIndex: number;
    difficulty: "easy" | "medium" | "hard"; category?: string;
  }) => void;
  isSubmitting?: boolean;
}

const TYPE_CONFIG: Record<QuestionType, { icon: React.ElementType; label: string; desc: string }> = {
  mcq: { icon: ListChecks, label: "Multiple Choice", desc: "2–4 options, one correct" },
  "true-false": { icon: ToggleLeft, label: "True / False", desc: "A binary claim to verify" },
};

export function ForgeAnvil({ onSubmit, isSubmitting }: ForgeAnvilProps) {
  const [type, setType] = useState<QuestionType | null>(null);
  const [prompt, setPrompt] = useState("");
  const [mcqOptions, setMcqOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [category, setCategory] = useState("");
  const [struck, setStruck] = useState(false);

  const options = type ? optionsForType(type, mcqOptions) : [];
  const canSubmit =
    type &&
    prompt.trim().length > 0 &&
    options.filter((o) => o.trim().length > 0).length >= 2;

  function updateOption(i: number, val: string) {
    setMcqOptions((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  }

  function addOption() {
    if (mcqOptions.length >= 4) return;
    setMcqOptions((prev) => [...prev, ""]);
  }

  function removeOption(i: number) {
    if (mcqOptions.length <= 2) return;
    setMcqOptions((prev) => prev.filter((_, idx) => idx !== i));
    if (correctIndex >= i && correctIndex > 0) setCorrectIndex((c) => c - 1);
  }

  function reset() {
    setType(null);
    setPrompt("");
    setMcqOptions(["", ""]);
    setCorrectIndex(0);
    setDifficulty("medium");
    setCategory("");
  }

  function strike() {
    if (!canSubmit || !type) return;
    setStruck(true);
    setTimeout(() => {
      onSubmit({
        prompt: prompt.trim(),
        options: options.map((o) => o.trim()).filter(Boolean),
        correctIndex,
        difficulty,
        category: category.trim() || undefined,
      });
      setStruck(false);
      reset();
    }, 550);
  }

  return (
    <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#120b06] to-[#0a0705] p-5 overflow-hidden">
      {/* ember glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />

      <div className="relative flex items-center gap-2 mb-5">
        <Hammer size={14} className="text-orange-400" />
        <span className="font-display text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">
          The Forge
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!type ? (
          <motion.div
            key="type-select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-2 gap-3"
          >
            {(Object.keys(TYPE_CONFIG) as QuestionType[]).map((t) => {
              const cfg = TYPE_CONFIG[t];
              const Icon = cfg.icon;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-orange-500/40 hover:bg-orange-500/[0.05] transition-all active:scale-95"
                >
                  <Icon size={22} className="text-orange-400" />
                  <p className="font-display text-xs font-black text-white uppercase tracking-wide text-center">
                    {cfg.label}
                  </p>
                  <p className="font-display text-[9px] text-white/30 uppercase tracking-wider text-center leading-tight">
                    {cfg.desc}
                  </p>
                </button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <button
              onClick={reset}
              className="flex items-center gap-1 font-display text-[9px] font-bold text-white/30 uppercase tracking-wider hover:text-white/60"
            >
              <ChevronLeft size={12} />
              {TYPE_CONFIG[type].label}
            </button>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="State the question clearly…"
              className="w-full resize-none rounded-2xl border border-white/[0.08] bg-black/40 p-3 text-sm text-white/90 outline-none focus:border-orange-500/40"
            />

            {type === "true-false" ? (
              <div className="grid grid-cols-2 gap-2.5">
                {["True", "False"].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setCorrectIndex(i)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl border py-4 font-display text-sm font-black uppercase tracking-wide transition-all active:scale-95",
                      correctIndex === i
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 bg-white/[0.02] text-white/40",
                    )}
                  >
                    {correctIndex === i && <CheckCircle2 size={14} />}
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {mcqOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      onClick={() => setCorrectIndex(i)}
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-xs font-black transition active:scale-95",
                        correctIndex === i
                          ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
                          : "bg-white/[0.06] text-white/40",
                      )}
                    >
                      {correctIndex === i ? <CheckCircle2 size={16} /> : String.fromCharCode(65 + i)}
                    </button>
                    <input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="flex-1 rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-orange-500/40"
                    />
                    {mcqOptions.length > 2 && (
                      <button onClick={() => removeOption(i)} className="shrink-0 rounded-xl bg-white/[0.04] p-2 text-white/40">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {mcqOptions.length < 4 && (
                  <button
                    onClick={addOption}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.05] px-3 py-2 font-display text-[10px] font-bold text-white/50 uppercase tracking-wider"
                  >
                    <Plus size={12} />
                    Add option
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-white/80 outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Topic (optional)"
                className="rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-white/80 outline-none focus:border-orange-500/40"
              />
            </div>

            <motion.button
              onClick={strike}
              disabled={!canSubmit || isSubmitting}
              animate={struck ? { scale: [1, 0.92, 1.03, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-4 py-4 font-display text-xs font-black uppercase tracking-[0.2em] text-white disabled:opacity-30 active:scale-[0.98] transition-all"
              style={{ boxShadow: "0 4px 24px rgba(249,115,22,.35)" }}
            >
              {struck ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ duration: 0.4 }}>
                  <Sparkles size={16} />
                </motion.span>
              ) : (
                <Hammer size={16} />
              )}
              {isSubmitting ? "Forging…" : struck ? "Struck!" : "Forge Question"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}