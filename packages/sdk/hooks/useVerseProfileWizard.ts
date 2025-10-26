"use client";

import { useState } from "react";
import type { VerseProfile } from "types/verseProfile";
import { buildProfileMetadata, uploadFileToPinata, uploadProfileMetadata} from "@verse/services/pinata";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { useAccount, useChainId, useConfig, useWalletClient } from "wagmi";
import { ChainId, getDeployedContract } from "../index";
import { buildProfileTypedData } from "../index";



const ZERO_BYTES_32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useVerseProfileWizard() {
  const { address } = useAccount();
  const chainId = useChainId() as ChainId;
  const config = useConfig();
  const { data: walletClient } = useWalletClient();

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
    "idle" | "uploading" | "signing" | "relaying" | "writing" | "done"
  >("idle");
  const [error, setError] = useState<string | null>(null);

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
        [key]: {
          ...(prev.personas[key] || {}),
          ...data,
        },
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

 async function submitProfile(): Promise<boolean> {
  if (!address) {
    setError("Connect wallet first");
    return false;
  }

  const contract = getDeployedContract(chainId, "VerseProfile");
  if (!contract) {
    setError("VerseProfile contract missing for this chain");
    return false;
  }

  try {
    setSubmitting(true);

    // 1️⃣ Upload avatar first if needed
    setProgress("uploading");

    let avatarURL: string | null = null;
    if (profile.avatar instanceof File) {
      const { cid } = await uploadFileToPinata(profile.avatar, "avatar");
      avatarURL = `ipfs://${cid}`;
    }

    // 2️⃣ Build + upload metadata
    const metadata = buildProfileMetadata({
      handle: profile.handle,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarURL,
      personas: profile.personas,
    });

    const { cid: metadataCID } = await uploadProfileMetadata(
      metadata,
      profile.handle
    );

    const metadataURI = `ipfs://${metadataCID}`;

    // 3️⃣ Decide whether to relay or do direct tx
    const relayerEnabled =
      process.env.NEXT_PUBLIC_RELAYER_ENABLED === "true";

    if (relayerEnabled && walletClient) {
      setProgress("signing");

      const typedData = {
        ...buildProfileTypedData(chainId),
        primaryType: "CreateProfile",
        message: {
          wallet: address,
          handle: profile.handle,
          metadataURI,
        },
      };

      const signature = await walletClient.signTypedData({
        domain: typedData.domain,
        types: typedData.types,
        primaryType: "CreateProfile",
        message: typedData.message,
      });

      setProgress("relaying");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_RELAYER_URL}/relay/profile/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: address,
            handle: profile.handle,
            metadataURI,
            signature,
            chainId,
          }),
        }
      );

      const data = await res.json();
      if (!data.txHash) {
        throw new Error(data.error || "Relayer failed");
      }

      setProgress("done");
      return true;
    }

    // 4️⃣ Direct write
    setProgress("writing");

    const tx = await writeContract(config, {
      address: contract.address,
      abi: contract.abi,
      functionName: "createProfile",
      args: [profile.handle, metadataURI, ZERO_BYTES_32],
    });

    await waitForTransactionReceipt(config, { hash: tx });
    setProgress("done");
    return true;
  } catch (err: any) {
    console.error("Profile submission failed:", err);
    setError(err.message || "Unknown error");
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
