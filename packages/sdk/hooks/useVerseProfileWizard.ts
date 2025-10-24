"use client";

import { useState } from "react";
import type { VerseProfile } from "types/verseProfile";
import { uploadProfileToPinata } from "@verse/services/pinata";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { useAccount, useChainId, useConfig, useWalletClient } from "wagmi";
import { ChainId, getDeployedContract } from "../utils/contract/deployedContracts";
import { useRelayer } from "../hooks/useRelayer"; // 🔥 new optional hook

/* -------------------------------------------------------------------------- */
/* Hook: useVerseProfileWizard                                                */
/* -------------------------------------------------------------------------- */
export function useVerseProfileWizard(dapp?: string) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId() as ChainId;
  const config = useConfig();
  const relayer = useRelayer(); // optional, e.g., from your gasless infra

  /* ----------------------- Local State ----------------------- */
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
  const [progress, setProgress] = useState<"idle" | "uploading" | "signing" | "relaying" | "writing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  /* ----------------------- Mutators ----------------------- */
  function updateProfile(partial: Partial<VerseProfile>) {
    setProfile((prev) => ({ ...prev, ...partial }));
  }

  function updatePersona<T extends keyof VerseProfile["personas"]>(
    key: T,
    data: Partial<VerseProfile["personas"][T]>
  ) {
    setProfile((prev) => ({
      ...prev,
      personas: { ...prev.personas, [key]: { ...(prev.personas[key] || {}), ...data } },
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
  /* On-chain or Relayed Submission                                             */
  /* -------------------------------------------------------------------------- */
  async function submitProfile(): Promise<boolean> {
    if (!address) {
      setError("Please connect your wallet first.");
      return false;
    }

    const contract = getDeployedContract(chainId, "VerseProfile");

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

      // 2️⃣ Build transaction payload
      const txData = {
        address: contract.address,
        abi: contract.abi,
        functionName: "createProfile",
        args: [
          profile.handle,
          `ipfs://${metadataCID}`,
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        ],
      };

      /* ---------------------------------------------------------------------- */
      /* 🪄 Gasless Flow via Relayer (if available)                             */
      /* ---------------------------------------------------------------------- */
      if (relayer && relayer.isEnabled) {
        setProgress("signing");

        // Sign meta-tx off-chain
        const metaTx = await relayer.buildMetaTx({
          from: address,
          to: contract.address,
          data: await walletClient?.encodeFunctionData?.(txData),
          chainId,
        });

        setProgress("relaying");

        // Send to relayer backend
        const relayResult = await relayer.sendMetaTx(metaTx);
        if (!relayResult.success) throw new Error("Relayer failed to broadcast tx");

        console.log("✅ Relayer broadcasted meta-tx:", relayResult.txHash);

        setProgress("done");
        return true;
      }

      /* ---------------------------------------------------------------------- */
      /* ⛽ Standard Direct Transaction (Fallback)                              */
      /* ---------------------------------------------------------------------- */
      setProgress("writing");

      const tx = await writeContract(config, txData);
      await waitForTransactionReceipt(config, { hash: tx, confirmations: 1 });

      setProgress("done");
      return true;
    } catch (err: any) {
      console.error("❌ Profile submission failed:", err);
      setError(
        progress === "uploading"
          ? "Failed to upload profile to IPFS"
          : progress === "signing"
          ? "Signature failed"
          : progress === "relaying"
          ? "Relayer submission failed"
          : progress === "writing"
          ? "On-chain write failed"
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
