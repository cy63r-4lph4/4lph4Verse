"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { WizardNav } from "../ui/WizardNav";
import { AvatarPicker } from "../ui/AvatarPicker";
import type { VerseProfile } from "@verse/sdk/types";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useCheckHandle } from "@verse/sdk/hooks/useCheckHandle";

type IdentityStepProps = {
  profile: VerseProfile;
  updateProfile: (data: Partial<VerseProfile>) => void;
  onNext: () => void;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export function IdentityStep({
  profile,
  updateProfile,
  onNext,
}: IdentityStepProps) {
  const { status, isAvailable } = useCheckHandle(profile.handle);

  /* ---------------------------------------------------------------------- */
  /* Proceed to Next Step                                                   */
  /* ---------------------------------------------------------------------- */
  const handleContinue = () => {
    if (!isAvailable) return;
    if (!profile.displayName) return;
    onNext();
  };

  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */
  return (
    <GlassCard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-white">
            Forge Your Verse Identity
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Choose a unique Verse handle and display name to represent your
            identity across the Verse.
          </p>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            {/* Handle Field */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Handle <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  @
                </span>
                <Input
                  value={profile.handle}
                  style={{ textTransform: "lowercase" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateProfile({
                      handle: e.target.value.replace(/^@/, "").toLowerCase(),
                    })
                  }
                  placeholder="cy63r_4lph4"
                  className="pl-7 bg-background/60 border-white/10 text-white"
                />
                <HandleStatusIcon status={status} />
              </div>
              <HandleStatusText status={status} />
            </div>

            {/* Display Name */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">
                Display Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={profile.displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateProfile({ displayName: e.target.value })
                }
                placeholder="Cy63r_4lph4~🐉"
                className="bg-background/60 border-white/10 text-white"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Bio</label>
              <Textarea
                value={profile.bio || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateProfile({ bio: e.target.value })
                }
                placeholder="Web3 builder. Hiring dragons. Paying in CØRE."
                maxLength={180}
                className="bg-background/60 border-white/10 text-white min-h-[100px]"
              />
              <div className="text-xs text-right text-gray-500 mt-1">
                {profile.bio?.length || 0}/180
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div>
            <AvatarPicker
              value={profile.avatar || ""}
              onChange={(url) => updateProfile({ avatar: url })}
            />
          </div>
        </div>

        {/* Navigation */}
        <WizardNav
          next={handleContinue}
          disableNext={!isAvailable || !profile.displayName}
          nextLabel="Continue"
        />
      </motion.div>
    </GlassCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Sub-Components: Handle Status                                              */
/* -------------------------------------------------------------------------- */

function HandleStatusIcon({ status }: { status: string }) {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
      {status === "checking" && (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 blur-sm animate-spin-slow opacity-60" />
          <Loader2 className="relative h-4 w-4 text-indigo-300 animate-spin-slow" />
        </div>
      )}

      {status === "available" && (
        <CheckCircle className="h-4 w-4 text-green-500" />
      )}
      {status === "taken" && <XCircle className="h-4 w-4 text-red-500" />}
      {status === "invalid" && <XCircle className="h-4 w-4 text-yellow-500" />}
    </div>
  );
}

function HandleStatusText({ status }: { status: string }) {
  const textMap: Record<string, string> = {
    idle: "",
    checking: "Checking availability...",
    available: "This handle is available!",
    taken: "Handle already taken.",
    invalid:
      "Invalid format — use 3-20 lowercase letters, numbers, or underscores.",
    error: "Error checking handle.",
  };

  const colorMap: Record<string, string> = {
    available: "text-green-400",
    taken: "text-red-400",
    invalid: "text-yellow-400",
    checking: "text-gray-400",
    error: "text-red-400",
    idle: "text-transparent",
  };

  return (
    <motion.p
      key={status}
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`text-xs mt-1 min-h-[1.2rem] ${colorMap[status]}`}
    >
      {textMap[status]}
    </motion.p>
  );
}
