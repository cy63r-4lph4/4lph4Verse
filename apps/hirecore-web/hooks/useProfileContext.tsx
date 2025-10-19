"use client";

import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { useMemo } from "react";

interface ProfileContextResult {
  context: "worker" | "client";
  isOwner: boolean;
  hasBothRoles: boolean;
  defaultRole: "worker" | "client";
  targetProfile: any;
}

/**
 * 🧩 useProfileContext
 * 
 * Dynamically resolves:
 * - Whether the current viewer is the profile owner
 * - What role context (worker/client) should be displayed
 * - If the profile has both roles (dual layout)
 * - Which profile subset to render
 */
export function useProfileContext(profile?: any): ProfileContextResult {
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const contextParam = searchParams.get("context");

  return useMemo(() => {
    if (!profile) {
      return {
        context: "worker",
        isOwner: false,
        hasBothRoles: false,
        defaultRole: "worker",
        targetProfile: undefined,
      };
    }

    const isOwner =
      profile.wallet?.toLowerCase() === address?.toLowerCase();
    const hasBothRoles = !!(profile.workerData && profile.clientData);
    const defaultRole = profile.defaultRole || "worker";
    const context =
      (contextParam as "worker" | "client") ||
      defaultRole ||
      "worker";

    // Determine which subset to show
    const targetProfile =
      context === "client"
        ? profile.clientData || profile
        : profile.workerData || profile;

    return {
      context,
      isOwner,
      hasBothRoles,
      defaultRole,
      targetProfile,
    };
  }, [profile, address, contextParam]);
}
