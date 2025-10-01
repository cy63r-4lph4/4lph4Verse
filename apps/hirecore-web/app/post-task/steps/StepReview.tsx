"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@verse/hirecore-web/components/ui/card";
import { Button } from "@verse/hirecore-web/components/ui/button";
import { AlertCircle } from "lucide-react";
import { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";

interface StepReviewProps {
  formData: TaskFormData;
  onSubmit?: () => Promise<void>; // passed from wizard container
  submitting?: boolean;
}

export default function StepReview({ formData, onSubmit, submitting }: StepReviewProps) {
  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Step 5: Review & Submit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-bold text-white">{formData.title || "Untitled Task"}</h3>
          <p className="text-gray-300 text-sm">{formData.description || "No description provided."}</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-400">
            <span>📂 {formData.category || "Uncategorized"}</span>
            <span>⚡ {formData.urgency || "Normal"}</span>
            <span>📍 {formData.location || "No location"}</span>
            <span>💰 {formData.budget || "0"} CØRE</span>
            <span>⏳ {formData.timeEstimate || "N/A"}</span>
            <span>🗓 Duration: {formData.duration ? `${parseInt(formData.duration) / 86400} days` : "N/A"}</span>
          </div>
          {/* Attachments */}
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="mt-2">
              <h4 className="text-gray-300 font-medium text-sm mb-1">Attachments:</h4>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                {formData.attachments.map((file, idx) => (
                  <li key={idx}>{file}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Escrow Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">Payment Information</h4>
              <p className="text-gray-300 text-sm">
                A deposit in CØRE tokens will be locked in escrow to post this task. 
                Funds are released to the worker only upon your approval.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            disabled={submitting}
            onClick={onSubmit}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 crypto-glow"
          >
            {submitting ? "Posting..." : "Confirm & Post Task"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
