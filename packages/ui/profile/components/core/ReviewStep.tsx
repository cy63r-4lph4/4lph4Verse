"use client";

import { motion } from "framer-motion";
import { Loader2, Wand2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { WizardNav } from "../ui/WizardNav";
import { AvatarPreview } from "../ui/AvatarPreview";
import type { VerseProfile } from "@verse/sdk/types";

type ReviewStepProps = {
  profile: VerseProfile;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  progress?: "idle" | "uploading" | "writing" | "done";
  error?: string | null;
};

export function ReviewStep({
  profile,
  onBack,
  onSubmit,
  submitting,
  progress = "idle",
  error,
}: ReviewStepProps) {
  const personaEntries = Object.entries(profile.personas || {}).filter(
    ([, v]) => v !== undefined && v !== null
  );

  return (
    <GlassCard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-white">
            Review & Deploy
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Confirm your Verse Identity and attached personas before forging it on-chain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-3">
            <SummaryRow label="Handle" value={`@${profile.handle}`} />
            <SummaryRow label="Display Name" value={profile.displayName} />
            <SummaryRow label="Bio" value={profile.bio || "—"} />
            <SummaryRow label="Location" value={profile.location || "—"} />

            {personaEntries.length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-white mb-2">
                  Attached Personas
                </h4>
                <div className="space-y-2">
                  {personaEntries.map(([key, value]) => (
                    <SummaryRow
                      key={key}
                      label={key}
                      value={JSON.stringify(value, null, 2)}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-md px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <div>
            <AvatarPreview value={profile.avatar || ""} />
            {profile.banner && (
              <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.banner}
                  alt="Banner"
                  className="w-full h-16 object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-gray-200 border border-white/15 hover:bg-white/10 transition"
          >
            Back
          </button>

          <button
            onClick={onSubmit}
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {progress === "uploading" && "Uploading to IPFS…"}
                {progress === "writing" && "Writing on-chain…"}
                {progress === "done" && "Finalizing…"}
                {progress === "idle" && "Submitting…"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Wand2 className="h-4 w-4" /> Confirm & Deploy
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </GlassCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Subcomponent                                                               */
/* -------------------------------------------------------------------------- */

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-800/40 px-3 py-2">
      <div className="min-w-[110px] text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="text-sm text-gray-100 whitespace-pre-wrap break-all">
        {value}
      </div>
    </div>
  );
}
