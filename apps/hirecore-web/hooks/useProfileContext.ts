"use client";

import { useAccount } from "wagmi";
import { useMemo } from "react";
import { VerseProfile } from "@verse/sdk/types/verseProfile";
interface UseProfileContextOptions {
  context?: "worker" | "hirer";
}

interface ProfileContextResult {
  context: "worker" | "hirer";
  isOwner: boolean;
  hasBothRoles: boolean;
  defaultRole: "worker" | "hirer";
  targetProfile: any;
}

/**
 * useProfileContext
 *
 * Smart hook to derive the correct role context for a profile.
 * Works both with explicit props (context) or defaultRole fallback.
 */
export function useProfileContext(
  profile?: VerseProfile,
  options: UseProfileContextOptions = {}
): ProfileContextResult {
  const { address } = useAccount();
  const { context: passedContext } = options;

  return useMemo(() => {
    if (!profile || !profile.personas?.hirecore) {
      return {
        context: "worker",
        isOwner: false,
        hasBothRoles: false,
        defaultRole: "worker",
        targetProfile: profile,
      };
    }

    const isOwner =
      !!address && profile.owner?.toLowerCase() === address?.toLowerCase();
    const hasBothRoles = !!(
      profile.personas.hirecore?.roles.worker &&
      profile.personas.hirecore?.roles.hirer
    );
    const defaultRole: "worker" | "hirer" = profile.personas?.hirecore?.roles
      ?.worker
      ? "worker"
      : profile.personas?.hirecore?.roles?.hirer
        ? "hirer"
        : "worker";

    const context = (passedContext || defaultRole) as "worker" | "hirer";

    const targetProfile =
      context === "hirer"
        ? profile.personas.hirecore?.roles.hirer || profile
        : profile.personas.hirecore?.roles.worker || profile;

    return {
      context,
      isOwner,
      hasBothRoles,
      defaultRole,
      targetProfile,
    };
  }, [profile, address, passedContext]);
}
