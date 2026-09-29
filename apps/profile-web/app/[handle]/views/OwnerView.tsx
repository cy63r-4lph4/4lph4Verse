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
            <div className="p-8 hud-panel space-y-6 bg-black/80 border border-alpha-cyan/50 box-glow relative">
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-alpha-cyan" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-alpha-cyan" />

              <div className="flex items-center gap-3 text-alpha-cyan border-b border-alpha-cyan/20 pb-4">
                <ShieldCheck size={26} className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                <h2 className="text-xl font-mono uppercase tracking-widest font-bold text-glow text-alpha-cyan">
                  Verify Identity
                </h2>
              </div>

              <p className="text-slate-400 text-sm font-mono leading-relaxed">
                {`> Identity verification strengthens your Verse profile, enables secure recovery, and signals trust.`}
              </p>

              <ul className="space-y-2 text-sm font-mono text-alpha-cyan/80 bg-alpha-cyan/5 p-4 border-l-2 border-alpha-cyan">
                <li><span className="text-alpha-cyan mr-2">[{'>'}]</span> Enables profile recovery</li>
                <li><span className="text-alpha-cyan mr-2">[{'>'}]</span> Prevents impersonation</li>
                <li><span className="text-alpha-cyan mr-2">[{'>'}]</span> Increases reputation weight</li>
              </ul>

              {/* Privacy Notice */}
              <div className="border border-alpha-magenta/30 bg-alpha-magenta/5 px-4 py-3 text-xs font-mono space-y-2">
                <p className="font-bold text-glow text-alpha-magenta uppercase tracking-widest">
                  SYS.WARN: Privacy-first
                </p>
                <p className="text-slate-300">
                  Your personal information is <span className="font-bold text-white">never stored</span>.
                  Verification uses zero-knowledge proofs.
                </p>
                <p className="text-alpha-magenta/60">
                  No documents, biometrics, or identity data are saved.
                </p>
              </div>

              <Button
                className="w-full bg-alpha-cyan/20 border border-alpha-cyan text-alpha-cyan hover:bg-alpha-cyan/40 hover:text-white transition rounded-none font-mono tracking-widest uppercase mt-4"
                onClick={() => setVerifyStep("verify")}
              >
                [ INITIATE VERIFICATION ]
              </Button>

              <p className="text-[10px] text-slate-500 text-center font-mono uppercase">
                {`> You're always in control. Close anytime.`}
              </p>
            </div>
          </ModalWrapper>
          {verifyStep === "verify" && (
            <ModalWrapper
              open={openVerify}
              onClose={() => {
                setOpenVerify(false);
                setVerifyStep("info");
              }}
            >
              <div className="p-8 hud-panel bg-black/80 border border-alpha-magenta/50 box-glow space-y-6 relative">
                <div className="flex items-center justify-between border-b border-alpha-magenta/20 pb-4">
                  <h2 className="text-xl font-mono uppercase tracking-widest font-bold text-glow text-alpha-magenta flex items-center gap-2">
                    <span className="w-2 h-2 bg-alpha-magenta animate-pulse" />
                    Identity verification
                  </h2>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-alpha-magenta/70 hover:text-alpha-magenta font-mono uppercase text-xs"
                    onClick={() => setVerifyStep("info")}
                  >
                    [ BACK ]
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

                <p className="text-[11px] text-alpha-magenta/50 text-center font-mono uppercase tracking-wider">
                  SYS.MSG: Zero-knowledge verification • No personal data stored
                </p>
              </div>
            </ModalWrapper>
          )}
        </>
      )}

      {verifiedSuccess && (
        <ModalWrapper open onClose={() => setVerifiedSuccess(false)}>
          <div className="p-10 hud-panel text-center space-y-4 border border-alpha-cyan bg-black/80 box-glow relative">
            <ShieldCheck size={48} className="mx-auto text-alpha-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            <h2 className="text-3xl font-mono uppercase tracking-widest font-bold text-glow text-alpha-cyan">Identity verified</h2>
            <p className="text-slate-400 font-mono text-sm">{`> Your Verse profile is now protected and recoverable.`}</p>

            <Button
              className="bg-alpha-cyan/20 border border-alpha-cyan text-alpha-cyan hover:bg-alpha-cyan/40 hover:text-white transition rounded-none font-mono tracking-widest uppercase mt-4"
              onClick={() => setVerifiedSuccess(false)}
            >
              [ CONTINUE ]
            </Button>
          </div>
        </ModalWrapper>
      )}

      {verifyError && (
        <ModalWrapper open onClose={() => setVerifyError(false)}>
          <div className="p-8 hud-panel text-center space-y-4 bg-black/80 border border-red-500/50 box-glow relative">
            <BadgeCheck size={42} className="mx-auto text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <h2 className="text-xl font-mono uppercase tracking-widest font-bold text-glow text-red-500">Verification incomplete</h2>
            <p className="text-slate-400 text-sm font-mono">{`> We couldn't verify your identity this time. You can retry anytime.`}</p>
            <Button variant="outline" onClick={() => setVerifyError(false)} className="border-red-500/50 text-red-400 hover:bg-red-500/20">
              Dismiss
            </Button>
          </div>
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
        "relative p-8 hud-panel box-glow border " +
        (danger
          ? "border-red-500/50 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          : "border-alpha-cyan/30 bg-black/40")
      }
    >
      {/* Decorative corner markers */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${danger ? 'border-red-500' : 'border-alpha-cyan'}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${danger ? 'border-red-500' : 'border-alpha-cyan'}`} />
      
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
