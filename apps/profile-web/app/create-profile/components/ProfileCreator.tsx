"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "./ProfileForm";
import ProfilePreview from "./ProfilePreview";
import { VerseWalletSetupStep } from "./VerseWalletSetupStep";
import { Button } from "@verse/ui/components/ui/button";
import { useCheckHandle } from "@verse/sdk/hooks/useCheckHandle";
import { Loader2 } from "lucide-react";
import { useV6ProfileWizard } from "../../../hooks/useV6ProfileWizard";

export default function ProfileCreator() {
  const {
    profileDraft,
    updateProfile,
    submitProfile,
    submitting,
    progress,
    error,
    walletAddresses,
  } = useV6ProfileWizard();

  const { status } = useCheckHandle(profileDraft.handle);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      status === "available" &&
      profileDraft.displayName.length >= 3 &&
      profileDraft.email.length >= 5
    ) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [status, profileDraft.displayName, profileDraft.email]);

  // Navigate to profile page after done
  useEffect(() => {
    if (progress === "done" && profileDraft.handle) {
      const timer = setTimeout(() => {
        router.push(`/${profileDraft.handle}`);
      }, 3000); // brief pause so user can see their addresses
      return () => clearTimeout(timer);
    }
  }, [progress, profileDraft.handle, router]);

  const handleInitiate = async () => {
    await submitProfile();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Profile Form */}
        <div>
          <ProfileForm form={profileDraft} updateProfile={updateProfile} />
        </div>

        {/* Right: Preview + Wallet Setup */}
        <div className="relative">
          <div className="sticky top-28 space-y-6">
            <ProfilePreview form={{ ...profileDraft, avatarPreview: "" }} />

            {/* Verse Wallet Setup Step */}
            <VerseWalletSetupStep
              progress={progress}
              error={error}
              walletAddresses={walletAddresses}
              submitting={submitting}
              onInitiate={handleInitiate}
            />

            {/* Primary submit button — only shown when idle and form is valid */}
            {progress === "idle" && (
              <Button
                className="w-full py-6 text-lg bg-alpha-cyan/20 text-alpha-cyan border border-alpha-cyan hover:bg-alpha-cyan/40 hover:text-white transition flex items-center justify-center gap-3 font-mono tracking-widest uppercase rounded-none"
                disabled={!ready || submitting}
                onClick={handleInitiate}
              >
                <span>[ INITIALIZE IDENTITY ]</span>
              </Button>
            )}

            {/* During wizard: show a slim status bar instead */}
            {progress !== "idle" && progress !== "done" && progress !== "error" && (
              <div className="flex items-center justify-center gap-3 py-3 border border-alpha-cyan/20 bg-alpha-cyan/5 font-mono text-xs text-alpha-cyan uppercase tracking-widest">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {progress === "creating-profile"    && "Creating profile..."}
                  {progress === "registering-passkey"  && "Awaiting biometric..."}
                  {progress === "creating-wallet"     && "Generating wallet..."}
                  {progress === "computing-address"   && "Computing addresses..."}
                  {progress === "minting-nft"         && "Minting NFT..."}
                </span>
              </div>
            )}

            {/* Done: redirect notice */}
            {progress === "done" && (
              <div className="py-3 border border-alpha-cyan/50 bg-alpha-cyan/10 font-mono text-xs text-alpha-cyan uppercase tracking-widest text-center">
                ✓ Identity online · Redirecting to profile...
              </div>
            )}

            {/* Error handled inside VerseWalletSetupStep */}
          </div>
        </div>
      </div>
    </div>
  );
}
