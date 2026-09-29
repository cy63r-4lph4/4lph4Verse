"use client";

/**
 * useVersePasskey — React Hook for Verse Wallet Passkey Operations
 *
 * Handles the full lifecycle:
 *   1. Register a new Passkey → extract P-256 public key → create wallet identity
 *   2. Authenticate → fetch deterministic address per chain
 *
 * Security model:
 *   • The P-256 private key NEVER leaves the device's Secure Enclave.
 *   • The backend only stores the PUBLIC key coordinates (X, Y) and credential ID.
 *   • The backend derives the wallet address from the public key via CREATE2.
 *   • Every transaction requires a fresh biometric/PIN confirmation.
 */

import { useState, useCallback } from "react";
import {
  registerPasskey,
  authenticatePasskey,
  type PasskeyRegistrationResult,
  type PasskeyAuthResult,
} from "../wallet/passkey";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VersePasskeyState {
  isRegistering: boolean;
  isAuthenticating: boolean;
  error: string | null;
}

export interface WalletAccount {
  chainId: number;
  address: string;
  deploymentStatus: "predicted" | "deployed";
}

export interface WalletIdentity {
  id: string;
  walletIdentityId: string;
  verseProfileId: string;
  accounts: WalletAccount[];
}

const BACKEND_URL =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
    : "http://localhost:3001";

