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

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-24">
      <AnimatePresence mode="wait">
        {panel === "identity" && (
          <PanelWrapper key="identity">
            <IdentityPanel
              profile={profile}
              onSave={async (draft) => {
                await updateProfile(draft);
                refetch();
              }}
            />
          </PanelWrapper>
        )}

        {panel === "authority" && (
          <PanelWrapper key="authority" danger>
            {/* AuthorityPanel goes here */}
            <Placeholder title="Authority" />
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
