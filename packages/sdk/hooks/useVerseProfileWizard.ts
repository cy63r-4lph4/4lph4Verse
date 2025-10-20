"use client";
import { useState } from "react";
import { VerseProfile } from "types/verseProfile";

export function useVerseProfileWizard(initial?: Partial<VerseProfile>) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<VerseProfile>({
    verseId: initial?.verseId || 0,
    handle: initial?.handle || "",
    displayName: initial?.displayName || "",
    bio: initial?.bio || "",
    avatar: initial?.avatar || "",
    banner: initial?.banner || "",
    wallet: initial?.wallet || "",
    location: initial?.location || "",
    reputation: initial?.reputation || 0,
    joinedAt: initial?.joinedAt || new Date().toISOString(),
    personas: initial?.personas || {},
  });

  function updateProfile(partial: Partial<VerseProfile>) {
    setProfile((prev) => ({ ...prev, ...partial }));
  }

  function updatePersona<T extends keyof VerseProfile["personas"]>(
    key: T,
    data: Partial<VerseProfile["personas"][T]>
  ) {
    setProfile((prev) => ({
      ...prev,
      personas: {
        ...prev.personas,
        [key]: { ...prev.personas[key], ...data },
      },
    }));
  }

  return { step, setStep, profile, updateProfile, updatePersona };
}
