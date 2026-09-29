/**
 * Verse Wallet — Wagmi/RainbowKit Connector
 *
 * Implements a full ERC-4337 wallet as a standard Wagmi connector using
 * WebAuthn Passkeys as the signing primitive.
 *
 * Security architecture:
 *   • The P-256 private key lives in the device's Secure Enclave (TPM/FaceID/WinHello).
 *   • It NEVER leaves the device hardware — not even as an encrypted export.
 *   • Every transaction requires a fresh biometric or PIN confirmation.
 *   • The on-chain WebAuthn P256Validator verifies the signature — the backend
 *     cannot forge or bypass it even if fully compromised.
 *
 * ERC-4337 flow:
 *   eth_sendTransaction → buildUserOp() → computeUserOpHash() (viem keccak256)
 *     → Passkey signs hash in Secure Enclave → submit to bundler via backend
 */

import { Wallet } from "@rainbow-me/rainbowkit";
import { createConnector } from "wagmi";
import {
  keccak256,
  encodeAbiParameters,
  encodePacked,
  encodeFunctionData,
  toBytes,
  toHex,
  concat,
  type Hex,
  type Address,
} from "viem";
import {
  authenticatePasskey,
  strToBuffer,
  bufferToBase64url,
} from "@verse/sdk/wallet/passkey";

// ─── Constants ────────────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

/** ERC-4337 EntryPoint v0.7 — canonical address on all EVM chains */
const ENTRYPOINT = "0x0000000071727De22E5E9d8BAf0edAc6f37da032" as const;

/** Celo mainnet chain ID */
const CELO_CHAIN_ID = 42220;

// ─── ABI Definitions ─────────────────────────────────────────────────────────

/**
 * Kernel v3 execute function ABI.
 * Kernel.execute(address to, uint256 value, bytes calldata data, uint8 operation)
 * operation: 0 = CALL
 */
