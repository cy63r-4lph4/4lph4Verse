"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, FileUp, Library } from "lucide-react";
import { cn } from "@verse/ui";
import EnergyBackground from "@verse/arena-web/components/ui/EnergyBackground";
import useAuth from "@verse/arena-web/hooks/useAuth";
import {
  useQuestionBank,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useImportQuestionsCsv,
  type Question,
} from "@verse/arena-web/hooks/useQuestionBank";
import { QuestionCard } from "@verse/arena-web/components/ui/questions/QuestionCard";
import { QuestionFormSheet, type QuestionFormValue } from "@verse/arena-web/components/ui/questions/QuestionFormSheet";
import { CsvImportDropzone } from "@verse/arena-web/components/ui/questions/CsvImportDropzone";

type Tab = "manual" | "csv";

export default function QuestionBankPage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const { user, isLoading: authLoading } = useAuth();

  // Explicit allow-list: only render/fetch once we've confirmed the role.
  // Absence of `user` (logged out, still loading, fetch failed) must never
  // fall through to access — the old `user && role !== x` check did exactly
  // that when `user` was undefined.
  const canManage = !!user && (user.role === "instructor" || user.role === "admin");

  const [tab, setTab] = useState<Tab>("manual");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionFormValue | null>(null);

  const { data: questions = [], isLoading } = useQuestionBank(courseId, canManage);
  const createQuestion = useCreateQuestion(courseId);
  const updateQuestion = useUpdateQuestion(courseId);
  const deleteQuestion = useDeleteQuestion(courseId);
  const importCsv = useImportQuestionsCsv(courseId);

  if (authLoading) {
    return (
      <EnergyBackground className="grid place-items-center px-6" variant="duel">
        <p className="font-display text-white/30 uppercase tracking-[.3em] text-xs">Verifying access…</p>
      </EnergyBackground>
    );
  }

  if (!canManage) {
    return (
      <EnergyBackground className="grid place-items-center px-6" variant="duel">
        <p className="font-display text-white/40 uppercase tracking-[.3em] text-sm text-center">
          Instructor access required
        </p>
      </EnergyBackground>
    );
  }

  function openCreate() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(q: (typeof questions)[number]) {
    setEditing({
      id: q.id,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      difficulty: q.difficulty,
      category: q.category ?? "",
    });
    setSheetOpen(true);
  }

  function handleSubmit(value: QuestionFormValue) {
    if (value.id) {
      updateQuestion.mutate(
        { id: value.id, ...value },
        { onSuccess: () => setSheetOpen(false) },
      );
    } else {
      createQuestion.mutate(value, { onSuccess: () => setSheetOpen(false) });
    }
  }

  return (
    <EnergyBackground className="px-4 py-6" variant="duel">
      <div className="max-w-md mx-auto space-y-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library size={14} className="text-primary" />
            <p className="font-display text-[10px] font-black text-primary uppercase tracking-[0.25em]">
              Question Bank · {questions.length}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 font-display text-[10px] font-black text-black uppercase tracking-wider active:scale-95"
          >
            <Plus size={13} />
            New
          </button>
        </header>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1">
          <button
            onClick={() => setTab("manual")}
            className={cn(
              "rounded-xl py-2 font-display text-[10px] font-black uppercase tracking-wider transition-all",
              tab === "manual" ? "bg-white text-black" : "text-white/40",
            )}
          >
            Bank ({questions.length})
          </button>
          <button
            onClick={() => setTab("csv")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl py-2 font-display text-[10px] font-black uppercase tracking-wider transition-all",
              tab === "csv" ? "bg-white text-black" : "text-white/40",
            )}
          >
            <FileUp size={11} />
            CSV Import
          </button>
        </div>

        {tab === "manual" && (
          <div className="space-y-2.5">
            {isLoading && (
              <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-8">
                Loading…
              </p>
            )}
            {!isLoading && questions.length === 0 && (
              <p className="text-center font-display text-[10px] text-white/25 uppercase tracking-widest py-8">
                No questions yet — add one manually or import a CSV.
              </p>
            )}
            {questions.map((q: Question) => (
              <QuestionCard
                key={q.id}
                question={q}
                onEdit={() => openEdit(q)}
                onDelete={() => {
                  if (confirm("Delete this question? This can't be undone.")) {
                    deleteQuestion.mutate(q.id);
                  }
                }}
              />
            ))}
          </div>
        )}

        {tab === "csv" && (
          <CsvImportDropzone
            isUploading={importCsv.isPending}
            result={importCsv.data ?? null}
            onFileSelected={(file) => importCsv.mutate(file)}
          />
        )}
      </div>

      <QuestionFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initial={editing}
        onSubmit={handleSubmit}
        isSubmitting={createQuestion.isPending || updateQuestion.isPending}
      />
    </EnergyBackground>
  );
}