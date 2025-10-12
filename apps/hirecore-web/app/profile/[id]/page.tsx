"use client";

import { useParams } from "next/navigation";
import ClientProfileLayout from "@verse/hirecore-web/app/profile/sections/ClientProfileLayout";
import WorkerProfileLayout from "@verse/hirecore-web/app/profile/sections/WorkerProfileLayout";
import { useProfileById } from "@verse/sdk/hooks/useProfileById";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  // only call hook if we have a valid id
  const { profile, isLoading, error } = useProfileById(id ?? "");

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <p>Invalid profile route — no ID provided.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-400" />
        <p>Loading Verse Profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <p>No profile found for <span className="text-indigo-400">{id}</span></p>
      </div>
    );
  }

  const role =
    profile.role || profile.metadata?.role || "worker";

  return role === "client" ? (
    <ClientProfileLayout profile={profile} />
  ) : (
    <WorkerProfileLayout profile={profile} />
  );
}