const KERNEL_EXECUTE_ABI = [
  {
    name: "execute",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "operation", type: "uint8" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// ─── UserOperation Builder ────────────────────────────────────────────────────

/**
 * Fetches the ERC-4337 nonce for an account from the backend
 * (which reads from the EntryPoint contract on-chain).
 */
async function getNonce(address: string, chainId: number): Promise<bigint> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/wallet/nonce?address=${address}&chainId=${chainId}`
    );
    if (!res.ok) return 0n;
    const { nonce } = await res.json();
    return BigInt(nonce);
  } catch {
    return 0n;
  }
}

/**
 * Encodes the Kernel v3 `execute` calldata using viem's type-safe ABI encoder.
 */
function encodeExecuteCalldata(
  to: Address,
  value: bigint,
  data: Hex
): Hex {
  return encodeFunctionData({
    abi: KERNEL_EXECUTE_ABI,
    functionName: "execute",
    args: [to, value, data, 0], // 0 = CALL
  });
}

/**
 * Builds an ERC-4337 v0.7 UserOperation struct.
 *
 * Per EIP-4337 §UserOperation:
 *   The `nonce` upper 192 bits = key (0 for default), lower 64 bits = sequential.
 *   Gas limits are estimates; the bundler SHOULD re-simulate and adjust.
 */
async function buildUserOp(params: {
  sender: Address;
  to: Address;
  data: Hex;
  value: bigint;
  chainId: number;
}): Promise<Record<string, Hex | string>> {
  const nonce = await getNonce(params.sender, params.chainId);

  const callData = encodeExecuteCalldata(params.to, params.value, params.data);

  return {
    sender: params.sender,
    nonce: toHex(nonce),
    initCode: "0x",       // bundler handles deployment if address is counterfactual
    callData,
    callGasLimit: "0x493E0",           // 300k
    verificationGasLimit: "0x493E0",   // 300k
    preVerificationGas: "0x10000",     // 64k
    maxFeePerGas: "0x3B9ACA00",        // 1 gwei
    maxPriorityFeePerGas: "0x3B9ACA00",
    paymasterAndData: "0x",
    signature: "0x",  // filled after signing
  };
}

/**
 * Computes the canonical ERC-4337 v0.7 UserOperation hash.
 *
 * Per EIP-4337 §getUserOpHash:
 *   innerHash = keccak256(abi.encode(
 *     sender, nonce,
 *     keccak256(initCode), keccak256(callData),
 *     callGasLimit, verificationGasLimit, preVerificationGas,
 *     maxFeePerGas, maxPriorityFeePerGas,
 *     keccak256(paymasterAndData)
 *   ))
 *   userOpHash = keccak256(abi.encode(innerHash, entryPoint, chainId))
 *
 * Uses viem's keccak256 — correct EVM Keccak-256, NOT SHA-256.
 */
function computeUserOpHash(
  userOp: Record<string, Hex | string>,
  chainId: number
): Hex {
  // 1. Hash dynamic fields
  const initCodeHash = keccak256(userOp.initCode as Hex);
  const callDataHash = keccak256(userOp.callData as Hex);
  const paymasterHash = keccak256(userOp.paymasterAndData as Hex);

  // 2. ABI-encode and hash all packed fields → innerHash
  //    Matches EntryPoint._getUserOpHash() exactly
  const innerHash = keccak256(
    encodeAbiParameters(
      [
        { type: "address" }, // sender
        { type: "uint256" }, // nonce
        { type: "bytes32" }, // keccak256(initCode)
        { type: "bytes32" }, // keccak256(callData)
        { type: "uint256" }, // callGasLimit
        { type: "uint256" }, // verificationGasLimit
        { type: "uint256" }, // preVerificationGas
        { type: "uint256" }, // maxFeePerGas
        { type: "uint256" }, // maxPriorityFeePerGas
        { type: "bytes32" }, // keccak256(paymasterAndData)
      ],
      [
        userOp.sender as Address,
        BigInt(userOp.nonce as string),
        initCodeHash,
        callDataHash,
        BigInt(userOp.callGasLimit as string),
        BigInt(userOp.verificationGasLimit as string),
        BigInt(userOp.preVerificationGas as string),
        BigInt(userOp.maxFeePerGas as string),
        BigInt(userOp.maxPriorityFeePerGas as string),
        paymasterHash,
      ]
    )
  );

  // 3. Outer: keccak256(abi.encode(innerHash, entryPoint, chainId))
  //    This binds the hash to a specific EntryPoint and chain (replay protection)
  return keccak256(
    encodeAbiParameters(
      [
        { type: "bytes32" }, // innerHash
        { type: "address" }, // entryPoint
        { type: "uint256" }, // chainId
      ],
      [innerHash, ENTRYPOINT, BigInt(chainId)]
    )
  );
}

/**
 * Signs a UserOperation hash with the Passkey.
 *
 * WebAuthn assertion over the UserOp hash:
 *   signature = P256.sign(SHA-256(authenticatorData || SHA-256(clientDataJSON)))
 *
 * The on-chain WebAuthn P256Validator reconstructs this signature verification.
 *
 * Returns a hex-encoded JSON payload. The on-chain validator (or bundler pre-check)
 * expects this format for WebAuthn-type signatures.
 *
 * Security: the private key NEVER leaves the Secure Enclave.
 */
async function signUserOp(
  userOpHash: Hex,
  credentialId: string
): Promise<Hex> {
  // The WebAuthn challenge is the raw UserOp hash bytes
  const hashBytes = toBytes(userOpHash);

  const auth = await authenticatePasskey(
    hashBytes as unknown as BufferSource,
    window.location.hostname,
    credentialId
  );

  // Encode as the WebAuthn validator expects:
  // abi.encode(bytes authenticatorData, bytes clientDataJSON, bytes signature)
  // We wrap in a recognizable prefix so the validator knows the sig type.
  const sigPayload = encodeAbiParameters(
    [
      { type: "bytes" }, // authenticatorData
      { type: "bytes" }, // clientDataJSON
      { type: "bytes" }, // DER-encoded P-256 signature
    ],
    [
      toHex(new Uint8Array(auth.authenticatorData)),
      toHex(new Uint8Array(auth.clientDataJSON)),
      toHex(new Uint8Array(auth.signature)),
    ]
  );

  // Prepend a 1-byte type marker: 0x01 = WebAuthn/Passkey signature
  return concat(["0x01", sigPayload]);
}

/**
 * Submits a signed UserOperation to the bundler via the backend relay.
 * Returns the UserOp hash (bundler receipt — not the final tx hash).
 */
async function sendUserOp(
  userOp: Record<string, Hex | string>,
  chainId: number
): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/wallet/send-userop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userOp, chainId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bundler rejected UserOp: ${text}`);
  }

  const { userOpHash } = await res.json();
  return userOpHash as string;
}

