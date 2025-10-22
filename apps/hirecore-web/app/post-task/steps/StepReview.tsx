"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@verse/ui/components/ui/card";
import {
  Folder,
  Zap,
  MapPin,
  Banknote,
  Clock,
  CalendarDays,
  FileText,
  Paperclip,
  Info,
  ExternalLink,
} from "lucide-react";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";

interface StepReviewProps {
  formData: TaskFormData;
}

export default function StepReview({ formData }: StepReviewProps) {
  const durationDays = formData.duration
    ? parseInt(formData.duration) / 86400
    : null;

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl md:text-2xl">
          Step 5 · Review Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* --- Task Summary --- */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">
              {formData.title || "Untitled Task"}
            </h3>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">
            {formData.description || "No description provided."}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm text-gray-300">
            <Field icon={Folder} label="Category" value={formData.category || "Uncategorized"} />
            <Field icon={Zap} label="Urgency" value={formData.urgency || "Normal"} />
            <Field icon={MapPin} label="Location" value={formData.location || "No location"} />
            <Field icon={Banknote} label="Budget" value={`${formData.budget || 0} CØRE`} />
            <Field icon={Clock} label="Time Estimate" value={formData.timeEstimate || "N/A"} />
            <Field
              icon={CalendarDays}
              label="Duration"
              value={durationDays ? `${durationDays} days` : "N/A"}
            />
          </div>

          {/* --- Attachments --- */}
          {formData.attachments?.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Paperclip className="w-4 h-4 text-gray-300" />
                <h4 className="text-gray-300 font-medium text-sm">Attachments</h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.attachments.map((file, idx) => {
                  const name =
                    typeof file === "string"
                      ? file.startsWith("ipfs://")
                        ? file.replace("ipfs://", "").slice(0, 10) + "..."
                        : file.split("/").pop()
                      : file.name;

                  const isIpfs = typeof file === "string" && file.startsWith("ipfs://");
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-xs text-gray-300 hover:bg-white/15 transition"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-indigo-300" />
                      <span className="truncate max-w-[140px]">{name}</span>
                      {isIpfs && (
                        <a
                          href={`https://ipfs.io/ipfs/${file.replace("ipfs://", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* --- Escrow Notice --- */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 md:p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">
                Payment Information
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                A deposit in CØRE tokens will be locked in escrow to post this
                task. Funds are released only after your approval when work is
                completed.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------- */
/* Small helper for field rendering   */
/* ---------------------------------- */
function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
      <Icon className="w-4 h-4 text-indigo-400" />
      <span className="text-gray-400">{label}:</span>
      <span className="text-white font-medium truncate">{value}</span>
    </div>
  );
}
