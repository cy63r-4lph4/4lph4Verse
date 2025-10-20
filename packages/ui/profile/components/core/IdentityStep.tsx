"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { useRef } from "react";
import { GlassCard } from "../ui/GlassCard";
import { WizardNav } from "../ui/WizardNav";
import { TextField } from "../ui/TextField";
import { TextArea } from "../ui/TextArea";
import { AvatarPicker } from "../ui/AvatarPicker";
import type { VerseProfile } from "@verse/sdk/types";

type IdentityStepProps = {
  profile: VerseProfile;
  updateProfile: (data: Partial<VerseProfile>) => void;
  onNext: () => void;
  onBack?: () => void;
};

export function IdentityStep({ profile, updateProfile, onNext, onBack }: IdentityStepProps) {
  const inputBanner = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (!profile.handle || !profile.displayName) return;
    onNext();
  };

  return (
    <GlassCard>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-white">Your Universal Identity</h2>
          <p className="text-gray-400 text-sm mt-1">
            Define how you’ll appear across the 4lph4Verse — your handle, name, and essence.
          </p>
        </div>

        {/* Avatar + Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <TextField
              label="Handle"
              prefix="@"
              value={profile.handle}
              onChange={(v) => updateProfile({ handle: v.replace(/^@/, "") })}
              placeholder="cy63r_4lph4"
              required
            />

            <TextField
              label="Display Name"
              value={profile.displayName}
              onChange={(v) => updateProfile({ displayName: v })}
              placeholder="Cy63r_4lph4~🐉"
              required
            />

            <TextArea
              label="Bio"
              value={profile.bio || ""}
              onChange={(v) => updateProfile({ bio: v })}
              placeholder="Web3 builder. Hiring dragons. Paying in CØRE."
              maxLength={180}
            />
          </div>

          <div className="space-y-3">
            <AvatarPicker
              value={profile.avatar || ""}
              onChange={(url) => updateProfile({ avatar: url })}
            />

            {/* Banner uploader */}
            <div className="rounded-lg border border-white/10 bg-zinc-800/40 p-2 text-center">
              <input
                ref={inputBanner}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => updateProfile({ banner: String(reader.result) });
                  reader.readAsDataURL(file);
                }}
              />
              {profile.banner ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.banner}
                    alt="Banner"
                    className="w-full h-20 object-cover rounded-md"
                  />
                  <button
                    className="text-xs mt-2 text-gray-400 underline"
                    onClick={() => updateProfile({ banner: "" })}
                  >
                    Remove Banner
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => inputBanner.current?.click()}
                  className="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white"
                >
                  <ImageIcon className="h-4 w-4" /> Upload Banner
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <WizardNav back={onBack} next={handleNext} nextLabel="Continue" />
      </motion.div>
    </GlassCard>
  );
}
