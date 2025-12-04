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
      <div className="flex flex-col items-center justify-center py-40 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-lg">Loading profile…</p>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-red-400">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-lg font-medium">Failed to load profile</p>
        <p className="text-sm text-red-300 mt-2">{String(error)}</p>
      </div>
    );
  }

  // ❓ PROFILE NOT FOUND
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-neutral-400">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-lg font-medium">Profile not found</p>
        <p className="text-sm text-neutral-500 mt-2">
          The user @{handle} does not exist.
        </p>
      </div>
    );
  }

  // 🧍 OWNER CHECK
  const isOwner = profile.owner?.toLowerCase() === address?.toLowerCase();

  // 🎉 SUCCESS — RENDER PROFILE
  return <ProfileRenderer profile={profile} isOwner={isOwner} />;
}
