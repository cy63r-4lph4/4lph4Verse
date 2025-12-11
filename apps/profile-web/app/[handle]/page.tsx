"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import ProfileRenderer from "./ProfileRenderer";
import { useProfileById } from "@verse/sdk";
import { Loader2, AlertTriangle } from "lucide-react";

export default function ProfilePage() {
  const { handle } = useParams() as { handle: string };
  const { address } = useAccount();
  const { profile, isLoading, error } = useProfileById(handle);

  // ⏳ LOADING STATE
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl bg-cyan-400/30" />
            <Loader2 className="relative w-10 h-10 animate-spin text-cyan-400" />
          </div>

          <p className="text-slate-400 text-sm tracking-wide">
            Loading Verse identity…
          </p>
        </div>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <StateCard
        tone="error"
        icon={<AlertTriangle className="w-8 h-8" />}
        title="Unable to load profile"
        description="We couldn't fetch this Verse identity right now. Please try again in a moment."
      />
    );
  }

  // ❓ PROFILE NOT FOUND
  if (!profile) {
    return (
      <StateCard
        icon={<AlertTriangle className="w-8 h-8 text-yellow-400" />}
        title="Profile not found"
        description={`The Verse identity @${handle} does not exist or hasn’t been created yet.`}
      />
    );
  }

  // 🧍 OWNER CHECK
  const isOwner = profile.owner?.toLowerCase() === address?.toLowerCase();

  // 🎉 SUCCESS — RENDER PROFILE
  return <ProfileRenderer profile={profile} isOwner={isOwner} />;
}

function StateCard({
  icon,
  title,
  description,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "neutral" | "error";
}) {
  const toneClasses =
    tone === "error"
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : "text-cyan-400 bg-white/5 border-white/10";

  return (
    <div className="flex items-center justify-center py-40">
      <div
        className={`max-w-md w-full rounded-3xl border backdrop-blur-xl px-8 py-10 text-center shadow-[0_0_40px_rgba(0,0,0,0.25)] ${toneClasses}`}
      >
        <div className="flex justify-center mb-4">{icon}</div>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