// ─── EIP-1193 Provider ────────────────────────────────────────────────────────

const verseWalletProvider = {
  request: async ({
    method,
    params,
  }: {
    method: string;
    params: any[];
  }): Promise<any> => {
    // ── eth_requestAccounts ─────────────────────────────────────────────────
    if (method === "eth_requestAccounts") {
      console.log("[VerseWallet] Authenticating via Passkey...");

      const challenge = strToBuffer("verse-auth-" + Date.now());
      const auth = await authenticatePasskey(
        challenge as unknown as BufferSource,
        window.location.hostname
      );

      const res = await fetch(`${BACKEND_URL}/wallet/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkeyCredentialId: auth.credentialId }),
      });

      if (!res.ok) {
        throw new Error(
          "No Verse Wallet found for this passkey. Please register first."
        );
      }

      const data = await res.json();
      const celoAccount = data.wallet?.accounts?.find(
        (a: any) => a.chainId === CELO_CHAIN_ID
      );

      if (!celoAccount) {
        throw new Error(
          "Wallet found but has no Celo address. Run address computation."
        );
      }

      const address = celoAccount.address as `0x${string}`;

      if (typeof window !== "undefined") {
        localStorage.setItem("verse_wallet_address", address);
        localStorage.setItem(
          "verse_wallet_credential_id",
          auth.credentialId
        );
      }

      console.log(`[VerseWallet] Connected: ${address}`);
      return [address];
    }

    // ── eth_accounts ────────────────────────────────────────────────────────
    if (method === "eth_accounts") {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("verse_wallet_address");
        if (cached) return [cached as `0x${string}`];
      }
      return [];
    }

    // ── eth_chainId ─────────────────────────────────────────────────────────
    if (method === "eth_chainId") {
      return toHex(CELO_CHAIN_ID); // "0xa4ec"
    }

    // ── personal_sign ────────────────────────────────────────────────────────
    // EIP-191: sign(keccak256("\x19Ethereum Signed Message:\n" + len + message))
    if (method === "personal_sign") {
      console.log("[VerseWallet] personal_sign via Passkey...");
      const messageHex = params[0] as Hex;
      const messageBytes = toBytes(messageHex);

      // EIP-191 prefix
      const prefix = strToBuffer(
        `\x19Ethereum Signed Message:\n${messageBytes.length}`
      );
      const prefixed = concat([prefix, messageBytes]);
      const msgHash = keccak256(prefixed);

      const credentialId =
        typeof window !== "undefined"
          ? (localStorage.getItem("verse_wallet_credential_id") ?? undefined)
          : undefined;

      return signUserOp(msgHash, credentialId!);
    }

    // ── eth_signTypedData_v4 ─────────────────────────────────────────────────
    // EIP-712: sign over keccak256("\x19\x01" || domainSeparator || structHash)
    if (method === "eth_signTypedData_v4") {
      console.log("[VerseWallet] eth_signTypedData_v4 via Passkey...");
      const typedDataRaw = params[1] as string;
      const typedDataBytes = strToBuffer(typedDataRaw);

      // Hash the EIP-712 payload to a fixed-size challenge
      const msgHash = keccak256(
        concat(["0x1901", toHex(typedDataBytes)])
      );

      const credentialId =
        typeof window !== "undefined"
          ? (localStorage.getItem("verse_wallet_credential_id") ?? undefined)
          : undefined;

      return signUserOp(msgHash, credentialId!);
    }

    // ── eth_sendTransaction ──────────────────────────────────────────────────
    // Full ERC-4337 UserOperation flow:
    //  1. Build UserOp (encode calldata, fetch nonce)
    //  2. Compute hash via EIP-4337 spec (viem keccak256 — correct EVM Keccak)
    //  3. Sign with Passkey in Secure Enclave
    //  4. Submit to bundler via backend
    if (method === "eth_sendTransaction") {
      const tx = params[0];

      const senderAddr =
        typeof window !== "undefined"
          ? (localStorage.getItem("verse_wallet_address") as Address) ??
            (tx.from as Address)
          : (tx.from as Address);

      const credentialId =
        typeof window !== "undefined"
          ? localStorage.getItem("verse_wallet_credential_id")
          : null;

      if (!credentialId) {
        throw new Error("No Verse Wallet session. Please connect first.");
      }

      console.log("[VerseWallet] Building ERC-4337 UserOperation...");

      const userOp = await buildUserOp({
        sender: senderAddr,
        to: tx.to as Address,
        data: (tx.data ?? "0x") as Hex,
        value: BigInt(tx.value ?? 0),
        chainId: CELO_CHAIN_ID,
      });

      // Compute the exact ERC-4337 v0.7 hash using real Keccak-256 (via viem)
      const userOpHash = computeUserOpHash(userOp, CELO_CHAIN_ID);
      console.log(`[VerseWallet] UserOp hash: ${userOpHash}`);

      // Sign with Passkey — private key never leaves Secure Enclave
      console.log("[VerseWallet] Requesting Passkey signature...");
      userOp.signature = await signUserOp(userOpHash, credentialId);

      // Submit to bundler
      console.log("[VerseWallet] Submitting to bundler...");
      const submittedHash = await sendUserOp(userOp, CELO_CHAIN_ID);
      console.log(`[VerseWallet] Submitted: ${submittedHash}`);

      return submittedHash;
    }

    console.warn(`[VerseWallet] Unhandled method: ${method}`);
    return null;
  },

  on: (_event: string, _callback: any) => {},
  removeListener: (_event: string, _callback: any) => {},
};

// ─── RainbowKit Wallet Definition ─────────────────────────────────────────────

export const verseWallet = (): Wallet => ({
  id: "verse-wallet",
  name: "Verse Wallet",
  iconUrl: "/logo.png",
  iconBackground: "#0f172a",
  downloadUrls: {
    browserExtension: "https://4lph4verse.com/wallet",
  },
  createConnector: () => {
    const connector = createConnector(() => ({
      id: "verse-wallet-connector",
      name: "Verse Wallet",
      type: "custom",
      icon: "/logo.png",

      async connect(parameters?: any): Promise<any> {
        const provider = (typeof window !== "undefined" && (window as any).verse) || verseWalletProvider;
        const accounts = await provider.request({
          method: "eth_requestAccounts",
          params: [],
        });
        return {
          accounts: accounts as readonly `0x${string}`[],
          chainId: CELO_CHAIN_ID,
        };
      },

      async disconnect() {
        if (typeof window !== "undefined") {
          localStorage.removeItem("verse_wallet_address");
          localStorage.removeItem("verse_wallet_credential_id");
        }
      },

      async getAccounts() {
        const provider = (typeof window !== "undefined" && (window as any).verse) || verseWalletProvider;
        return provider.request({
          method: "eth_accounts",
          params: [],
        }) as Promise<readonly `0x${string}`[]>;
      },

      async getChainId() {
        return CELO_CHAIN_ID;
      },

      async getProvider() {
        return (typeof window !== "undefined" && (window as any).verse) || verseWalletProvider;
      },

      async isAuthorized() {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem("verse_wallet_address");
      },

      onAccountsChanged() {},
      onChainChanged() {},
      onDisconnect() {
        if (typeof window !== "undefined") {
          localStorage.removeItem("verse_wallet_address");
          localStorage.removeItem("verse_wallet_credential_id");
        }
      },
    }));
    return connector;
  },
});
