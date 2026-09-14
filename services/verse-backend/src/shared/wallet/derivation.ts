/**
 * Verse Wallet — Off-Chain Address Derivation Utilities — ⚠️ UNVERIFIED
 *
 * NestJS-compatible (CommonJS) implementation of the derivation formula
 * modeled after KernelFactory.sol (v3.1).
 *
 * STATUS: UNVERIFIED. The ERC1967 proxy creation code is a PLACEHOLDER.
 * This module MUST NOT be treated as producing correct addresses until:
 *   1. The real proxy bytecode hash is substituted from ZeroDev's deployment registry
 *   2. A testnet deployment on Base Sepolia confirms computed address == on-chain address
 *
 * ── KernelFactory.sol (line 25) ─────────────────────────────────────────
 *   actualSalt = keccak256(abi.encodePacked(data, salt))
 *
 * ── Verse Input Salt ────────────────────────────────────────────────────
 *   verseInputSalt = keccak256(
 *     keccak256("verse.v1") || bytes32(VERSION=1) || walletIdentityId || bytes32(accountIndex)
 *   )
 *
 * ── walletIdentityId ────────────────────────────────────────────────────
 *   walletIdentityId = keccak256("verse.wallet.identity.v1" || walletIdentitySeed)
 *   (seed is 32 secure random bytes — NEVER stored by backend, INV-04)
 *
 * ── INV-21 ──────────────────────────────────────────────────────────────
 *   actualSalt = keccak256(initCalldata || verseInputSalt)
 *
 * ── INV-25 ──────────────────────────────────────────────────────────────
 *   Address depends on walletIdentityId AND initial passkey public key.
 *   Address is stable AFTER deployment. (INV-23)
 */

import {
  keccak256,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  getContractAddress,
  concat,
  toBytes,
  toHex,
  type Address,
  type Hex,
} from 'viem';

// ──────────────────────────────────────────────────────────────────────────────
// Protocol Constants (FROZEN — changing these changes all wallet addresses)
// ──────────────────────────────────────────────────────────────────────────────

export const VERSE_DOMAIN_SEPARATOR = 'verse.v1';
export const WALLET_IDENTITY_DOMAIN = 'verse.wallet.identity.v1';
export const DERIVATION_VERSION = 1n;

export const ENTRYPOINT_V07_ADDRESS =
  '0x0000000071727De22E5E9d8BAf0edAc6f37da032' as const;

// ──────────────────────────────────────────────────────────────────────────────
// Kernel ABI (minimal — only initialize() is needed for derivation)
// ──────────────────────────────────────────────────────────────────────────────

