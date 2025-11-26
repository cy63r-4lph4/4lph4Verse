"use client";

import React from "react";
import ParticleField from "../../components/particles";
import Link from "next/link";
import ConnectWalletButton from "@verse/ui/wallet/ConnectWalletButton";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";

export default function ProfileLayout({
  handle,
  isOwner,
}: {
  handle: string;
  isOwner: boolean;
}) {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <>
      <div className="relative z-10 max-w-6xl mx-auto pt-40 pb-20 px-6">
        <ProfileHeader handle={handle} isOwner={isOwner} />

        <ProfileTabs active={activeTab} onChange={setActiveTab} />

        {/* tab content */}
        <div className="mt-10">
          {activeTab === "overview" && <div>Overview Coming Soon</div>}
          {activeTab === "guardians" && <div>Guardians Coming Soon</div>}
          {activeTab === "activity" && <div>Activity Coming Soon</div>}
        </div>
      </div>
    </>
  );
}
