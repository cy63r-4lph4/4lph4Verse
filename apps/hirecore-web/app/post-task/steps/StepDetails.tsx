"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@verse/hirecore-web/components/ui/card";
import { Input } from "@verse/hirecore-web/components/ui/input";
import { Textarea } from "@verse/hirecore-web/components/ui/textarea";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";
import { Paperclip } from "lucide-react";

interface StepDetailsProps {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

export default function StepDetails({
  formData,
  setFormData,
}: StepDetailsProps) {
  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">
          Step 2: Task Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-white font-medium mb-2">
            Description *
          </label>
          <Textarea
            placeholder="Describe your task in detail... Include deliverables, expectations, or tools required."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-white font-medium mb-2">
            Required Skills (comma-separated)
          </label>
          <Input
            placeholder="e.g., Electrical Repair, Safety Certified"
            value={formData.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          <p className="text-gray-400 text-xs mt-1">
            Enter multiple skills separated by commas. Example:{" "}
            <i>Plumbing, Electrical, Welding</i>
          </p>
        </div>

        {/* Attachments (optional / future IPFS) */}
        <div>
          <label className="block text-white font-medium mb-2">
            Attachments (optional)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition">
              <Paperclip className="w-4 h-4" />
              <span>Upload File</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  // For now just store file names in formData (later → upload to IPFS)
                  handleChange(
                    "attachments" as keyof TaskFormData,
                    files.map((f) => f.name) as any
                  );
                }}
              />
            </label>
            {formData.attachments && (
              <span className="text-sm text-gray-300 truncate">
                {formData.attachments}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
