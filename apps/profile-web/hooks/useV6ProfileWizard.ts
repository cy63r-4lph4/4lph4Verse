"use client";

/**
 * useV6ProfileWizard — Profile + Verse Wallet creation wizard.
 *
 * Steps:
 *  1. Create Profile record in backend (identity/profile)
 *  2. Register WebAuthn Passkey via browser Secure Enclave
 *     → extracts real P-256 public key (X, Y) from attestation
 *  3. POST to backend: create wallet identity (walletIdentityId)
 *  4. POST to backend: register passkey as root controller
 *  5. POST to backend: compute CREATE2 address on each supported chain
 *  6. Mint profile NFT on-chain
 *
 * Replaces all mock public keys with real WebAuthn-derived P-256 coordinates.
 */

import { useState } from "react";
import { registerPasskey } from "@verse/sdk/wallet/passkey";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const SUPPORTED_CHAINS = [
  { id: 42220,  name: "Celo" },
  { id: 44787,  name: "Celo Alfajores" },
  { id: 84532,  name: "Base Sepolia" },
  { id: 4202,   name: "Lisk Sepolia" },
];

export type Progress =
  | "idle"
  | "creating-profile"
  | "registering-passkey"
  | "creating-wallet"
  | "computing-address"
  | "minting-nft"
  | "done"
  | "error";

export interface ChainAddress {
  chainId: number;
  chainName: string;
  address: string;
  deploymentStatus: "predicted" | "deployed";
}

export function useV6ProfileWizard() {
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<Progress>("idle");
  const [error, setError] = useState<string | null>(null);
  const [walletAddresses, setWalletAddresses] = useState<ChainAddress[]>([]);
  const [verseWalletId, setVerseWalletId] = useState<string | null>(null);

  const [profileDraft, setProfileDraft] = useState({
    handle: "",
    displayName: "",
    email: "",
  });

  const updateProfile = (updates: Partial<typeof profileDraft>) => {
    setProfileDraft((prev) => ({ ...prev, ...updates }));
  };

  const submitProfile = async (): Promise<boolean> => {
    try {
      setSubmitting(true);
      setError(null);

      // ── Step 1: Create Profile in backend ────────────────────────────────
      setProgress("creating-profile");

      const profileRes = await fetch(`${BACKEND_URL}/identity/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: profileDraft.handle,
          displayName: profileDraft.displayName,
          contactEmail: profileDraft.email,
        }),
      });

      if (!profileRes.ok) {
        const msg = await profileRes.text();
        throw new Error(`Failed to create profile: ${msg}`);
      }

      const { data: profileData } = await profileRes.json();
      const profile = profileData?.profile ?? profileData;

      if (!profile?.id) {
        throw new Error("Backend did not return a valid profile ID.");
      }

      // ── Step 2: Register Passkey in Secure Enclave ────────────────────────
      // The browser shows a native biometric/PIN prompt.
      // The private key is generated in hardware and NEVER leaves the device.
      setProgress("registering-passkey");

      const registration = await registerPasskey(
        profile.id,                                  // stable opaque user handle (never shown)
        `@${profileDraft.handle}`,                   // shown in OS passkey prompt
        window.location.hostname
      );

      // ── Step 3: Create Verse Wallet Identity in backend ───────────────────
      setProgress("creating-wallet");

      const walletRes = await fetch(`${BACKEND_URL}/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verseProfileId: profile.id }),
      });

      if (!walletRes.ok) {
        throw new Error("Failed to create wallet identity.");
      }

      const walletData = await walletRes.json();
      const walletId = walletData.id ?? walletData.walletId;

      if (!walletId) {
        throw new Error("Backend did not return a wallet ID.");
      }

      setVerseWalletId(walletId);

      // Register the passkey as the root controller (INV-19)
      await fetch(`${BACKEND_URL}/wallet/${walletId}/controller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          controllerType: "passkey",
          controllerIdentifier: registration.credentialId,
          canSignTransactions: true,
          canManageControllers: true,
          canInitiateRecovery: true,
        }),
      });

      // ── Step 4: Compute cross-chain addresses ─────────────────────────────
      // The backend uses CREATE2(walletIdentityId + P-256 pubkey) to derive
      // the same deterministic address on every chain.
      setProgress("computing-address");

      const addressResults = await Promise.allSettled(
        SUPPORTED_CHAINS.map(async (chain) => {
          const res = await fetch(`${BACKEND_URL}/wallet/${walletId}/address`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chainId: chain.id,
              // Real P-256 coordinates from WebAuthn attestation (not mocked)
              initialPasskeyX: registration.publicKeyX.toString(),
              initialPasskeyY: registration.publicKeyY.toString(),
              passkeyCredentialId: registration.credentialId,
            }),
          });

          if (!res.ok) {
            throw new Error(`Chain ${chain.id}: ${await res.text()}`);
          }

          const account = await res.json();
          return {
            chainId: chain.id,
            chainName: chain.name,
            address: account.address,
            deploymentStatus: account.deploymentStatus ?? "predicted",
          } satisfies ChainAddress;
        })
      );

      const computed: ChainAddress[] = addressResults
        .filter((r): r is PromiseFulfilledResult<ChainAddress> => r.status === "fulfilled")
        .map((r) => r.value);

      const failed = addressResults.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        console.warn(
          `[Wallet] ${failed.length} chain(s) failed address computation:`,
          failed
        );
      }

      setWalletAddresses(computed);

      // Cache Celo address for the connector
      const celoAccount = computed.find((a) => a.chainId === 42220);
      if (celoAccount && typeof window !== "undefined") {
        localStorage.setItem("verse_wallet_address", celoAccount.address);
        localStorage.setItem(
          "verse_wallet_credential_id",
          registration.credentialId
        );
      }

      // ── Step 5: Mint Profile NFT ──────────────────────────────────────────
      setProgress("minting-nft");

      const mintRes = await fetch(
        `${BACKEND_URL}/identity/profile/${profile.id}/mint`,
        { method: "POST" }
      );

      if (!mintRes.ok) {
        // Non-fatal: wallet is created even if mint fails
        console.warn("[Wizard] NFT mint failed:", await mintRes.text());
      }

      setProgress("done");
      return true;
    } catch (err: any) {
      console.error("[ProfileWizard] Error:", err);
      setError(err.message || "An unknown error occurred.");
      setProgress("error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    profileDraft,
    updateProfile,
    submitProfile,
    submitting,
    progress,
    error,
    walletAddresses,
    verseWalletId,
  };
}
