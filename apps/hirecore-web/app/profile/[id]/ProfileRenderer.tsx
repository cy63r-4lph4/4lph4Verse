"use client";

import { useProfileById } from "@verse/sdk/hooks/useProfileById";
import { useProfileContext } from "@verse/hirecore-web/hooks/useProfileContext";
import DualProfileLayout from "../sections/DualProfileLayout";
import ClientProfileLayout from "../sections/ClientProfileLayout";
import WorkerProfileLayout from "../sections/WorkerProfileLayout";
import { Loader2 } from "lucide-react";
import { consumeContext } from "@verse/hirecore-web/utils/ContextBridge";
import { useState } from "react";

export default function ProfileRenderer({
  id,
  fallbackContext,
}: {
  id: string;
  fallbackContext?: "worker" | "client";
}) {
    const [navContext] = useState<"worker" | "client" | undefined>(() => consumeContext());
  const passedContext = navContext || fallbackContext;

  const { profile, isLoading, error } = useProfileById(id);
  const {
    context,
    isOwner,
    hasBothRoles,
    targetProfile,
  } = useProfileContext(profile, { context: passedContext });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-400" />
        <p>Loading Verse Profile...</p>
      </div>
    );

  if (error || !profile)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <p>No profile found for {id}</p>
      </div>
    );

  if (isOwner && hasBothRoles) return <DualProfileLayout profile={profile} />;

  return context === "client" ? (
    <ClientProfileLayout profile={targetProfile} />
  ) : (
    <WorkerProfileLayout profile={targetProfile} />
  );
}
