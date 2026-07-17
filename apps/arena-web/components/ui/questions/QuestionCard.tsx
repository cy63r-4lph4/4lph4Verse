"use client";

import { cn } from "@verse/ui";
import { CheckCircle2, Trash2, Pencil } from "lucide-react";

const DIFFICULTY_COLOR = {
  easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  hard: "text-red-400 bg-red-500/10 border-red-500/25",
};

interface QuestionCardProps {
  question: {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    difficulty: "easy" | "medium" | "hard";
    category?: string | null;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function QuestionCard({ question, onEdit, onDelete }: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "px-1.5 py-0.5 rounded border font-display text-[8px] font-bold uppercase tracking-[0.15em]",
                DIFFICULTY_COLOR[question.difficulty],
              )}
            >
              {question.difficulty}
            </span>
            {question.category && (
              <span className="font-display text-[9px] text-white/30 uppercase tracking-wider">
                {question.category}
              </span>
            )}
          </div>
          <p className="font-display text-sm font-bold text-white leading-snug">{question.prompt}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {question.options.map((opt, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium",
              i === question.correctIndex
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                : "text-white/40",
            )}
          >
            {i === question.correctIndex ? (
              <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
            ) : (
              <span className="w-3 shrink-0" />
            )}
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}