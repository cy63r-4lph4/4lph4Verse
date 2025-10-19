"use client";

import { useAccount } from "wagmi";
import { useMemo } from "react";

interface UseProfileContextOptions {
  context?: "worker" | "client"; // optional override
}

interface ProfileContextResult {
  context: "worker" | "client";
  isOwner: boolean;
  hasBothRoles: boolean;
  defaultRole: "worker" | "client";
  targetProfile: any;
}

/**
 * useProfileContext
 * 
 * Smart hook to derive the correct role context for a profile.
 * Works both with explicit props (context) or defaultRole fallback.
 */
export function useProfileContext(
  profile?: any,
  options: UseProfileContextOptions = {}
): ProfileContextResult {
  const { address } = useAccount();
  const { context: passedContext } = options;

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

    const isOwner = profile.wallet?.toLowerCase() === address?.toLowerCase();
    const hasBothRoles = !!(profile.workerData && profile.clientData);
    const defaultRole = profile.defaultRole || "worker";

    // ✅ Determine active context
    const context = (passedContext || defaultRole) as "worker" | "client";

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
  }, [profile, address, passedContext]);
}