const KERNEL_INITIALIZE_ABI = [
  {
    name: 'initialize',
    type: 'function',
    inputs: [
      { name: '_rootValidator', type: 'bytes21' },
      { name: 'hook', type: 'address' },
      { name: 'validatorData', type: 'bytes' },
      { name: 'hookData', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

/**
 * ERC-1967 proxy creation code prefix.
 *
 * ⚠️ UNVERIFIED PLACEHOLDER. This is NOT the actual bytecode used by the
 * deployed KernelFactory. The address derivation output is NOT correct until
 * the real bytecode is substituted from ZeroDev's deployment registry.
 *
 * Pre-implementation checklist: fetch the exact ERC1967Proxy creation code
 * for each target chain before activating any chain.
 */
const ERC1967_PROXY_CREATION_CODE_PREFIX: Hex =
  '0x60806040526040516104e73803806104e7833981016040819052610023916100d9565b61002f82826000610036565b50506101b3565b61003f83610061565b60008251118061004c5750805b1561005c5761005a83836100a1565b505b505050565b610066816100cd565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606100c6838360405180606001604052806027815260200161046060279139610188565b9392505050565b803b6100e85760006000fd5b50565b600080604083850312156100ec57600080fd5b82516001600160a01b038116811461010357600080fd5b602084015190925067ffffffffffffffff8082111561012157600080fd5b818501915085601f83011261013557600080fd5b81518181111561014757610147610199565b604051601f8201601f19908116603f0116810190838211818310171561016f5761016f610199565b8160405282815288602084870101111561018857600080fd5b6101998360208301602088016101af565b80955050505050509250929050565b634e487b7160e01b600052604160045260246000fd5b60005b838110156101ca5781810151838201526020016101b2565b50506000910152565b610304806101e26000396000f3fe';

// ──────────────────────────────────────────────────────────────────────────────
// Core Derivation Functions
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Derives walletIdentityId from a 32-byte seed.
 *
 * walletIdentityId = keccak256("verse.wallet.identity.v1" || walletIdentitySeed)
 *
 * INV-01: The result is immutable after creation.
 * INV-04: The seed MUST be discarded immediately after calling this function.
 */
export function deriveWalletIdentityId(walletIdentitySeed: Buffer): Hex {
  if (walletIdentitySeed.length !== 32) {
    throw new Error(
      `walletIdentitySeed must be 32 bytes, got ${walletIdentitySeed.length}`,
    );
  }
  const domain = toBytes(WALLET_IDENTITY_DOMAIN);
  const combined = concat([domain, new Uint8Array(walletIdentitySeed)]);
  return keccak256(combined);
}

/**
 * Computes the Verse protocol-level input salt.
 *
 * verseInputSalt = keccak256(
 *   keccak256("verse.v1") || bytes32(VERSION) || walletIdentityId || bytes32(accountIndex)
 * )
 *
 * This is passed as the `salt` argument to KernelFactory.createAccount(data, salt).
 * The factory then hashes it with `data` to produce the actual CREATE2 salt (INV-21).
 */
export function computeVerseInputSalt(
  walletIdentityId: Hex,
  accountIndex: number,
): Hex {
  const domainSepHash = keccak256(toHex(VERSE_DOMAIN_SEPARATOR));
  return keccak256(
    encodeAbiParameters(
      [
        { type: 'bytes32' }, // keccak256(DOMAIN_SEPARATOR)
        { type: 'bytes32' }, // VERSION
        { type: 'bytes32' }, // walletIdentityId
        { type: 'uint256' }, // accountIndex
      ],
      [
        domainSepHash,
        toHex(DERIVATION_VERSION, { size: 32 }),
        walletIdentityId,
        BigInt(accountIndex),
      ],
    ),
  );
}

/**
 * Encodes the Kernel ValidationId for the passkey validator.
 *
 * Kernel v3 format: bytes21 = bytes1(0x01) || address(validatorContract)
 * 0x01 = VALIDATION_TYPE_MODULE (sudo/root validator)
 */
export function encodeValidationId(validatorAddress: Address): Hex {
  return concat(['0x01', validatorAddress]);
}

/**
 * Encodes the initCalldata for Kernel.initialize().
 *
 * This is the `data` argument to KernelFactory.createAccount(data, salt).
 * It contains the initial root validator (passkey) and its public key data.
 *
 * INV-25: Changing the passkey public key changes this data → changes the address.
 * INV-26: Kernel.initialize() accepts exactly ONE root validator.
 */
export function encodeKernelInitCalldata(params: {
  passkeyValidatorAddress: Address;
  initialPasskeyX: bigint;
  initialPasskeyY: bigint;
}): Hex {
  const rootValidatorId = encodeValidationId(params.passkeyValidatorAddress);

  const validatorData = encodeAbiParameters(
    [{ type: 'uint256' }, { type: 'uint256' }],
    [params.initialPasskeyX, params.initialPasskeyY],
  );

  return encodeFunctionData({
    abi: KERNEL_INITIALIZE_ABI,
    functionName: 'initialize',
    args: [
      rootValidatorId,
      '0x0000000000000000000000000000000000000000', // no hook
      validatorData,
      '0x',
    ],
  });
}

/**
 * ⚠️ UNVERIFIED — Computes the proxy bytecode hash used in CREATE2.
 *
 * Uses PLACEHOLDER bytecode. Output is not correct for production.
 *
 * The ERC1967Proxy is deployed with:
 *   bytecode = creationCodePrefix || abi.encode(kernelImpl, initCalldata)
 *
 * The KernelFactory atomically deploys + initializes via the proxy constructor.
 */
export function computeProxyBytecodeHash(
  kernelImplAddress: Address,
  initCalldata: Hex,
): Hex {
  const constructorArgs = encodeAbiParameters(
    [{ type: 'address' }, { type: 'bytes' }],
    [kernelImplAddress, initCalldata],
  );
  const fullBytecode = concat([
    ERC1967_PROXY_CREATION_CODE_PREFIX,
    constructorArgs,
  ]);
  return keccak256(fullBytecode);
}

// ──────────────────────────────────────────────────────────────────────────────
// Main Entry Point
// ──────────────────────────────────────────────────────────────────────────────

export interface ComputeWalletAddressParams {
  /** 0x-prefixed 32-byte hex wallet identity anchor. */
  walletIdentityId: Hex;
  /** 0 = primary account. */
  accountIndex: number;
  /** P-256 public key X coordinate of the initial passkey. */
  initialPasskeyX: bigint;
  /** P-256 public key Y coordinate of the initial passkey. */
  initialPasskeyY: bigint;
  /** Address of the WebAuthn validator module on the target chain. */
  passkeyValidatorAddress: Address;
  /** Address of the KernelFactory on the target chain. */
  kernelFactoryAddress: Address;
  /** Address of the Kernel v3.1 implementation on the target chain. */
  kernelImplAddress: Address;
}

/**
 * ⚠️ UNVERIFIED — Computes the deterministic counterfactual CREATE2 address.
 *
 * Implements the formula from Architecture v6 §5, modeled after
 * KernelFactory.sol line 25: actualSalt = keccak256(abi.encodePacked(data, salt))
 *
 * UNVERIFIED: The proxy bytecode is a placeholder. The address returned by this
 * function is NOT confirmed to match any on-chain deployment. Do not use this
 * output as authoritative until testnet verification is complete.
 *
 * INV-21: actualSalt = keccak256(initCalldata || verseInputSalt)
 * INV-23: Stable AFTER deployment; changes BEFORE if initial passkey changes.
 * INV-25: Address depends on walletIdentityId AND initial passkey public key.
 */
export function computeWalletAddress(
  params: ComputeWalletAddressParams,
): Address {
  // 1. Protocol-level input salt
  const verseInputSalt = computeVerseInputSalt(
    params.walletIdentityId,
    params.accountIndex,
  );

  // 2. initCalldata for Kernel.initialize()
  const initCalldata = encodeKernelInitCalldata({
    passkeyValidatorAddress: params.passkeyValidatorAddress,
    initialPasskeyX: params.initialPasskeyX,
    initialPasskeyY: params.initialPasskeyY,
  });

  // 3. KernelFactory.sol line 25: actualSalt = keccak256(abi.encodePacked(data, salt))
  const actualSalt = keccak256(
    encodePacked(['bytes', 'bytes32'], [initCalldata, verseInputSalt]),
  );

  // 4. Proxy bytecode hash
  const bytecodeHash = computeProxyBytecodeHash(
    params.kernelImplAddress,
    initCalldata,
  );

  // 5. CREATE2: address = keccak256(0xff || factory || actualSalt || bytecodeHash)[12:]
  return getContractAddress({
    from: params.kernelFactoryAddress,
    salt: actualSalt,
    bytecodeHash,
    opcode: 'CREATE2',
  });
}
