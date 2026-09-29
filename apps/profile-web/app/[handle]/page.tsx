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
        <div className="flex flex-col items-center gap-4 p-8 hud-panel box-glow">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl bg-alpha-cyan/30" />
            <Loader2 className="relative w-10 h-10 animate-spin text-alpha-cyan" />
          </div>

          <p className="text-alpha-cyan font-mono text-sm tracking-widest uppercase animate-pulse">
            {"> SYNCING IDENTITY..."}
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
      ? "text-red-400 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
      : "text-alpha-cyan border-alpha-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]";

  const glowClass = tone === "error" ? "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "text-glow text-alpha-cyan";

  return (
    <div className="flex items-center justify-center py-40">
      <div className={`max-w-md w-full p-6 hud-panel border ${toneClasses}`}>
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-4 font-mono text-xs uppercase tracking-widest border-b border-white/10 pb-2">
          <span className={`w-2 h-2 ${tone === "error" ? "bg-red-500" : "bg-alpha-cyan"} animate-pulse`} />
          {tone === "error" ? "SYS.ERR" : "SYS.LOG"} // TERMINAL_OUTPUT
        </div>
        
        <div className="flex flex-col items-center text-center mt-6">
          <div className="mb-4">{icon}</div>
          <h2 className={`text-xl font-mono uppercase tracking-widest font-bold mb-2 ${glowClass}`}>{title}</h2>
          <p className="text-sm font-mono text-slate-400 leading-relaxed">{`> ${description}`}</p>
        </div>

        {/* Decorative Corners */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${tone === "error" ? "border-red-500" : "border-alpha-cyan"}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${tone === "error" ? "border-red-500" : "border-alpha-cyan"}`} />
      </div>
    </div>
  );
}
