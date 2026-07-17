"use client";

import { useCallback, useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@verse/ui";

interface CsvImportDropzoneProps {
  onFileSelected: (file: File) => void;
  result?: { insertedCount: number; errorCount: number; errors: { row: number; message: string }[] } | null;
  isUploading?: boolean;
}

export function CsvImportDropzone({ onFileSelected, result, isUploading }: CsvImportDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  return (
    <div className="space-y-3">
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-8 cursor-pointer transition-all",
          isDragging ? "border-primary/50 bg-primary/[0.04]" : "border-white/15 bg-white/[0.02] hover:border-white/25",
        )}
      >
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelected(file);
            e.target.value = "";
          }}
        />
        {isUploading ? (
          <>
            <FileSpreadsheet size={22} className="text-primary animate-pulse" />
            <p className="font-display text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              Processing…
            </p>
          </>
        ) : (
          <>
            <UploadCloud size={22} className="text-white/30" />
            <p className="font-display text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              Drop CSV or click to browse
            </p>
            <p className="font-display text-[9px] text-white/20 uppercase tracking-wider">
              prompt, optionA–D, correctLetter, difficulty, category
            </p>
          </>
        )}
      </label>

      {result && (
        <div
          className={cn(
            "rounded-xl border p-3 space-y-1.5",
            result.errorCount > 0
              ? "border-amber-500/25 bg-amber-500/[0.06]"
              : "border-emerald-500/25 bg-emerald-500/[0.06]",
          )}
        >
          <div className="flex items-center gap-2">
            {result.errorCount > 0 ? (
              <AlertTriangle size={13} className="text-amber-400" />
            ) : (
              <CheckCircle2 size={13} className="text-emerald-400" />
            )}
            <p className="font-display text-[10px] font-bold uppercase tracking-wider text-white/70">
              {result.insertedCount} imported
              {result.errorCount > 0 && `, ${result.errorCount} failed`}
            </p>
          </div>
          {result.errors.length > 0 && (
            <div className="space-y-1 pl-5">
              {result.errors.slice(0, 5).map((err, i) => (
                <p key={i} className="text-[10px] text-amber-300/70 font-mono">
                  Row {err.row}: {err.message}
                </p>
              ))}
              {result.errors.length > 5 && (
                <p className="text-[10px] text-white/30">+{result.errors.length - 5} more</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}