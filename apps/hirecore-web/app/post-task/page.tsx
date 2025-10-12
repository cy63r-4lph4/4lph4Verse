"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@verse/hirecore-web/components/ui/button";
import { Card } from "@verse/hirecore-web/components/ui/card";

import StepOverview from "./steps/StepOverview";
import StepDetails from "./steps/StepDetails";
import StepBudget from "./steps/StepBudget";
import StepReview from "./steps/StepReview";
import StepLocation from "./steps/StepLocation";

import { TaskFormData, TaskPayload } from "@verse/hirecore-web/utils/Interfaces";
import { useSubmitTask } from "@verse/hirecore-web/hooks/useSubmitTask";

/* -------------------- Progress Bar -------------------- */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
      />
    </div>
  );
}

export default function PostTaskPage() {
  const router = useRouter();
  const TOTAL_STEPS = 5;
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "",
    urgency: "",
    serviceType: "",
    location: "",
    coordinates: { lat: "", lng: "" },
    skills: "",
    attachments: [],
    budget: "",
    timeEstimate: "",
    duration: "",
    paymentToken: "",
  });

  const { submitTask, loading } = useSubmitTask();

  const canGoBack = step > 1;
  const canGoNext = step < TOTAL_STEPS;

  const next = () => {
    const errors = validateStep(step, formData);
    if (errors.length) {
      toast("Please fix the following", { description: errors.join(" • ") });
      return;
    }
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = useCallback(async () => {
    const finalErrors = validateAll(formData);
    if (finalErrors.length) {
      toast("Missing required info", { description: finalErrors.join(" • ") });
      return;
    }

    try {
      setSubmitting(true);
      const payload: TaskPayload & {
        budget: number;
        duration?: number;
        skills: string[];
      } = {
        ...formData,
        budget: parseInt(formData.budget || "0", 10),
        duration: formData.duration ? parseInt(formData.duration, 10) : undefined,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };

      await submitTask(payload);

      toast.success("🎉 Task Posted Successfully!", {
        description: "Your task is now visible to workers.",
      });
      router.push("/find-tasks");
    } catch (err) {
      const msg = (err as Error)?.message || "Failed to post task";
      toast.error("❌ Error", { description: msg });
    } finally {
      setSubmitting(false);
    }
  }, [formData, router, submitTask]);

  const stepView = useMemo(() => {
    switch (step) {
      case 1:
        return <StepOverview formData={formData} setFormDataAction={setFormData} />;
      case 2:
        return <StepDetails formData={formData} setFormDataAction={setFormData} />;
      case 3:
        return <StepLocation formData={formData} setFormDataAction={setFormData} />;
      case 4:
        return <StepBudget formData={formData} setFormDataAction={setFormData} />;
      case 5:
        return (
          <StepReview
            formData={formData}
          />
        );
      default:
        return null;
    }
  }, [step, formData, submitting, loading, handleSubmit]);

  return (
    <div className="relative min-h-screen pt-24 pb-28 px-3 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold bg-gradient-to-r from-blue-500 via-purple-400 to-emerald-400 text-transparent bg-clip-text mb-3">
            Post a Task
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Describe your job, set your budget, and let the right talent find you.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 tracking-wide">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <Card className="glass-effect border border-white/10 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg backdrop-blur-xl">
              {stepView}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 w-full backdrop-blur-xl bg-black/40 border-t border-white/10 p-4 sm:p-6 flex items-center justify-between md:static md:mt-6 rounded-t-2xl md:rounded-none">
          <Button
            variant="outline"
            disabled={!canGoBack || submitting || loading}
            onClick={back}
            className="w-1/2 sm:w-auto"
          >
            Back
          </Button>

          {canGoNext ? (
            <Button
              onClick={next}
              disabled={submitting || loading}
              className="w-1/2 sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || loading}
              className="w-1/2 sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
            >
              {submitting || loading ? "Posting..." : "Confirm & Post Task"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- validation helpers -------------------- */
function validateStep(step: number, d: TaskFormData): string[] {
  const errs: string[] = [];
  if (step === 1) {
    if (!d.title?.trim()) errs.push("Task title is required");
    if (!d.category?.trim()) errs.push("Category is required");
    if (!d.urgency?.trim()) errs.push("Urgency is required");
    if (!d.serviceType?.trim()) errs.push("Service type is required");
  }
  if (step === 2) {
    if (!d.description?.trim()) errs.push("Description is required");
  }
  if (step === 3) {
    if (!d.location?.trim()) errs.push("Location is required");
  }
  if (step === 4) {
    if (!d.budget?.trim()) errs.push("Budget is required");
    if (!d.duration?.trim()) errs.push("Duration is required");
  }
  return errs;
}

function validateAll(d: TaskFormData): string[] {
  return [
    ...validateStep(1, d),
    ...validateStep(2, d),
    ...validateStep(3, d),
    ...validateStep(4, d),
  ];
}
