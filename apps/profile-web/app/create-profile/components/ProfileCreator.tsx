"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import ProfilePreview from "./ProfilePreview";
import { Button } from "@verse/ui/components/ui/button";
import { useVerseProfileWizard } from "@verse/sdk";
import { useCheckHandle } from "@verse/sdk/hooks/useCheckHandle";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import TxErrorCard from "@verse/ui/components/ErrorCard";

export default function ProfileCreator() {
  const {
    profile,
    updateProfile,
    setAvatarFromFile,
    submitProfile,
    submitting,
    progress,
    error,
    retrySubmit,
  } = useVerseProfileWizard();
  const { status } = useCheckHandle(profile.handle);
  const [ready, setReady] = useState(false);

  async function handleSubmit() {
    const success = await submitProfile();
    if (success) console.log("successful");
  }
  useEffect(() => {
    if (status == "available" && profile.displayName.length >= 3) {
      setReady(true);
    } else setReady(false);
  }, [status, profile.displayName]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <ProfileForm
            form={profile}
            updateProfile={updateProfile}
            setAvatarFromFile={setAvatarFromFile}
          />{" "}
        </div>

        <div className="relative">
          <div className="sticky top-28 space-y-6">
            <ProfilePreview form={profile} />

            <Button
              className="w-full py-6 text-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition flex items-center justify-center gap-3"
              disabled={!ready || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-black">
                    {progress === "uploading-avatar" && "Uploading avatar…"}
                    {progress === "uploading-metadata" && "Syncing metadata…"}
                    {progress === "signing" && "Waiting for signature…"}
                    {progress === "relaying" && "Relaying…"}
                    {progress === "writing" && "Writing on-chain…"}
                    {progress === "done" && "Finalizing…"}
                    {progress === "idle" && "Submitting…"}
                  </span>
                </>
              ) : (
                <span>Create Profile</span>
              )}
            </Button>
            {error && (
              <TxErrorCard
                error={error}
                expectedChain="Base"
                onRetry={retrySubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
