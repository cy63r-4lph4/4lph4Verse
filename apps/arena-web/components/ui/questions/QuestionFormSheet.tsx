"use client";

import { useEffect, useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@verse/arena-web/components/ui/sheet";
import { CheckCircle2, Plus, X, Save } from "lucide-react";
import { cn } from "@verse/ui";

export interface QuestionFormValue {
  id?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

const EMPTY: QuestionFormValue = {
  prompt: "",
  options: ["", ""],
  correctIndex: 0,
  difficulty: "medium",
  category: "",
};

interface QuestionFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: QuestionFormValue | null;
  onSubmit: (value: QuestionFormValue) => void;
  isSubmitting?: boolean;
}

export function QuestionFormSheet({
  open,
  onOpenChange,
  initial,
  onSubmit,
  isSubmitting,
}: QuestionFormSheetProps) {
  const [value, setValue] = useState<QuestionFormValue>(EMPTY);

  useEffect(() => {
    if (open) setValue(initial ?? EMPTY);
  }, [open, initial]);

  const canSubmit =
    value.prompt.trim().length > 0 &&
    value.options.filter((o) => o.trim().length > 0).length >= 2;

  function updateOption(i: number, text: string) {
    setValue((v) => {
      const options = [...v.options];
      options[i] = text;
      return { ...v, options };
    });
  }

  function addOption() {
    if (value.options.length >= 4) return;
    setValue((v) => ({ ...v, options: [...v.options, ""] }));
  }

  function removeOption(i: number) {
    if (value.options.length <= 2) return;
    setValue((v) => {
      const options = v.options.filter((_, idx) => idx !== i);
      const correctIndex = v.correctIndex >= i && v.correctIndex > 0 ? v.correctIndex - 1 : v.correctIndex;
      return { ...v, options, correctIndex };
    });
  }

  function submit() {
    const options = value.options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (!value.prompt.trim() || options.length < 2) return;
    onSubmit({
      ...value,
      prompt: value.prompt.trim(),
      options,
      correctIndex: Math.min(value.correctIndex, options.length - 1),
      category: value.category.trim(),
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-[#080808]/98 backdrop-blur-2xl border-t border-white/8 rounded-t-[2rem] p-0">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>

        <div className="max-w-md mx-auto px-5 pb-8 pt-2 space-y-4">
          <SheetHeader className="pb-0">
            <SheetTitle className="font-display text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 text-center">
              {initial ? "Edit Question" : "New Question"}
            </SheetTitle>
          </SheetHeader>

          <textarea
            value={value.prompt}
            onChange={(e) => setValue((v) => ({ ...v, prompt: e.target.value }))}
            rows={3}
            placeholder="What's the question?"
            className="w-full resize-none rounded-2xl border border-white/[0.08] bg-black/40 p-3 text-sm text-white/90 outline-none focus:border-primary/40"
          />

          <div className="space-y-2">
            {value.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => setValue((v) => ({ ...v, correctIndex: i }))}
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-xs font-black transition active:scale-95",
                    value.correctIndex === i
                      ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
                      : "bg-white/[0.06] text-white/40",
                  )}
                >
                  {value.correctIndex === i ? <CheckCircle2 size={16} /> : String.fromCharCode(65 + i)}
                </button>
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="flex-1 rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-white/90 outline-none focus:border-primary/40"
                />
                {value.options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="shrink-0 rounded-xl bg-white/[0.04] p-2 text-white/40"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {value.options.length < 4 && (
            <button
              onClick={addOption}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.05] px-3 py-2 font-display text-[10px] font-bold text-white/50 uppercase tracking-wider"
            >
              <Plus size={12} />
              Add option
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <select
              value={value.difficulty}
              onChange={(e) => setValue((v) => ({ ...v, difficulty: e.target.value as any }))}
              className="rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-white/80 outline-none"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              value={value.category}
              onChange={(e) => setValue((v) => ({ ...v, category: e.target.value }))}
              placeholder="Category (optional)"
              className="rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm text-white/80 outline-none focus:border-primary/40"
            />
          </div>

          <button
            onClick={submit}
            disabled={!canSubmit || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 font-display text-xs font-black uppercase tracking-[0.2em] text-black disabled:opacity-30 active:scale-[0.98] transition-all"
          >
            <Save size={14} />
            {isSubmitting ? "Saving…" : initial ? "Save Changes" : "Add Question"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}