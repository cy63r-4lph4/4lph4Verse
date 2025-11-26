"use client";

import React from "react";
import ParticleField from "../../components/particles";
import Link from "next/link";
import ConnectWalletButton from "@verse/ui/wallet/ConnectWalletButton";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";

export default function ProfileLayout({ handle, isOwner }) {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <main className="relative min-h-screen text-white bg-[#03040a] overflow-hidden">
      <ParticleField />

      {/* cosmic background */}
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(90,150,255,0.22), transparent 60%), radial-gradient(circle at 75% 75%, rgba(180,80,255,0.22), transparent 50%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* header */}
      <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-6">
        <Link
          href="/"
          className="text-lg font-semibold text-cyan-200 hover:text-cyan-300"
        >
          4lph4Verse • Identity
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/guardians"
            className="text-sm text-slate-300 hover:text-cyan-300 transition"
          >
            Guardian Registry
          </Link>

          <ConnectWalletButton />
        </div>
      </header>

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
    </main>
  );
}
