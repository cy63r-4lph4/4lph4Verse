"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { VerseProfile } from "../types/verseProfile";

import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { useAccount, useChainId, useConfig, useWalletClient } from "wagmi";
import { ChainId, getDeployedContract } from "../index";
import {
  loadDraft,
  saveDraft,
  clearDraft,
  loadCids,
  saveCids,
  clearCids,
  type ProfileCidCache,
} from "../utils/profile/profileDraft";
import { PROFILE_CHAIN } from "../config/constants";
import {
  buildCreateProfileCalldata,
  buildCreateProfileOp,
  buildTypedDataForCreateProfile,
} from "../utils/helpers/relayerHelpers";
import { makeFrontendPublicClient } from "../utils/helpers/makeFrontendClient";
import {
  buildProfileMetadata,
  uploadFileToPinata,
  uploadProfileMetadata,
} from "../services/storage";

type Progress =
  | "idle"
  | "uploading-avatar"
  | "uploading-metadata"
  | "signing"
  | "relaying"
  | "writing"
  | "done";

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
    owner: address || "",
    purpose: "",
    reputation: 0,
    location: "",
    joinedAt: new Date().toISOString(),
    personas: {},
    previousAvatarURL: undefined,
    avatarPreview: undefined,
    interests: [],
    links: {},
  });

  const [{ avatarCID, metadataCID }, setCidState] = useState<ProfileCidCache>({
    avatarCID: null,
    metadataCID: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<Progress>("idle");
  const [error, setError] = useState<string | null>(null);

  // Load draft and CIDs on mount
  useEffect(() => {
    const draft = loadDraft(address, profile.handle || undefined);
    if (draft) {
      setProfile((prev) => ({
        ...prev,
        ...draft,
        wallet: address || draft.wallet || "",
      }));
    }
    const cids = loadCids(
      address,
      draft?.handle || profile.handle || undefined
    );
    setCidState({
      avatarCID: cids.avatarCID ?? null,
      metadataCID: cids.metadataCID ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial mount only

  // Persist draft on profile changes (throttled via ref)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveDraft(profile, address, profile.handle);
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [profile, address]);

  // Persist CID cache when they change
  useEffect(() => {
    saveCids({ avatarCID, metadataCID }, address, profile.handle);
  }, [avatarCID, metadataCID, address, profile.handle]);

  function updateProfile(partial: Partial<VerseProfile>) {
    // If avatar changes, clear dependent CIDs
    if (Object.prototype.hasOwnProperty.call(partial, "avatar")) {
      setCidState((prev: {}) => ({
        ...prev,
        avatarCID: null,
        metadataCID: null,
      }));
    }
    // If any core metadata field changes after metadataCID exists, clear metadataCID
    const touchesMetadata =
      "handle" in partial ||
      "displayName" in partial ||
      "bio" in partial ||
      "personas" in partial;
    if (touchesMetadata && metadataCID) {
      setCidState((prev: {}) => ({ ...prev, metadataCID: null }));
    }
    setProfile((prev) => ({ ...prev, ...partial }));
  }

  function setAvatarFromFile(file?: File | null) {
    if (!file) {
      // removed
      if (profile.avatarPreview) URL.revokeObjectURL(profile.avatarPreview);
      updateProfile({ avatar: undefined, avatarPreview: undefined });
      return;
    }
    // new upload
    if (profile.avatarPreview) URL.revokeObjectURL(profile.avatarPreview);
    const preview = URL.createObjectURL(file);
    updateProfile({ avatar: file, avatarPreview: preview });
  }

  function updatePersona<T extends keyof VerseProfile["personas"]>(
    key: T,
    data: Partial<VerseProfile["personas"][T]>
  ) {
    updateProfile({
      personas: {
        ...profile.personas,
        [key]: {
          ...(profile.personas[key] || {}),
          ...data,
        },
      },
    });
  }

  function resetWizard() {
    if (profile.avatarPreview) URL.revokeObjectURL(profile.avatarPreview);
    setProfile({
      verseId: 0,
      handle: "",
      displayName: "",
      bio: "",
      avatar: "",
      banner: "",
      owner: address || "",
      reputation: 0,
      location: "",
      joinedAt: new Date().toISOString(),
      personas: {},
      previousAvatarURL: undefined,
      avatarPreview: undefined,
      interests: [],
      links: {},
    });
    setSubmitting(false);
    setProgress("idle");
    setError(null);
    setCidState({ avatarCID: null, metadataCID: null });
    clearDraft(address, "");
    clearCids(address, "");
  }

  // Core: progress-safe submission
  async function submitProfile(): Promise<boolean> {
    if (!address) {
      setError("Connect wallet first");
      return false;
    }

    const contractMeta = getDeployedContract(PROFILE_CHAIN, "VerseProfile");
    if (!contractMeta) {
      setError("VerseProfile contract missing for this chain");
      return false;
    }

    try {
      setSubmitting(true);
      setError(null);

      // 1) Avatar upload (only if needed)
      let finalAvatarCID = avatarCID ?? null;
      if (!finalAvatarCID) {
        if (profile.avatar && profile.avatar instanceof File) {
          setProgress("uploading-avatar");
          const { cid } = await uploadFileToPinata(profile.avatar, "avatar");
          finalAvatarCID = cid;
          setCidState((prev: {}) => ({
            ...prev,
            avatarCID: cid,
            metadataCID: null,
          }));
        } else if (
          typeof profile.avatar === "string" &&
          profile.avatar.startsWith("ipfs://")
        ) {
          // already IPFS
          finalAvatarCID = profile.avatar.replace("ipfs://", "");
          setCidState((prev: {}) => ({ ...prev, avatarCID: finalAvatarCID }));
        }
        // If avatar is empty string or http url fallback, just omit avatar in metadata
      }

      const avatarURL = finalAvatarCID ? `ipfs://${finalAvatarCID}` : undefined;

      // 2) Metadata upload (only if needed)
      let finalMetadataCID = metadataCID ?? null;
      if (!finalMetadataCID) {
        setProgress("uploading-metadata");
        const metadata = buildProfileMetadata({
          handle: profile.handle,
          displayName: profile.displayName,
          bio: profile.bio,
          avatarURL,
          personas: profile.personas,
        });
        const { cid } = await uploadProfileMetadata(metadata, profile.handle);
        finalMetadataCID = cid;
        setCidState((prev: {}) => ({ ...prev, metadataCID: cid }));
      }
      const metadataURI = `ipfs://${finalMetadataCID}`;

      // 3) Sign + relay or write (retry safe; no reuploads)
      const relayerEnabled = process.env.NEXT_PUBLIC_RELAYER_ENABLED === "true";

      if (relayerEnabled && walletClient) {
        setProgress("signing");

        // 1) get nonce (try relayer then fallback to chain)
        let nonce: bigint;
        try {
          const nonceRes = await fetch(
            `${process.env.NEXT_PUBLIC_RELAYER_URL}/v1/relay/nonce?contract=VerseProfile&address=${address}`
          );
          if (nonceRes.ok) {
            const json = await nonceRes.json();
            nonce = json.nonce;
          } else {
            throw new Error("Relayer nonce endpoint failed");
          }
        } catch (err) {
          // fallback: try to read from chain (optional)
          const publicClient = makeFrontendPublicClient(PROFILE_CHAIN);
          try {
            const onChainNonce = await publicClient.readContract({
              address: contractMeta.address as `0x${string}`,
              abi: contractMeta.abi,
              functionName: "createNonces",
              args: [address],
            });
            nonce = onChainNonce as bigint;
          } catch (e) {
            console.warn("Could not fetch nonce from relayer or chain", e);
            // As last resort set 0 (NOT recommended). Better to fail and ask relayer support.
            throw new Error("Unable to obtain nonce for signature");
          }
        }

        // 2) deadline
        const now = Math.floor(Date.now() / 1000);
        const deadline = now + 60 * 60; // 1 hour validity

        // 3) build op exactly matching RelayableTxTypes.VerseProfile.createProfileWithSig
        const op = buildCreateProfileOp({
          owner: address,
          handle: profile.handle,
          metadataURI,
          purpose: profile.purpose ?? "",
          nonce,
          deadline,
        });

        // 4) typedData
        const typedData = buildTypedDataForCreateProfile({
          verifyingContract: contractMeta.address as `0x${string}`,
          op,
        });

        // 5) Sign typed data
        const signature = await walletClient.signTypedData({
          domain: typedData.domain,
          types: typedData.types,
          primaryType: typedData.primaryType,
          message: typedData.message,
        });

        setProgress("relaying");

        // 6) build calldata for on-chain relayer to send
        const data = buildCreateProfileCalldata(op, signature);

        // 7) POST to relayer execute endpoint
        const body = {
          contract: "VerseProfile",
          fn: "createProfileWithSig",
          chainId,
          from: address,
          message: op,
          signature,
          data,
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_RELAYER_URL}/v1/relay/execute`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Relayer returned failure");
        }

        const txHash = result.txHash;
        if (!txHash) throw new Error("Relayer did not return txHash");

        setProgress("done");
        clearDraft(address, profile.handle);
        clearCids(address, profile.handle);
        return true;
      }

      setProgress("writing");
      const tx = await writeContract(config, {
        address: contractMeta.address,
        abi: contractMeta.abi,
        functionName: "createProfile",
        args: [profile.handle, metadataURI],
      });
      await waitForTransactionReceipt(config, { hash: tx });

      setProgress("done");
      clearDraft(address, profile.handle);
      clearCids(address, profile.handle);
      return true;
    } catch (err: any) {
      console.error("Profile submission failed:", err);
      setError(err.message || "Unknown error");
      return false;
    } finally {
      setSubmitting(false);
      if (progress !== "done") setProgress("idle");
    }
  }

  // Retry-aware entrypoint that resumes from checkpoints
  async function retrySubmit() {
    return submitProfile();
  }

  // Manual clear draft for UI button
  function clearDraftAndState() {
    if (profile.avatarPreview) URL.revokeObjectURL(profile.avatarPreview);
    clearDraft(address, profile.handle);
    clearCids(address, profile.handle);
    setCidState({ avatarCID: null, metadataCID: null });
    setError(null);
  }

  // Derived flags for UI
  const canRetry = useMemo(
    () =>
      !!error &&
      (progress === "idle" ||
        progress === "signing" ||
        progress === "relaying" ||
        progress === "writing"),
    [error, progress]
  );

  return {
    profile,
    updateProfile,
    updatePersona,
    submitProfile,
    retrySubmit,
    resetWizard,
    clearDraftAndState,
    setAvatarFromFile,
    submitting,
    progress,
    error,
    canRetry,
    avatarCID,
    metadataCID,
  };
}