// Supported chains for cross-chain address computation
const SUPPORTED_CHAIN_IDS = [
  42220, // Celo
  84532, // Base Sepolia
  4202,  // Lisk Sepolia
];

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useVersePasskey() {
  const [state, setState] = useState<VersePasskeyState>({
    isRegistering: false,
    isAuthenticating: false,
    error: null,
  });

  // ── Registration ─────────────────────────────────────────────────────────

  /**
   * Registers a new Verse Wallet for a profile.
   *
   * Flow:
   *  1. Browser shows native passkey prompt (Face ID / fingerprint / PIN)
   *  2. Secure Enclave generates a P-256 keypair — private key never leaves hardware
   *  3. We extract the PUBLIC key coordinates (X, Y) from the attestation
   *  4. POST to backend: create wallet identity (walletIdentityId derived from random seed)
   *  5. POST to backend: compute counterfactual address on each supported chain
   *     using CREATE2(walletIdentityId, initialPasskeyX, initialPasskeyY)
   *  6. Passkey credential ID is saved as the `derivationInitController` (INV-22)
   *
   * @param verseProfileId  - The profile this wallet will be linked to
   * @param displayName     - Shown in the OS passkey prompt (e.g. "@satoshi")
   */
  const registerWalletPasskey = useCallback(
    async (
      verseProfileId: string,
      displayName: string
    ): Promise<WalletIdentity | null> => {
      setState({ isRegistering: true, isAuthenticating: false, error: null });

      try {
        const rpId = window.location.hostname;

        // ── Step 1: WebAuthn — register passkey in Secure Enclave ──
        const registration: PasskeyRegistrationResult = await registerPasskey(
          verseProfileId,
          displayName,
          rpId
        );

        // ── Step 2: Create Wallet Identity on backend ──
        // Backend generates a random seed, derives walletIdentityId,
        // and IMMEDIATELY discards the seed (INV-04).
        const createRes = await fetch(`${BACKEND_URL}/wallet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verseProfileId }),
        });

        if (!createRes.ok) {
          throw new Error(`Failed to create wallet identity: ${createRes.statusText}`);
        }

        const { id: walletId, walletIdentityId, verseProfileId: linkedProfile } =
          await createRes.json();

        // ── Step 3: Register the Passkey as a controller ──
        // This records the passkey as the root validator (INV-19).
        const ctrlRes = await fetch(`${BACKEND_URL}/wallet/${walletId}/controller`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            controllerType: "passkey",
            controllerIdentifier: registration.credentialId,
            canSignTransactions: true,
            canManageControllers: true,  // root validator
            canInitiateRecovery: true,
          }),
        });

        if (!ctrlRes.ok) {
          throw new Error(`Failed to register passkey controller: ${ctrlRes.statusText}`);
        }

        // ── Step 4: Compute cross-chain addresses ──
        // For each supported chain, derive the CREATE2 address using
        // walletIdentityId + P-256 public key. This is deterministic:
        // same key → same address on every chain.
        const addressResults: WalletAccount[] = [];

        await Promise.all(
          SUPPORTED_CHAIN_IDS.map(async (chainId) => {
            const addrRes = await fetch(`${BACKEND_URL}/wallet/${walletId}/address`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chainId,
                initialPasskeyX: registration.publicKeyX.toString(),
                initialPasskeyY: registration.publicKeyY.toString(),
                passkeyCredentialId: registration.credentialId,
              }),
            });

            if (addrRes.ok) {
              const account = await addrRes.json();
              addressResults.push(account);
            } else {
              console.warn(
                `[VerseWallet] Failed to compute address for chain ${chainId}`
              );
            }
          })
        );

        const result: WalletIdentity = {
          id: walletId,
          walletIdentityId,
          verseProfileId: linkedProfile,
          accounts: addressResults,
        };

        // Cache the Celo address for the connector
        const celoAccount = addressResults.find((a) => a.chainId === 42220);
        if (celoAccount && typeof window !== "undefined") {
          localStorage.setItem("verse_wallet_address", celoAccount.address);
          localStorage.setItem("verse_wallet_credential_id", registration.credentialId);
        }

        setState({ isRegistering: false, isAuthenticating: false, error: null });
        return result;
      } catch (err: any) {
        console.error("[useVersePasskey] Registration error:", err);
        setState({
          isRegistering: false,
          isAuthenticating: false,
          error: err.message || "Registration failed",
        });
        return null;
      }
    },
    []
  );

  // ── Authentication ────────────────────────────────────────────────────────

  /**
   * Authenticates using an existing Passkey and fetches the wallet address.
   *
   * Flow:
   *  1. Browser shows native passkey selector (discoverable credential)
   *  2. User selects & approves with biometric/PIN
   *  3. We send the credential ID to backend to look up the wallet
   *  4. Backend returns the deterministic wallet address per chain
   */
  const connectWalletPasskey = useCallback(async (): Promise<string | null> => {
    setState({ isRegistering: false, isAuthenticating: true, error: null });

    try {
      const rpId = window.location.hostname;

      // ── Step 1: WebAuthn — discoverable credential (no credential ID needed) ──
      // User picks from their saved passkeys for this domain.
      const challenge = new TextEncoder().encode(
        "verse-auth-" + Date.now()
      );
      const auth: PasskeyAuthResult = await authenticatePasskey(challenge, rpId);

      // ── Step 2: Fetch wallet from backend via credential ID ──
      const res = await fetch(`${BACKEND_URL}/wallet/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkeyCredentialId: auth.credentialId }),
      });

      if (!res.ok) {
        throw new Error("No Verse Wallet found for this passkey. Please register first.");
      }

      const data = await res.json();
      const celoAccount = data.wallet?.accounts?.find(
        (a: WalletAccount) => a.chainId === 42220
      );

      if (!celoAccount) {
        throw new Error("Wallet exists but has no Celo address computed.");
      }

      // Cache for fast reconnects
      if (typeof window !== "undefined") {
        localStorage.setItem("verse_wallet_address", celoAccount.address);
        localStorage.setItem("verse_wallet_credential_id", auth.credentialId);
      }

      setState({ isRegistering: false, isAuthenticating: false, error: null });
      return celoAccount.address;
    } catch (err: any) {
      console.error("[useVersePasskey] Auth error:", err);
      setState({
        isRegistering: false,
        isAuthenticating: false,
        error: err.message || "Authentication failed",
      });
      return null;
    }
  }, []);

  // ── Disconnect ────────────────────────────────────────────────────────────

  const disconnectWallet = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("verse_wallet_address");
      localStorage.removeItem("verse_wallet_credential_id");
    }
  }, []);

  return {
    ...state,
    registerWalletPasskey,
    connectWalletPasskey,
    disconnectWallet,
  };
}
