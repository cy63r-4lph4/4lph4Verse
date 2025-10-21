"use client";

import { useState } from "react";
import type { VerseProfile } from "types/verseProfile";
import { uploadProfileToPinata } from "@verse/services/pinata";
import { waitForTransactionReceipt } from "wagmi/actions";
import { createPublicClient, http } from "viem";
import { celoSepolia } from "viem/chains";
import { useAccount, useChainId, useWriteContract, useConfig } from "wagmi";
import { ChainId, getDeployedContract } from "../utils/contract/deployedContracts";

/* -------------------------------------------------------------------------- */
/* Hook: useVerseProfileWizard                                                */
/* -------------------------------------------------------------------------- */
export function useVerseProfileWizard(dapp?: string) {
  const { address } = useAccount();
  const chainId = useChainId() as ChainId;
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  /* ─────────────── State ─────────────── */
  const [profile, setProfile] = useState<VerseProfile>({
    verseId: 0,
    handle: "",
    displayName: "",
    bio: "",
    avatar: "",
    banner: "",
    wallet: address || "",
    reputation: 0,
    location: "",
    joinedAt: new Date().toISOString(),
    personas: {},
  });

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<
    "idle" | "uploading" | "writing" | "done"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  /* ─────────────── Mutators ─────────────── */
  function updateProfile(partial: Partial<VerseProfile>) {
    setProfile((prev) => ({ ...prev, ...partial }));
  }

  function updatePersona<T extends keyof VerseProfile["personas"]>(
    key: T,
    data: Partial<VerseProfile["personas"][T]>
  ) {
    setProfile((prev) => ({
      ...prev,
      personas: {
        ...prev.personas,
        [key]: { ...(prev.personas[key] || {}), ...data },
      },
    }));
  }

  function resetWizard() {
    setProfile({
      verseId: 0,
      handle: "",
      displayName: "",
      bio: "",
      avatar: "",
      banner: "",
      wallet: address || "",
      reputation: 0,
      location: "",
      joinedAt: new Date().toISOString(),
      personas: {},
    });
    setSubmitting(false);
    setProgress("idle");
    setError(null);
  }

  /* -------------------------------------------------------------------------- */
  /* On-chain Submission Logic                                                 */
  /* -------------------------------------------------------------------------- */
  async function submitProfile(): Promise<boolean> {
    if (!address) {
      setError("Please connect your wallet first.");
      return false;
    }

    try {
      setSubmitting(true);
      setProgress("uploading");

      // 1️⃣ Upload metadata to IPFS
      const { metadataCID } = await uploadProfileToPinata({
        handle: profile.handle,
        displayName: profile.displayName,
        bio: profile.bio,
        avatar: profile.avatar,
        extras: profile.personas,
      });

      setProgress("writing");

      // 2️⃣ Write to VerseProfile smart contract
      const contract = getDeployedContract(chainId, "VerseProfile");
      const tx = await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: "createProfile",
        args: [
          profile.handle,
          `ipfs://${metadataCID}`,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        ],
      });

      await waitForTransactionReceipt(config, { hash: tx, confirmations: 1 });

      setProgress("done");
      return true;
    } catch (err: any) {
      console.error("❌ Profile submission failed:", err);
      setError(
        progress === "uploading"
          ? "Failed to upload profile to IPFS"
          : progress === "writing"
          ? "Failed to write profile on-chain"
          : "Something went wrong"
      );
      return false;
    } finally {
      setSubmitting(false);
      setProgress("idle");
    }
  }

  return {
    profile,
    updateProfile,
    updatePersona,
    submitProfile,
    resetWizard,
    submitting,
    progress,
    error,
  };
}
