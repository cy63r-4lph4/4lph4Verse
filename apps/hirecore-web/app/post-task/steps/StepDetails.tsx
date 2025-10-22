"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/ui/components/ui/card";
import { Input } from "@verse/ui/components/ui/input";
import { Textarea } from "@verse/ui/components/ui/textarea";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";
import { Paperclip, X } from "lucide-react";
import { useState } from "react";

interface StepDetailsProps {
  formData: TaskFormData;
  setFormDataAction: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

export default function StepDetails({
  formData,
  setFormDataAction,
}: StepDetailsProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormDataAction((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // ✅ store actual File objects (not just names)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setFormDataAction((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files], // store File[]
    }));

    // reset the input so same file can be reselected
    e.target.value = "";
  };

  // ✅ remove either File or string attachments
  const removeAttachment = (file: File | string) => {
    setFormDataAction((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) =>
        typeof a === "string"
          ? a !== file
          : file instanceof File && a instanceof File
          ? a.name !== file.name
          : true
      ),
    }));
  };

  return (
    <Card className="glass-effect border border-white/10 rounded-2xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white">
          Step 2 · Task Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* --- Description --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Description <span className="text-red-400">*</span>
          </label>
          <Textarea
            placeholder="Describe your task in detail — what’s expected, any tools needed, or the desired outcome."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 min-h-[140px] rounded-xl resize-none"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        {/* --- Required Skills --- */}
        <div className="space-y-2">
          <label className="block text-white font-medium">
            Required Skills (comma-separated)
          </label>
          <Input
            placeholder="e.g., Electrical Repair, Safety Certified"
            value={formData.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
            className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl"
          />
        </div>

        {/* --- Attachments --- */}
        <div className="space-y-3">
          <label className="block text-white font-medium">Attachments (optional)</label>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200">
              <Paperclip className="w-4 h-4" />
              <span>Upload Files</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {/* ✅ Preview uploaded attachments */}
            {formData.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/20 text-gray-200 text-xs hover:bg-white/15 transition"
                  >
                    <span className="truncate max-w-[120px]">
                      {typeof file === "string" ? file : file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-gray-400 text-xs leading-relaxed">
            You can attach reference images, instructions, or files (PDFs, images, etc.).
            Files are stored securely on IPFS when you post.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
