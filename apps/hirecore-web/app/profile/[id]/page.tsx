"use client";

import { useParams } from "next/navigation";
import { useProfileById } from "@verse/sdk/hooks/useProfileById";
import { useProfileContext } from "@verse/hirecore-web/hooks/useProfileContext";
import DualProfileLayout from "@verse/hirecore-web/app/profile/sections/DualProfileLayout";
import ClientProfileLayout from "@verse/hirecore-web/app/profile/sections/ClientProfileLayout";
import WorkerProfileLayout from "@verse/hirecore-web/app/profile/sections/WorkerProfileLayout";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();
  const profileId = Array.isArray(id) ? id[0] : id;
  const { profile, isLoading, error } = useProfileById(profileId ?? "");
  const { context, isOwner, hasBothRoles, targetProfile } = useProfileContext(profile);

  if (!id)
    return <CenteredMessage text="Invalid profile route — no ID provided." />;

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-400" />
        <p>Loading Verse Profile...</p>
      </div>
    );

  if (error || !profile)
    return (
      <CenteredMessage text={`No profile found for ${id}`} />
    );

  // 👤 Owner view → dual layout
  if (isOwner && hasBothRoles) {
    return <DualProfileLayout profile={profile} />;
  }

  // 👥 Public view → context layout
  if (context === "client") {
    return <ClientProfileLayout profile={targetProfile} />;
  }
  return <WorkerProfileLayout profile={targetProfile} />;
}

/* Small helper */
function CenteredMessage({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
      <p>{text}</p>
    </div>
  );
}
