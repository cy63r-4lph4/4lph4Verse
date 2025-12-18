"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CommandRail,
  OwnerPanel,
} from "@verse/profile-web/app/[handle]/componets/CommandRail";
import { IdentityPanel } from "@verse/profile-web/app/[handle]/componets/IdentityPannel";
import { useVerseProfileWizard, type VerseProfile } from "@verse/sdk";
import { useVerseProfile } from "@verse/sdk/hooks/useVerseProfile";
import { AuthorityPanel } from "@verse/profile-web/app/[handle]/componets/AuthorityPannel";
import { ModalWrapper } from "@verse/ui/profile/components/ModalWrapper";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Card } from "@verse/ui/components/ui/card";
import { Button } from "@verse/ui/components/ui/button";
import Verify from "@verse/profile-web/components/SelfQRCode";
import {
  APPNAME,
  resolveAvatarUrl,
  SCOPE,
  useProfileById,
  VERIFICATION_ENDPOINt,
} from "@verse/sdk";

interface OwnerProfileRootProps {
  children?: never;
}

export function OwnerProfileRoot(profile: VerseProfile) {
  const [panel, setPanel] = useState<OwnerPanel>("identity");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white">
      {/* Command Rail / Dock */}
      <CommandRail active={panel} onChange={setPanel} />

      {/* Main Content Stage */}
      <main className="relative z-10 md:pl-[96px] pb-24 md:pb-0">
        <MainStage panel={panel} profile={profile} />
      </main>
    </div>
  );
}

interface MainStageProps {
  panel: OwnerPanel;
  profile: VerseProfile;
}

export function MainStage({ panel, profile }: MainStageProps) {
  const { refetch } = useVerseProfile();
  const {
    updateProfile,
    setAvatarFromFile,
    submitProfile,
    submitting,
    progress,
    error,
    retrySubmit,
  } = useVerseProfileWizard();
  const [openVerify, setOpenVerify] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const [verifyStep, setVerifyStep] = useState<"info" | "verify">("info");
  const verified = profile.verified;
  const endpoint = VERIFICATION_ENDPOINt;
  const appName = APPNAME;
  const scope = SCOPE;

  const startVerification = () => {
    setOpenVerify(true);
    setVerifyStep("info");
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-24">
      <AnimatePresence mode="wait">
        {panel === "identity" && (
          <PanelWrapper key="identity">
            <IdentityPanel
              profile={profile}
              onVerify={async () => {
                startVerification();
                refetch();
              }}
              onSave={async (draft) => {
                await updateProfile(draft);
                refetch();
              }}
            />
          </PanelWrapper>
        )}

        {panel === "authority" && (
          <PanelWrapper key="authority">
            <AuthorityPanel
              profile={profile}
              isOwner={true}
              onSetDelegate={async (delegate) => {
                // await setProfileDelegate(profile.id, delegate);
                refetch();
              }}
              onVerify={async () => {
                startVerification();
                refetch();
              }}
            />
          </PanelWrapper>
        )}

        {panel === "personas" && (
          <PanelWrapper key="personas">
            {/* PersonasPanel goes here */}
            <Placeholder title="Personas" />
          </PanelWrapper>
        )}

        {panel === "activity" && (
          <PanelWrapper key="activity">
            {/* ActivityPanel goes here */}
            <Placeholder title="Activity" />
          </PanelWrapper>
        )}

        {panel === "settings" && (
          <PanelWrapper key="settings">
            {/* SettingsPanel goes here */}
            <Placeholder title="Settings" />
          </PanelWrapper>
        )}
      </AnimatePresence>
      {!verified && (
        <>
          <ModalWrapper
            open={openVerify}
            onClose={() => {
              setOpenVerify(false);
              setVerifyStep("info");
            }}
          >
            <Card className="p-8 rounded-3xl space-y-6 bg-black/40 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 text-purple-400">
                <ShieldCheck size={26} />
                <h2 className="text-2xl font-semibold">
                  Verify your Verse identity
                </h2>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                Identity verification strengthens your Verse profile, enables
                secure recovery, and signals trust across the network.
              </p>

              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Enables profile recovery</li>
                <li>• Prevents impersonation</li>
                <li>• Increases reputation weight</li>
              </ul>

              {/* Privacy Notice */}
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300 space-y-1">
                <p className="font-medium text-cyan-400">
                  Privacy-first verification
                </p>
                <p>
                  Your personal information is{" "}
                  <span className="font-semibold">never stored</span>.
                  Verification uses zero-knowledge proofs and cryptographic
                  hashes only.
                </p>
                <p className="text-slate-400">
                  No documents, biometrics, or identity data are saved by Verse.
                </p>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setVerifyStep("verify")}
              >
                Continue to verification
              </Button>

              <p className="text-[11px] text-slate-500 text-center">
                You're always in control. You can close this at any time.
              </p>
            </Card>
          </ModalWrapper>
          {verifyStep === "verify" && (
            <ModalWrapper
              open={openVerify}
              onClose={() => {
                setOpenVerify(false);
                setVerifyStep("info");
              }}
            >
              <Card className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Identity verification
                  </h2>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400"
                    onClick={() => setVerifyStep("info")}
                  >
                    Back
                  </Button>
                </div>

                <Verify
                  scope={scope}
                  endpoint={endpoint}
                  appName={appName}
                  userDefinedData="Used only as zero-knowledge recovery"
                  onSuccessAction={() => {
                    setVerifiedSuccess(true);
                    setOpenVerify(false);
                    setVerifyStep("info");
                    refetch();
                  }}
                  onErrorAction={() => {
                    setVerifyError(true);
                  }}
                />

                <p className="text-[11px] text-slate-500 text-center">
                  Zero-knowledge verification • No personal data stored
                </p>
              </Card>
            </ModalWrapper>
          )}
        </>
      )}

      {verifiedSuccess && (
        <ModalWrapper open onClose={() => setVerifiedSuccess(false)}>
          <Card className="p-10 rounded-3xl text-center space-y-4 border border-white/10 bg-white/5 backdrop-blur-xl">
            <ShieldCheck size={48} className="mx-auto text-green-400" />
            <h2 className="text-3xl font-semibold">Identity verified</h2>
            <p className="text-slate-400">
              Your Verse profile is now protected and recoverable.
            </p>

            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setVerifiedSuccess(false)}
            >
              Continue
            </Button>
          </Card>
        </ModalWrapper>
      )}

      {verifyError && (
        <ModalWrapper open onClose={() => setVerifyError(false)}>
          <Card className="p-8 rounded-3xl text-center space-y-4 bg-white/5 border border-white/10">
            <BadgeCheck size={42} className="mx-auto text-yellow-400" />
            <h2 className="text-xl font-semibold">Verification incomplete</h2>
            <p className="text-slate-400 text-sm">
              We couldn't verify your identity this time. You can retry anytime.
            </p>
            <Button variant="outline" onClick={() => setVerifyError(false)}>
              Dismiss
            </Button>
          </Card>
        </ModalWrapper>
      )}
    </div>
  );
}

interface PanelWrapperProps {
  children: React.ReactNode;
  danger?: boolean;
}

function PanelWrapper({ children, danger }: PanelWrapperProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={
        "relative rounded-3xl border p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(80,150,255,0.12)] " +
        (danger
          ? "border-red-500/20 bg-red-950/20"
          : "border-white/10 bg-white/5")
      }
    >
      {children}
    </motion.section>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-[60vh] items-center justify-center text-slate-400">
      <span className="text-2xl font-semibold">{title} Panel</span>
    </div>
  );
}
